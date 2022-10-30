import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import App from './App';

export class Auth {
    private static browser: puppeteer.Browser;

    static async save(username: string, password: string) {
        try {

            Auth.browser = await puppeteer.launch({
                userDataDir: './datadir',
                args: ["--no-sandbox"],
                headless: false,
            });

            const page = await Auth.browser.newPage();

            await page.goto('https://kkp2.atrbpn.go.id/', {
                waitUntil: 'networkidle2',
            });

            await page.type('#lg_username', username);
            await page.type('#inputPassword', password);

            await page.click('#btn-login');

            await page.waitForNetworkIdle();

            const name = await page.$eval('h3.welcome', el => el.textContent);

            App.send('auth-success', name);

            await Auth.browser.close();

            Auth.browser = null;
        } catch (err) {
            console.log(err);
        }
    }

    static async start(headless: boolean) {
        try {

            Auth.browser = await puppeteer.launch({
                userDataDir: './datadir',
                args: ["--no-sandbox"],
                headless,
            });

            const page = await Auth.browser.newPage();

            // const cookiesStr = fs.readFileSync('./cookies.json').toString();
            // const cookies = JSON.parse(cookiesStr);
            // await page.setCookie(...cookies);

            // console.log("cookie load");

            await page.goto('https://kkp2.atrbpn.go.id/', {
                waitUntil: 'networkidle2',
            });

            const name = await page.$eval('h3.welcome', el => el.textContent);

            App.send('auth-success', name);

            if (headless === true) await Auth.browser.close();

        } catch (err) {
            if (headless === true) await Auth.browser.close();
            console.log(err);
        }
    }
}