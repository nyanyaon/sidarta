import { Bot } from './Bot';
import * as fs from 'fs';
import App from './App';

export class AuthSSO extends Bot {

    async save(username: string, password: string) {
        try {

            this.browser = await this.init(false);

            const page = await this.browser.newPage();

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42"');
            await page.setBypassCSP(false);

            await page.goto('https://peta.atrbpn.go.id/', {
                waitUntil: 'networkidle2',
            });

            await page.type('#username', username);
            await page.type('#inputPassword', password);

            await page.click('#kc-next');


            const resHandler = await page.waitForResponse(async (res) => {
                const url = res.url();

                if (url.includes("token")) {
                    console.log(`URL: ${url}`);
                    console.log(`JSON: ${JSON.stringify(await res.json())}`);

                    if (res.status() !== 200) {
                        App.send('auth-error');
                        await this.browser.close();
                        return;
                    }

                    App.send('auth:token', await res.json());
                }

                return true;
            });

            const otpInput = await page.$('#otp-field>input');


            if(otpInput === null) {
                App.send('auth:hideOTP', true);
            }

            resHandler.ok();


            return false;

        } catch (err) {
            console.log(err);
        }
    }

    async verify(otp: string, kantor: string) {
        try {

            const pages = await this.browser.pages();
            const currPage = pages[1];
            
            const otpInput = await currPage.$('#otp-field>input');

            if(otpInput !== null) {
                await otpInput.type(otp);
            }

            await currPage.select('#kantor', kantor);

            await currPage.click('#kc-login');
            App.send('app:updateDialog', 'Menekan tombol...');
            
            await currPage.waitForNavigation({
                waitUntil: 'networkidle2',
                timeout: 9999999
            });
            App.send('app:updateDialog', 'Sukses...');

            App.send('app:updateDialog', 'Menuju pintasan...');
        
            await currPage.goto('https://aplikasi.atrbpn.go.id/pintasan');
            
            App.send('app:updateDialog', 'Jaringan stabil...');

            await currPage.waitForNavigation();

            const name = await currPage.$eval('body > header > div.container.text-center > p > b', el => el.textContent);

            App.send('auth:success', name);

            const client = await currPage.target().createCDPSession();
            const cookies = (await client.send('Network.getAllCookies')).cookies;
            fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));

            await this.close();

            return false;
        } catch (err) {
            console.log(err);
        }
    }

    async close() {
        await this.browser.close();
    }

    async start(headless: boolean) {
        try {

            this.browser = await this.init(true);

            const page = await this.browser.newPage();

            const cookiesStr = fs.readFileSync('./cookies.json').toString();
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            console.log("cookie load");

            await page.goto('https://aplikasi.atrbpn.go.id/pintasan', {
                waitUntil: 'networkidle2',
            });

            const name = await page.$eval('p > b', el => el.textContent);

            App.send('auth:success', name);

            if (headless === true) await this.browser.close();

        } catch (err) {
            if (headless === true) await this.browser.close();
            console.log(err);
        }
    }
}