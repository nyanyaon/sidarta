import { Bot, BukuTanahOption, Desa, Kecamatan } from './Bot';
import { Cluster } from 'puppeteer-cluster';
import { FileInterface } from './Fileman';
import * as fs from 'fs';
import { ElementHandle } from 'puppeteer';

export class BukuTanahBot extends Bot {

    async start(kecamatan: string, desa: string, files: FileInterface[], loc: string) {
        try {
            this.browser = await this.init(false);
            const page = await this.browser.newPage();

            const cookiesStr = fs.readFileSync('./cookies.json').toString();
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            console.log("cookie load");

            for (const file of files) {
                if(!file.isValid) {
                    continue;
                }

                await page.goto("https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah");

                await page.waitForNetworkIdle();

                await page.click("#divkecamatan > div > span.select2.select2-container.select2-container--default");
                await page.type("#frmCariHak > span > span > span.select2-search.select2-search--dropdown > input", kecamatan);
                await page.click("#select2-cari-hat_inputwilayah_SelectedKecamatan-results > li:nth-child(1)");

                await page.click("#divdesa > div > span.select2.select2-container.select2-container--default");
                await page.type("#frmCariHak > span > span > span.select2-search.select2-search--dropdown > input", desa);
                await page.click("#select2-cari-hat_inputwilayah_SelectedDesa-results > li:nth-child(1)");

                await page.type("#NomorHak", file.nomor);

                await page.click("#btncarihak", { clickCount: 1, delay: 200 });
                await page.waitForNetworkIdle();
                if (await page.waitForSelector("#listhakplaceholder > tr") == null) {
                    console.log("[ERROR] : " + file.nama + " tidak ditemukan");
                    continue;
                }

                await page.click("#listhakplaceholder > tr > td:nth-child(4)", { clickCount: 1, delay: 200 });
                await page.waitForNetworkIdle();
                await page.waitForSelector("#btnUpldArsipBT", { visible: true });
                await page.click("#btnUpldArsipBT", { delay: 500 });
                await page.waitForNetworkIdle();

                let upload: ElementHandle<HTMLInputElement> = await page.$("#hatsideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]") as ElementHandle<HTMLInputElement>;
                while (upload == null) {
                    console.log("Mencoba kembali...");
                    await page.click("#btnUpldArsipBT", { delay: 500 });
                    upload = await page.$("#hatsideviewer > div > div.content > div > div:nth-child(1) > div > div > span:nth-child(2) > span > input[type=file]") as ElementHandle<HTMLInputElement>;
                }
                console.log(`${loc}/${file.nama}`);
                await upload.uploadFile(`${loc}/${file.nama}`);
                await page.waitForNetworkIdle();
                await page.click("#btnUpldArsipBTHAT", { clickCount: 1, delay: 200 });
                await page.waitForSelector("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");
                await page.click("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");
                await page.waitForNetworkIdle();
                await page.waitForSelector("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");

                let success = await page.$eval("body > div.sweet-alert.showSweetAlert.visible > p", el => el.textContent);
                if (success !== null) {
                    console.log(success);
                }
                await page.click("body > div.sweet-alert.showSweetAlert.visible > div.sa-button-container > div > button");
            }

        } catch (err) {
            console.log(err);
        }
    }

    async clusterUpload(kecamatan: string, desa: string) {
        const cluster: Cluster<string> = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 2,
            puppeteerOptions: {
                userDataDir: './datadir',
                headless: false,
                args: ["--no-sandbox"],
            }
        });

        cluster.queue(async ({ page }) => {
            const cookiesStr = fs.readFileSync('./cookies.json').toString();
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            await page.goto("https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah");

            await page.waitForNetworkIdle();

            await page.click("#divkecamatan > div > span.select2.select2-container.select2-container--default");
            await page.type("#frmCariHak > span > span > span.select2-search.select2-search--dropdown > input", kecamatan);
            await page.click("#select2-cari-hat_inputwilayah_SelectedKecamatan-results > li:nth-child(1)");

            await page.click("#divdesa > div > span.select2.select2-container.select2-container--default");
            await page.type("#frmCariHak > span > span > span.select2-search.select2-search--dropdown > input", desa);
            await page.click("#select2-cari-hat_inputwilayah_SelectedDesa-results > li:nth-child(1)");



        });


    }

    async getBukuTanahOption(): Promise<BukuTanahOption> {
        try {
            this.browser = await this.init(false);
            const page = await this.browser.newPage();

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

            await this.exit();

            return {
                dataDesaJSON,
                dataKecamatanJSON
            }
        } catch (err) {
            console.log(err);
        }
    }
}