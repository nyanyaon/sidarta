import * as puppeteer from 'puppeteer-core';
import { Bot } from './Bot';
import * as fs from 'fs';
import App from './App';

export class AuthSSO extends Bot {
    static browser: puppeteer.Browser;

    async save(username: string, password: string) {
        try {

            AuthSSO.browser = await this.init(true);

            const page = await AuthSSO.browser.newPage();

            page.on('response', async (response) => {
                const url = response.url();

                if (url.includes("token")) {
                    console.log(`URL: ${url}`);
                    console.log(`JSON: ${JSON.stringify(await response.json())}`);

                    if (response.status() !== 200) {
                        App.send('auth-error');
                        await AuthSSO.browser.close();
                        return;
                    }

                    App.send('auth:token', await response.json());
                }
            });

            await page.goto('https://statistik.atrbpn.go.id/', {
                waitUntil: 'networkidle2',
            });

            await page.type('#username', username);
            await page.type('#inputPassword', password);

            await page.click('#kc-next');

        } catch (err) {
            console.log(err);
        }
    }

    async verify(otp: string) {
        try {

            const pages = await AuthSSO.browser.defaultBrowserContext().pages();
            const currPage = pages[1];

            await currPage.type('#otp-field>input', otp);
            await currPage.click('#kc-login');

            await currPage.waitForNavigation({
                waitUntil: 'networkidle2',
                timeout: 9999999
            });

            await currPage.goto('https://aplikasi.atrbpn.go.id/pintasan', {
                waitUntil: 'networkidle2',
            });

            await currPage.waitForNetworkIdle();

            const name = await currPage.$eval('p > b', el => el.textContent);
            
            App.send('auth:success', name);
            
            const client = await currPage.target().createCDPSession();
            const cookies = (await client.send('Network.getAllCookies')).cookies;
            fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
            
            await currPage.waitForNetworkIdle();

            await AuthSSO.browser.close();
        } catch (err) {
            console.log(err);
        }
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