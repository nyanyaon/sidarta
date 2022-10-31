import * as puppeteer from "puppeteer-core";
import * as fs from 'fs';

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

export class Bot {
    private static browser: puppeteer.Browser;

    static async getBukuTanahOption(): Promise<BukuTanahOption> {
        try {
            Bot.browser = await puppeteer.launch({
                userDataDir: './datadir',
                args: ["--no-sandbox"],
                headless: true,
            });

            const page = await Bot.browser.newPage();

            const cookiesStr = fs.readFileSync('./cookies.json').toString();
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            console.log("cookie load");

            await page.goto("https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah", {
                waitUntil: 'networkidle2',
            });

            await page.waitForNetworkIdle();

            const stateId = await page.$eval("#cari-hat_inputwilayah_SelectedKabupaten > option", (el: HTMLOptionElement) => {
                return el.value;
            });

            const desa = await page.goto(`https://dokumen.atrbpn.go.id/KriteriaPencarian/GetWilayah?kode=${stateId}&tipe=keca&inkantor=True&aktif=false`);
            const dataDesaJSON: Desa[] = await desa.json();
            const kecamatan = await page.goto(`https://dokumen.atrbpn.go.id/KriteriaPencarian/GetWilayah?kode=${stateId}&tipe=kabk&inkantor=True&aktif=false`);
            const dataKecamatanJSON: Kecamatan[] = await kecamatan.json();

            return {
                dataDesaJSON,
                dataKecamatanJSON
            }
        } catch (err) {
            console.log(err);

        }
    }
}