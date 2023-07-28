import { Bot } from './Bot';
import type { Desa } from './Bot';
import { FileInterface } from './Fileman';
import * as fs from 'fs';
import { ElementHandle } from 'puppeteer-core';

export class UploadBukuTanahBot extends Bot {

    async start(user: string, pass: string, kabupatenId: string, kecamatanId: string, desaId: string, files: FileInterface[], loc: string) {
        try {
            let fileSaved = '';
            if(fs.existsSync('temp.csv')) {
                fileSaved = fs.readFileSync('temp.csv', {encoding: "utf-8"});
            }
            const wStream = fs.createWriteStream('temp.csv', {encoding: "utf-8"});
            wStream.write(`nama,isupload`);
            wStream.write(fileSaved);

            const data = [];

            for(const row of fileSaved.split('\r\n')) {
                const [nama, success] = row.split(',');
                data.push({
                    nama,
                    success
                });
            }

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

            await page.goto("https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah", {
                waitUntil: "networkidle0",
                timeout: 0,
            });

            // const getwilayah = await page.waitForResponse(res =>
            //     res.request().url().includes('/GetWilayah') && res.status() == 200
            //     , { timeout: 0 });

            // const textWilayah = await getwilayah.text();
            // const listdesa = JSON.parse(textWilayah) as Desa[];

            for (const file of files) {
                console.log('Nomor : ' + file.nomor);
                // if (data.find(val => val.nama == file.nama).success === '1') {
                //     continue;
                // }

                if (!file.isValid) {
                    continue;
                }
                // const desa = listdesa.find(val => val.kode == file.kodedesa);

                await (new Promise(r => setTimeout(r, 1000)));
                await page.select('#cari-hat_inputwilayah_SelectedKecamatan', kecamatanId);

                await (new Promise(r => setTimeout(r, 1000)));
                await page.select('#cari-hat_inputwilayah_SelectedDesa', desaId);

                await (new Promise(r => setTimeout(r, 1000)));
                await page.select("#listtipehak", file.tipe);

                await (new Promise(r => setTimeout(r, 1000)));
                await page.type("#NomorHak", file.nomor);

                await (new Promise(r => setTimeout(r, 1000)));
                await page.$eval("#btncarihak", (el: HTMLButtonElement) => el.click());
                
                const listhak = await page.waitForSelector("#listhakplaceholder > tr", { timeout: 0 });
                if (listhak == null) {
                    console.log("[ERROR] : " + file.nama + " tidak ditemukan");
                    continue;
                }

                await (new Promise(r => setTimeout(r, 1000)));
                await page.$eval("#listhakplaceholder > tr", (el) => el.click());
                await page.waitForSelector("#btnUpldArsipBT", { visible: true });
                await page.$eval("#btnUpldArsipBT", (el: HTMLButtonElement) => el.click());

                let upload = await page.$("#hatsideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]");
                while (upload == null) {
                    console.log("Mencoba kembali...");
                    await page.$eval("#btnUpldArsipBT", (el: HTMLButtonElement) => el.click());
                    upload = await page.$("#hatsideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]");
                }
                console.log("Upload File");
                // await (new Promise(r => setTimeout(r, 2000)));
                await upload.uploadFile(`${loc}\\${file.nama}`);
                let preview = await page.$("#previewerCt.pdfobject-container");
                while(preview == null) {
                    await upload.uploadFile(`${loc}\\${file.nama}`);
                    preview = await page.$("#previewerCt.pdfobject-container");
                }
                await page.$eval("#btnUpldArsipBTHAT", (el: HTMLButtonElement) => el.click());
                await page.waitForSelector("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", { timeout: 0 });
                await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());

                const resUpload = await page.waitForResponse(res => res.request().url().includes('/SimpanArsip') && res.status() == 200, {timeout:0});
                const success = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);
                if(success) {
                    wStream.write(`${file.nama},1\n`);
                }
                await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());
                await (new Promise(r => setTimeout(r, 1000)));
                await page.reload();
            }

        } catch (err) {
            console.log(err);
        }
    }
}