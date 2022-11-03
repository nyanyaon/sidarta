import { BotInterface, Bot, BukuTanahOption, Desa, Kecamatan } from './Bot';
import * as fs from 'fs';

export class BukuTanahBot extends Bot {
    async start(kecamatan: string, desa: string) {
        try {
            this.browser = await this.init(false);
            const page = await this.browser.newPage();

            const cookiesStr = fs.readFileSync('./cookies.json').toString();
            const cookies = JSON.parse(cookiesStr);
            await page.setCookie(...cookies);

            console.log("cookie load");

            await page.goto("https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah");

            await page.waitForNetworkIdle();

            await page.click("#divkecamatan > div > span.select2.select2-container.select2-container--default");
            await page.type("#frmCariHak > span > span > span.select2-search.select2-search--dropdown > input", kecamatan);
            await page.click("#select2-cari-hat_inputwilayah_SelectedKecamatan-results > li:nth-child(1)");

            await page.click("#divdesa > div > span.select2.select2-container.select2-container--default");
            await page.type("#frmCariHak > span > span > span.select2-search.select2-search--dropdown > input", desa);
            await page.click("#select2-cari-hat_inputwilayah_SelectedDesa-results > li:nth-child(1)");

        } catch (err) {
            console.log(err);
        }
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