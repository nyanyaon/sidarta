import App from './App';
import { Bot } from './Bot';
import { FileInterface } from './Fileman';
import * as fs from 'fs';
import * as path from 'path';

export class UploadBukuTanahKJSBBot extends Bot {

    async start(user: string, pass: string, kabupatenId: string, kecamatanId: string, desaId: string, files: FileInterface[], loc: string) {
        try {
            // let fileSaved = '';
            // if(!fs.existsSync('temp.csv')) {
            //     fs.writeFileSync('temp.csv', 'nama,isupload\n');
            // }

            // const wStream = fs.createWriteStream('temp.csv', {encoding: "utf-8"});
            // fileSaved = fs.readFileSync('temp.csv', {encoding: "utf-8"});
            // wStream.write(fileSaved);

            // const data = [];

            // for(const row of fileSaved.split('\n')) {
            //     const [nama, success] = row.split(',');
            //     data.push({
            //         nama,
            //         success
            //     });
            // }

            // data.pop();
            // data.shift();

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

            await page.goto("https://entridokumen.atrbpn.go.id/DokumenHak/HakAtasTanah/", {
                waitUntil: "networkidle2",
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

                await page.waitForSelector('body > div.blockUI.blockOverlay', {hidden: true, timeout: 0});

                await (new Promise(r => setTimeout(r, 1000)));
                await page.select('#cari-hat_inputwilayah_SelectedKecamatan', kecamatanId);

                await (new Promise(r => setTimeout(r, 1000)));
                await page.select('#cari-hat_inputwilayah_SelectedDesa', desaId);

                await (new Promise(r => setTimeout(r, 1000)));
                let tipehak = "0";
                switch (file.tipe) {
                    case "M":
                        tipehak = "1"
                        break;
                    default:
                        break;
                }
                await page.select("#listtipehak", tipehak);

                await (new Promise(r => setTimeout(r, 1000)));
                await page.type("#NomorHak", file.nomor);

                await (new Promise(r => setTimeout(r, 1000)));
                await page.$eval("#btncarihak", (el: HTMLButtonElement) => el.click());
                
                const responseDaftarDok = await page.waitForResponse((res) => res.url().includes("/DaftarDokumenHak") && res.status() == 200, {timeout: 0});
                
                const statusDaftarDok = await responseDaftarDok.text();
                if(statusDaftarDok === "noresults") {
                    await (new Promise(r => setTimeout(r, 1000)));
                    console.log("Nggak ada");
                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());
                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.$eval("#btnbuathak", (el: HTMLButtonElement) => el.click());
                    await page.waitForSelector("#bthatdialmodal", { visible: true });

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.select("#newbtselprg", "DE");

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.select("#tambahbt_inputwilayah_SelectedDesa", desaId);

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.type("#Nomor", file.nomor);

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.type("#tglterbit", "01/01/1990");

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.$eval("#frmBuatBT > div.row > div > button", (el: HTMLButtonElement) => el.click());

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.$eval("#cfmdlgbt > input.btn.btn-success", (el) => el.click());

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el) => el.click());

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.$eval("#btncarihak", (el: HTMLButtonElement) => el.click());
                }

                

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
                    await (new Promise(r => setTimeout(r, 1000)));
                }
                console.log("Upload File");
                const fullpath = path.join(loc,file.nama);
                await page.waitForSelector('body > div.blockUI.blockOverlay', {hidden: true, timeout: 0});
                await upload.uploadFile(fullpath);
                await (new Promise(r => setTimeout(r, 1000)));
                let preview = await page.$("#previewerCt.pdfobject-container");
                while(preview == null) {
                    console.log("Mencoba Upload kembali...");
                    upload = await page.$("#hatsideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]");
                    await upload.uploadFile(fullpath);
                    preview = await page.$("#previewerCt.pdfobject-container");
                    await (new Promise(r => setTimeout(r, 1000)));
                }
                await page.$eval("#btnUpldArsipBTHAT", (el: HTMLButtonElement) => el.click());
                await page.waitForSelector("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", { timeout: 0 });
                await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());

                const resUpload = await page.waitForResponse(res => res.request().url().includes('/SimpanArsip'), {timeout:0});
                const statusUpload = resUpload.status();
                console.log(statusUpload);
                const status = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);
                if(statusUpload === 200) {
                    App.send('bot:statushandler', {
                        nama: file.nama,
                        status: status,
                        success: true,
                    });
                    // wStream.write(`${file.nama},1\n`);
                } else {
                    App.send('bot:statushandler', {
                        nama: file.nama,
                        status: status,
                        success: false,
                    });
                }
                await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());
                await (new Promise(r => setTimeout(r, 1000)));
                await page.reload();
            }
        } catch (err) {
            console.log(err);
        } finally {
            this.browser.close();
        }
    }
}