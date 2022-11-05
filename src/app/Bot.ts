import * as puppeteer from "puppeteer";


export interface BukuTanahOption {
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
        return await puppeteer.launch({
            userDataDir: './datadir',
            args: ["--no-sandbox"],
            headless,
        });
    }

    async exit() {
        this.browser.close();
        this.browser = null;
    }
}