import { Bot } from './Bot';
import { FileInterface } from './Fileman';


export class UploadSuratUkurKJSBBot extends Bot {

    async start(user: string, pass: string, kabupatenId: string, kecamatanId: string, desaId: string, files: FileInterface[], loc: string) {
        try {
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

            await page.goto("https://entridokumen.atrbpn.go.id/DokumenPengukuran/SuratUkur/", {
                waitUntil: "networkidle2",
                timeout: 0,
            });

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
                await page.waitForSelector('body > div.blockUI.blockOverlay', {hidden: true, timeout: 0});
                console.log("Test");
                await (new Promise(r => setTimeout(r, 1000)));
                await page.select('select#cari-su_inputwilayah_SelectedDesa', desaId);
                
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
                let preview = await page.$("#previewerCt.pdfobject-container");
                while(preview == null) {
                    await upload.uploadFile(`${loc}/${file.nama}`);
                    preview = await page.$("#previewerCt.pdfobject-container");
                }
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