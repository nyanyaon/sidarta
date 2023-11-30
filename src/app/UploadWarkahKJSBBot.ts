import puppeteer, { ElementHandle, Puppeteer, PuppeteerNode, Target } from 'puppeteer-core';
import App from './App';
import { Bot } from './Bot';
import { FileInterface } from './Fileman';
import * as path from 'path';
import * as fs from 'fs';


export class UploadWarkahKJSBBot extends Bot {

    async start(user: string, pass: string, type: string, files: FileInterface[], loc: string) {
        try {
            const timeSecOut = 1000;

            if(!fs.existsSync(path.join(loc, 'sudah'))) {
                fs.mkdirSync(path.join(loc, 'sudah'));
            }
            
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
            let jenisDok = "";
            let linkDI = "";

            switch (type) {
                case "di208":
                    await page.goto("https://entridokumen.atrbpn.go.id/Warkah/Index208/", {
                        waitUntil: "networkidle2",
                        timeout: 0,
                    });
                    jenisDok = "BendelWarkahPendaftaran";
                    linkDI = "/DaftarIsian208"
                    break;
                case "di302":
                    await page.goto("https://entridokumen.atrbpn.go.id/Warkah/Index302/", {
                        waitUntil: "networkidle2",
                        timeout: 0,
                    });
                    jenisDok = "BendelWarkahPengukuran";
                    linkDI = "/DaftarIsian302"
                    break;
                default:
                    break;
            }


            for (const file of files) {
                console.log('Nomor : ' + file.nomor);
                // if (file.isUploaded) {
                //     continue;
                // }

                if (!file.isValid) {
                    continue;
                }

                // await page.click("#divkecamatan > div > span.select2.select2-container.select2-container--default");
                // await page.type("#frmCariSU > span > span > span.select2-search.select2-search--dropdown > input", kecamatan);

                // const correctId = await page.$$eval("#select2-cari-su_inputwilayah_SelectedKecamatan-results > li", (listel, kec) => {
                //     const elId = listel.find((el) => el.id.search(kec)).id;
                //     return elId;
                // }, kecamatanId);


                // await page.click("#"+correctId);
                // await page.waitForNetworkIdle();
                // await page.locator('#cari-su_inputwilayah_SelectedDesa').setWaitForEnabled(true);
                // await page.waitForSelector('body > div.blockUI.blockOverlay', {hidden: true, timeout: 0});
                const fullpath = path.join(loc, file.nama);

                // await (new Promise(r => setTimeout(r, timeSecOut)));
                // await page.waitForSelector("#tipe", {timeout: 0});
                // await page.$eval('#tipe', el => el.value = "warkah");

                await (new Promise(r => setTimeout(r, timeSecOut)));
                await page.type("#nomor", file.tipeUrut !== "" ? `${file.nomor}-${file.nomorX}` : file.nomor);

                await (new Promise(r => setTimeout(r, timeSecOut)));
                await page.$eval("#tahun", el => el.value = "");
                await page.type("#tahun", file.tahun);


                await (new Promise(r => setTimeout(r, timeSecOut)));
                await page.$eval("#btncaridi", (el: HTMLButtonElement) => el.click());

                const responseDaftarDI = await page.waitForResponse((res) => res.url().includes(linkDI) && res.status() == 200, { timeout: 0 });

                const statusDaftarDok = await responseDaftarDI.text();
                if (statusDaftarDok === "noresults") {
                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    console.log("Nggak ada");
                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());
                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval("#btnbaru", (el: HTMLButtonElement) => el.click());
                    await page.waitForSelector('body > div.blockUI.blockOverlay', { hidden: true, timeout: 0 });

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.type("#NomorWarkah", file.tipeUrut !== "" ? `${file.nomor}${file.tipeUrut}${file.nomorX}` : file.nomor);

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.type("#TahunWarkah", file.tahun);

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.select("#DokumenId", jenisDok);

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    const uploadWarkahEl = await page.$("#btnUploadDok") as ElementHandle<HTMLInputElement>;

                    await uploadWarkahEl.uploadFile(fullpath);
                    let filePrev = await page.$("#docViewer > div > iframe");
                    while (filePrev === null) {
                        await uploadWarkahEl.uploadFile(fullpath);
                        filePrev = await page.$("#docViewer > div > iframe");
                    }

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval("#btnunggah", (el: HTMLButtonElement) => el.click());

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el) => el.click());

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el) => el.click());

                    const resUpload = await page.waitForResponse(res => res.request().url().includes('/CekDokumenUpload') && res.status() == 200, { timeout: 0 });
                    const statusUpload = await resUpload.json();
                    const statusMsg = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);

                    App.send('bot:statushandler', {
                        nama: file.nama,
                        id: statusUpload.Pesan,
                        keterangan: statusMsg, 
                        success: statusUpload.Status,
                    });

                    if(statusUpload.Status) {
                        fs.rename(fullpath, path.join(loc, 'sudah', file.nama), (err) => {
                            if(err) throw err;
                            console.log('pindah file');
                        });
                    }

                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.reload();
                    continue;
                }

                const listWarkahTidakAda = await page.$$("#listdiplaceholder > tr > td.hide-warkah");
                
                console.log(listWarkahTidakAda.length);
                
                if(listWarkahTidakAda.length == 0) {
                    App.send('bot:statushandler', {
                        nama: file.nama,
                        id: "200",
                        keterangan: "File sudah diupload", 
                        success: true,
                    });
                    await page.reload();
                    continue;
                }

                for(const warkahUp of listWarkahTidakAda) {
                    await warkahUp.$eval('td:nth-child(6) > a', el => el.click());
                    await page.select('#DokumenId', jenisDok);
                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    const uploadWarkahEl = await page.$("#btnUploadDok") as ElementHandle<HTMLInputElement>;

                    await uploadWarkahEl.uploadFile(fullpath);
                    let filePrev = await page.$("#docViewer > div > iframe");
                    while (filePrev === null) {
                        await uploadWarkahEl.uploadFile(fullpath);
                        filePrev = await page.$("#docViewer > div > iframe");
                    }

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval("#btnunggah", (el: HTMLButtonElement) => el.click());

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el) => el.click());

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el) => el.click());

                    const resUpload = await page.waitForResponse(res => res.request().url().includes('/CekDokumenUpload') && res.status() == 200, { timeout: 0 });
                    const statusUpload = await resUpload.json();
                    const statusMsg = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);

                    App.send('bot:statushandler', {
                        nama: file.nama,
                        id: statusUpload.Pesan,
                        keterangan: statusMsg, 
                        success: statusUpload.Status,
                    });

                    if(statusUpload.Status) {
                        fs.rename(fullpath, path.join(loc, 'sudah', file.nama), (err) => {
                            if(err) throw err;
                            console.log('pindah file');
                        });
                    }

                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());

                    fs.rename(fullpath, path.join(loc, 'sudah', file.nama), (err) => {
                        if(err) throw err;
                        console.log('pindah file');
                    });

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval('#carihak-tab', (el: HTMLAnchorElement) => el.click());
                    await (new Promise(r => setTimeout(r, timeSecOut)));
                }

                // const listsu = await page.waitForSelector("#listsuplaceholder > tr", { timeout: 0 });
                // if (listsu == null) {
                //     console.log("[ERROR] : " + file.nama + " tidak ditemukan");
                //     continue;
                // }


                // // await page.click("#listsuplaceholder > tr");
                // await (new Promise(r => setTimeout(r, timeSecOut)));
                // await page.$eval("#listsuplaceholder > tr", (el) => el.click());
                // await page.waitForSelector("#btnUploadSU", { visible: true });
                // await page.$eval("#btnUploadSU", (el: HTMLButtonElement) => el.click());

                // let upload = await page.waitForSelector("#susideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]");
                // while (upload == null) {
                //     console.log("Mencoba kembali...");
                //     await page.$eval("#btnUploadSU", (el: HTMLButtonElement) => el.click());
                //     upload = await page.$("#hatsideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]");
                // }

                // await upload.uploadFile(fullpath);
                // let preview = await page.$("#previewerCt.pdfobject-container");
                // while (preview == null) {
                //     await upload.uploadFile(fullpath);
                //     preview = await page.$("#previewerCt.pdfobject-container");
                // }
                // await (new Promise(r => setTimeout(r, timeSecOut)));
                // await page.$eval("#btnUpldArsipBTHAT", (el: HTMLButtonElement) => el.click());
                // await page.waitForSelector("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");
                // await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());

                // const resUpload = await page.waitForResponse(res => res.request().url().includes('/SimpanArsip') && res.status() == 200, { timeout: 0 });
                // const statusUpload = resUpload.status();
                // const status = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);
                // if (statusUpload === 200) {
                //     App.send('bot:statushandler', {
                //         nama: file.nama,
                //         status: status,
                //         success: true,
                //     });
                //     // wStream.write(`${file.nama},1\n`);
                // }

                // await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());
                
                await (new Promise(r => setTimeout(r, timeSecOut)));
                await page.reload();
            }

        } catch (err) {
            console.log(err);
        }
    }
}