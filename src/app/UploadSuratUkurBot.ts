import { Bot, Desa } from './Bot';
import { FileInterface } from './Fileman';
import * as fs from 'fs';
import { ElementHandle } from 'puppeteer-core';

export class UploadSuratUkurBot extends Bot {

    async start(user: string, pass: string, files: FileInterface[], loc: string) {
        try {
            this.browser = await this.init(false);

            const page = await this.browser.newPage();

            await page.goto("https://aplikasi.atrbpn.go.id/pintasan");

            await page.waitForNetworkIdle({ timeout: 0 });

            const isLogin = await page.$('body > header > div.container.text-center > p > b');

            if (isLogin == null) {
                await page.type('#username', user);
                await page.type('#inputPassword', pass);

                await page.click('#kc-next');

                await page.waitForNavigation({
                    timeout: 0
                });
            }

            await page.waitForNetworkIdle({
                timeout: 0,
            });

            await page.goto("https://dokumen.atrbpn.go.id/DokumenPengukuran/SuratUkur", {
                waitUntil: "networkidle0",
                timeout: 0,
            });

            const getwilayah = await page.waitForResponse(res =>
                res.request().url().includes('/GetWilayah') && res.status() == 200
                , { timeout: 0 });

            const textWilayah = await getwilayah.text();
            const listdesa = JSON.parse(textWilayah) as Desa[];

            for (const file of files) {
                if (file.isUploaded) {
                    continue;
                }

                if (!file.isValid) {
                    continue;
                }

                const desa = listdesa.find(val => val.kode == file.kodedesa);

                // await page.click("#divkecamatan > div > span.select2.select2-container.select2-container--default");
                // await page.type("#frmCariSU > span > span > span.select2-search.select2-search--dropdown > input", kecamatan);

                // const correctId = await page.$$eval("#select2-cari-su_inputwilayah_SelectedKecamatan-results > li", (listel, kec) => {
                //     const elId = listel.find((el) => el.id.search(kec)).id;
                //     return elId;
                // }, kecamatanId);


                // await page.click("#"+correctId);
                await (new Promise(r => setTimeout(r, 1000)));
                await page.select('#cari-su_inputwilayah_SelectedDesa', desa.wilayahid);
                
                await (new Promise(r => setTimeout(r, 1000)));
                await page.select('#lsttipe', file.tipe);
                
                await (new Promise(r => setTimeout(r, 1000)));
                await page.type("#NomorSU", file.nomor);
                
                await (new Promise(r => setTimeout(r, 1000)));
                await page.type("#TahunSU", file.tahun);
                

                await (new Promise(r => setTimeout(r, 1000)));
                await page.$eval("#btncarisu", (el: HTMLButtonElement) => el.click());
                // await page.waitForNetworkIdle();
                const listsu = await page.waitForSelector("#listsuplaceholder > tr", { timeout: 0 });
                if ( listsu == null) {
                    console.log("[ERROR] : " + file.nama + " tidak ditemukan");
                    continue;
                }


                // await page.click("#listsuplaceholder > tr");
                await (new Promise(r => setTimeout(r, 1000)));
                await page.$eval("#listsuplaceholder > tr", (el) => el.click());
                await page.waitForSelector("#btnUploadSU", { visible: true });
                await page.$eval("#btnUploadSU", (el: HTMLButtonElement) => el.click());

                let upload = await page.waitForSelector("#susideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]");
                while (upload == null) {
                    console.log("Mencoba kembali...");
                    await page.$eval("#btnUploadSU", (el: HTMLButtonElement) => el.click());
                    upload = await page.$("#hatsideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]");
                }

                await upload.uploadFile(`${loc}/${file.nama}`);
                await (new Promise(r => setTimeout(r, 1000)));
                await page.$eval("#btnUpldArsipBTHAT", (el: HTMLButtonElement) => el.click());
                await page.waitForSelector("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");
                await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());

                const resUpload = await page.waitForResponse(res => res.request().url().includes('/SimpanArsip') && res.status() == 200, {timeout:0});
                const success = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);
                console.log(success);
                await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());
                await (new Promise(r => setTimeout(r, 1000)));
                await page.reload();
            }

        } catch (err) {
            console.log(err);
        }
    }
}