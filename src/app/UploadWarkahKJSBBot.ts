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
                await page.waitForSelector('#nomor', { timeout: 0 });
                await page.type("#nomor", file.tipeUrut !== "" ? `${file.nomor}-${file.nomorX}` : file.nomor);

                await (new Promise(r => setTimeout(r, timeSecOut)));
                await page.$eval("#tahun", el => el.value = "");
                await page.type("#tahun", file.tahun);


                await (new Promise(r => setTimeout(r, timeSecOut)));
                await page.$eval("#btncaridi", (el: HTMLButtonElement) => el.click());

                const responseDaftarDI = await page.waitForResponse((res) => res.url().includes(linkDI) && res.status() == 200, { timeout: 0 });

                const statusDaftarDok = await responseDaftarDI.text();
                if (statusDaftarDok === "noresults" || file.isDouble !== "") {
                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    console.log("Nggak ada");
                    if(statusDaftarDok === "noresults") {
                        await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());
                    }
                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.$eval("#btnbaru", (el: HTMLButtonElement) => el.click());
                    await page.waitForSelector('body > div.blockUI.blockOverlay', { hidden: true, timeout: 0 });

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    await page.type("#NomorWarkah", file.tipeUrut !== "" ? `${file.nomor}${file.tipeUrut}${file.nomorX}` : file.isDouble !== "" ? file.nomor+file.isDouble : file.nomor);

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
                    let statusMsg: string = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);

                    while(statusMsg !== 'Dokumen berhasil diunggah') {
                        statusMsg = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);
                        if(statusMsg.includes('Terjadi Kesalahan') || statusMsg.includes("not enough space")) {
                            break;
                        }
                        await (new Promise(r => setTimeout(r, timeSecOut)));
                    }

                    App.send('bot:statushandler', {
                        nama: file.nama,
                        id: statusUpload.Pesan,
                        keterangan: statusMsg, 
                        success: statusUpload.Status,
                    });

                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    if(statusUpload.Status) {
                        fs.renameSync(fullpath, path.join(loc, 'sudah', file.nama));
                    }
                    await page.reload();
                    continue;
                }

                const listWarkahTidakAda = await page.$$("#listdiplaceholder > tr");
                
                console.log(listWarkahTidakAda.length);
                
                // if(listWarkahTidakAda.length == 0) {
                //     App.send('bot:statushandler', {
                //         nama: file.nama,
                //         id: "200",
                //         keterangan: "File sudah diupload", 
                //         success: true,
                //     });
                //     await page.reload();
                //     continue;
                // }

                let warkahUpId = 1;
                for(const warkahUp of listWarkahTidakAda) {
                    await warkahUp.waitForSelector('td:nth-child(6) > a', {timeout:0});
                    await warkahUp.$eval('td:nth-child(6) > a', el => el.click());
                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    
                    await page.waitForSelector('#DokumenId', {timeout:0});
                    await page.select('#DokumenId', jenisDok);
                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    
                    const handleCheckBerkas = await page.$('#docViewer > div > iframe');
                    await (new Promise(r => setTimeout(r, timeSecOut)));

                    if(handleCheckBerkas !== null) {
                        
                        console.log('Berkas Ada');
                        if(warkahUpId == listWarkahTidakAda.length) {
                            App.send('bot:statushandler', {
                                nama: file.nama,
                                id: "Berkas Sudah Terupload",
                                keterangan: 200, 
                                success: true,
                            });
                            
                            fs.rename(fullpath, path.join(loc, 'sudah', file.nama), (err) => {
                                if(err) throw err;
                                console.log('Sudah');
                            });
                        }
                        await page.$eval('#carihak-tab', (el: HTMLAnchorElement) => el.click());
                        await (new Promise(r => setTimeout(r, timeSecOut)));
                        warkahUpId++;
                        continue;
                    }

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
                    let statusMsg: string = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);

                    while(statusMsg !== 'Dokumen berhasil diunggah') {
                        statusMsg = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);
                        if(statusMsg.includes('Terjadi Kesalahan') || statusMsg === "There is not enough space on the disk.") {
                            break;
                        }
                        await (new Promise(r => setTimeout(r, timeSecOut)));
                    }

                    App.send('bot:statushandler', {
                        nama: file.nama,
                        id: statusUpload.Pesan,
                        keterangan: statusMsg, 
                        success: statusUpload.Status,
                    });

                    await page.$eval("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button", (el: HTMLButtonElement) => el.click());

                    await (new Promise(r => setTimeout(r, timeSecOut)));
                    if(statusUpload.Status && warkahUpId == listWarkahTidakAda.length) {
                        fs.renameSync(fullpath, path.join(loc, 'sudah', file.nama));
                    }
                    warkahUpId++;
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