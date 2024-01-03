import * as puppeteer from "puppeteer-core";
import * as fs from 'fs';
import App from "./App";

export interface UploadOption {
    dataDesaJSON: Desa[];
    dataKecamatanJSON: Kecamatan[];
}

export interface Desa {
    wilayahid: string;
    kode: string;
    nama: string;
    tipewilayahid: number;
    induk: string;
    validsejak: string;
    validsampai?: string;
    statusgeometri: number;
}

export interface Kecamatan {
    wilayahid: string;
    kode: string;
    nama: string;
    tipewilayahid: number;
    induk: string;
    validsejak: string;
    validsampai?: any;
    statusgeometri: number;
}
export interface Kabupaten {
    wilayahid: string;
    kode: string;
    nama: string;
    tipewilayahid: number;
    induk: string;
    validsejak: string;
    validsampai?: any;
    statusgeometri: number;
}

export interface BotInterface {
    start(kecamatan: string, desa: string): void;
}

export class Bot {
    browser: puppeteer.Browser;
    EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"

    async login(user: string, pass: string) {
        this.browser = await this.init(false);

        const page = await this.browser.newPage();

        await page.goto("https://entridokumen.atrbpn.go.id/");

        await page.waitForNetworkIdle({ timeout: 0 });

        const isLogin = await page.$('#right_col > div.x_panel > div.x_title > h2');

        if (isLogin == null) {
            await page.type('#username', user);
            await page.type('#inputPassword', pass);

            await page.click('#kc-next');

            await page.waitForNavigation({
                timeout: 0
            });
        } else {   
            await page.waitForNetworkIdle({
                timeout: 0,
            });
        }

        return page;
    }

    async init(headless = true): Promise<puppeteer.Browser> {

        return await puppeteer.launch({
            defaultViewport: null,
            userDataDir: './datadir',
            args: [
                "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42",
                "--no-sandbox",
            ],
            headless,
            executablePath: this.EDGE_PATH,
        });
    }

    async prejob(concurency: number) {
        console.log("run job: ", concurency);
    }
}