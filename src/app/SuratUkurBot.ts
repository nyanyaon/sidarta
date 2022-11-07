import { Bot } from './Bot';
import { FileInterface } from './Fileman';
import * as fs from 'fs';
import { ElementHandle } from 'puppeteer';
import { Database } from './db/Database';
import SuratUkur from './models/SuratUkur';

export class SuratUkurBot extends Bot {

    async start(kecamatan: string, desa: string, files: FileInterface[], loc: string) {
        try {
            this.browser = await this.init(false);
            const db = new Database();
            await db.connect();

            const col = db.getCollection('suratukur');
            const page = await this.browser.newPage();

            const cookiesStr = fs.readFileSync('./cookies.json').toString();
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            console.log("cookie load");

            for (const file of files) {
                if(file.isUploaded) {
                    continue;
                }

                if(!file.isValid) {
                    continue;
                }

                await page.goto("https://dokumen.atrbpn.go.id/DokumenPengukuran/SuratUkur");
                await page.waitForSelector("#cari-su_inputwilayah_SelectedDesa");
                await page.waitForTimeout(2000);

                await page.click("#divkecamatan > div > span.select2.select2-container.select2-container--default");
                await page.type("#frmCariSU > span > span > span.select2-search.select2-search--dropdown > input", kecamatan);
                await page.click("#select2-cari-su_inputwilayah_SelectedKecamatan-results > li:nth-child(1)");

                await page.click("#divdesa > div > span.select2.select2-container.select2-container--default");
                await page.type("#frmCariSU > span > span > span.select2-search.select2-search--dropdown > input", desa);
                await page.click("#select2-cari-su_inputwilayah_SelectedDesa-results > li:nth-child(1)");

                await page.click("#frmCariSU > div:nth-child(7) > div > span");
                await page.type("body > span > span > span.select2-search.select2-search--dropdown > input", file.tipe);
                await page.click("#select2-lsttipe-results > li:nth-child(1)");

                await page.type("#NomorSU", file.nomor);
                await page.type("#TahunSU", file.tahun);

                await page.click("#btncarisu", { clickCount: 1, delay: 200 });
                await page.waitForNetworkIdle();
                if(await page.waitForSelector("#listsuplaceholder > tr") == null) {
                    console.log("[ERROR] : " + file.nama + " tidak ditemukan");
                    continue;
                }
                await page.click("#listsuplaceholder > tr > td:nth-child(4)", { clickCount: 1, delay: 200 });
                await page.waitForNetworkIdle();
                await page.waitForSelector("#btnUploadSU", { visible: true });
                await page.click("#btnUploadSU", { clickCount: 1, delay: 200 });
                await page.waitForNetworkIdle();

                let upload: ElementHandle<HTMLInputElement> = await page.$("#susideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]") as ElementHandle<HTMLInputElement>;
                while (upload == null) {
                    console.log("Mencoba kembali...");
                    await page.click("#btnUpldArsipBT", { delay: 500 });
                    upload = await page.$("#hatsideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]") as ElementHandle<HTMLInputElement>;
                }
                // const slow3g = puppeteer.networkConditions['Slow 3G'];
                // await page.emulateNetworkConditions(slow3g);

                await upload.uploadFile(`${loc}/${file.nama}`);
                await page.waitForNetworkIdle();
                await page.click("#btnUpldArsipBTHAT", { clickCount: 1, delay: 200 });
                await page.waitForSelector("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");
                await page.click("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");
                await page.waitForNetworkIdle();
                await page.waitForSelector("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");

                let success = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);
                if (success) {
                    console.log(success);
                    col.insertOne(new SuratUkur(
                        file.nama,
                        file.nomor,
                        file.tipe,
                        file.tahun,
                        kecamatan,
                        desa,
                        new Date()
                    ));
                }
                await page.click("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");

            }

            await this.exit();

        } catch (err) {
            console.log(err);
        }
    }
}