import * as edgePaths from 'edge-paths';
import * as puppeteer from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';
import App from './App';

export class Auth {
    static EDGE_PATH = edgePaths.getEdgePath();
    private static browser: puppeteer.Browser;

    static async save(username: string, password: string) {
        Auth.browser = await puppeteer.launch({
            executablePath: Auth.EDGE_PATH,
            userDataDir: path.join(__dirname, './datadir'),
            headless: false,
        });

        const page = await Auth.browser.newPage();

        await page.goto('https://aplikasi.atrbpn.go.id/pintasan', {
            waitUntil: 'networkidle2',
        });

        await page.type('#username', username);
        await page.type('#inputPassword', password);

        await page.click('#kc-next');

        page.on('response', async (response) => {
            const url = response.url();

            if (url.includes("token")) {
                console.log(`URL: ${url}`);
                console.log(`JSON: ${JSON.stringify(await response.json())}`);

                if(response.status() !== 200) {
                    App.send('auth-error');
                    return;
                }

                App.send('auth-token', await response.json());
            }
        });
    }

    static async verify(otp: string) {
        const pages = await Auth.browser.defaultBrowserContext().pages();
        const currPage = pages[1];

        console.log(otp);
        await currPage.type('#otp-field>input', otp);
        await currPage.click('#kc-login');

        await currPage.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: 9999999
        });

        await currPage.goto('https://aplikasi.atrbpn.go.id/pintasan', {
            waitUntil: 'networkidle2',
        });

        const cookies = await currPage.cookies();
        fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));

        const name = await currPage.$eval('p > b', el => el.textContent);

        App.send('auth-success', name);

        // await Auth.browser.close();
    }

    static async start() {
        Auth.browser = await puppeteer.launch({
            executablePath: Auth.EDGE_PATH,
            userDataDir: path.join(__dirname, './datadir'),
            headless: false,
        });

        const page = await Auth.browser.newPage();

        // const cookiesStr = fs.readFileSync('./cookies.json').toString();
        // const cookies = JSON.parse(cookiesStr);
        // await page.setCookie(...cookies);

        console.log("cookie load");

        await page.goto('https://aplikasi.atrbpn.go.id/pintasan', {
            waitUntil: 'networkidle2',
        });

    }
}