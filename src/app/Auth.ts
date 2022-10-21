import * as edgePaths from 'edge-paths';
import * as puppeteer from 'puppeteer-core';
import * as fs from 'fs';

export class Auth {
    static EDGE_PATH = edgePaths.getEdgePath();
    private static browser: puppeteer.Browser;

    static async save() {
        Auth.browser = await puppeteer.launch({
            executablePath: Auth.EDGE_PATH,
            headless: false
        });

        const page = await Auth.browser.newPage();

        await page.goto('https://aplikasi.atrbpn.go.id/login', {
            waitUntil: 'networkidle2',
        });

        await page.type('#username', '199005172014021002');
        await page.type('#inputPassword', '@PANDU170590');

        await page.click('#kc-next');

        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: 9999999
        });

        const cookies = await page.cookies();
        fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));

        console.log("cookie save");
    }

    static async start() {
        Auth.browser = await puppeteer.launch({
            executablePath: Auth.EDGE_PATH,
            headless: false
        });

        const page = await Auth.browser.newPage();

        const cookiesStr = fs.readFileSync('./cookies.json').toString();
        const cookies = JSON.parse(cookiesStr);
        await page.setCookie(...cookies);

        console.log("cookie load");

        await page.goto('https://aplikasi.atrbpn.go.id/login', {
            waitUntil: 'networkidle2',
        });

    }
}