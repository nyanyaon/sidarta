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
    tipe?: any;
    induk: string;
    validsejak: Date;
    validsampai?: Date;
}

export interface Kecamatan {
    wilayahid: string;
    kode: string;
    nama: string;
    tipewilayahid: number;
    tipe?: any;
    induk: string;
    validsejak: Date;
    validsampai?: Date;
}

export interface BotInterface {
    start(kecamatan: string, desa: string): void;
}

export class Bot {
    browser: puppeteer.Browser;

    async init(headless: boolean = true): Promise<puppeteer.Browser> {
        const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"

        return await puppeteer.launch({
            defaultViewport: null,
            userDataDir: './datadir',
            args: [
                "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42",
                "--no-sandbox",
            ],
            headless,
            executablePath: EDGE_PATH,
        });
    }

    async getOptions(): Promise<UploadOption> {
        try {
            this.browser = await this.init(false);
            
            App.send('app:updateDialog', 'Memulai jendela baru...');

            const page = await this.browser.newPage();

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42"');
            await page.setBypassCSP(false);

            const cookiesStr = fs.readFileSync('./cookies.json').toString();
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            App.send('app:updateDialog', 'Menyiapkan Cookies...');

            await page.goto("https://dokumen.atrbpn.go.id/", {
                waitUntil: "networkidle2",
            });

            await page.waitForNetworkIdle({timeout: 0});

            App.send('app:updateDialog', 'Menuju Dokumen...');
            
            if(page.url() == 'https://dokumen.atrbpn.go.id/Account/Denied') {
                await this.exit();
            }

            App.send('app:updateDialog', 'Menyiapkan data...');

            const stateId = await page.$eval("#cari-hat_inputwilayah_SelectedKabupaten > option", (el: HTMLOptionElement) => {
                return el.value;
            });

            const desa = await page.goto(`https://dokumen.atrbpn.go.id/KriteriaPencarian/GetWilayah?kode=${stateId}&tipe=keca&inkantor=True&aktif=false`);
            const dataDesaJSON: Desa[] = await desa.json();
            App.send('app:updateDialog', 'Data desa sukses...');

            const kecamatan = await page.goto(`https://dokumen.atrbpn.go.id/KriteriaPencarian/GetWilayah?kode=${stateId}&tipe=kabk&inkantor=True&aktif=false`);
            const dataKecamatanJSON: Kecamatan[] = await kecamatan.json();
            App.send('app:updateDialog', 'Data kecamatan sukses...');

            await this.exit();

            return {
                dataDesaJSON,
                dataKecamatanJSON
            }
        } catch (err) {
            console.log(err);
        }
    }

    async exit() {
        await this.browser.close();
        this.browser = null;
    }
}