import { Bot } from './Bot';
import * as fs from 'fs';
import App from './App';

interface StatusValidasi {
    [key: string]: string | number | boolean;
    pid: string;
    nib: string;
    status: string;
    success: boolean;
}

interface IStatusUpdate {
    pid: string;
    nib?: string;
    status: string;
    success: boolean;
}


export class EntryFisikPTSLBot extends Bot {
    async start(user: string, pass: string, listtype: string, kabupatenId: string, kecamatanId: string, desaId: string, fileLoc: string) {
        try {
            console.log(fileLoc);
            const rStream = fs.createReadStream(fileLoc, { encoding: "utf-8" });
            let totalBerkas: number;
            const arrStatusValidasi: StatusValidasi[] = [];

            rStream.on("error", (err) => {
                console.log(err);
            });

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

            rStream.on("data", async (chunk) => {
                console.log("Start Processing");
                const str = String(chunk).split('\r\n');
                str.shift();
                totalBerkas = str.length;
                let data: String;
                while ((data = str.pop()) !== undefined) {
                    if (data == "") continue;
                    const [NoFisik, Tahun, NIK, NamaLengkap, TempatLahir, TglLahir, Pekerjaan, Alamat, Selaku] = data.split(",");
                    if(NoFisik == "") continue;
                    await page.goto('https://fisik-ptsl.atrbpn.go.id/Berkas/EntriBerkas', {timeout: 0});
                    await page.waitForSelector("#tab1 > div > div.x_title > h2", {timeout: 0});
                    console.log(NoFisik, Tahun, NIK, NamaLengkap, TempatLahir, TglLahir, Pekerjaan, Alamat, Selaku);

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.type("#nmrberkas", NoFisik);

                    await page.type("#thnberkas", Tahun);
                    
                    await page.select("#Wilayah", desaId);
                    await page.$eval("#btncari", (el: HTMLButtonElement) => el.click());
                    
                    const resSearch = await page.waitForResponse(res => res.request().url().includes('/DaftarBerkas') && res.status() == 200, {timeout:0});
                    const statusDaftarDok = await resSearch.json();
                    
                    if(statusDaftarDok.recordsTotal === 0) {
                        console.log("no data");
                        continue;
                    }
                    
                    await (new Promise(r => setTimeout(r, 1000)));
                    const waitDataTableElem = await page.waitForSelector("#datatable > tbody > tr", { timeout: 0 });
                    await page.$eval("#datatable > tbody > tr", (el) => el.click());
                    
                    const resDetailBerkas = await page.waitForResponse(res => res.request().url().includes('/InputDokumen/DetailBerkas') && res.status() == 200, {timeout:0});
                    console.log("sudah di load");

                    const listPemilik = await page.$("#berkasdokumenplaceholder > tr");
                    if (listPemilik != null) {
                        console.log("[ERROR] : " + NoFisik + " sudah di entry");
                        continue;
                    }
                    
                    console.log("[ERROR] : " + NoFisik + " belum di entry");
                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.$eval("#btnentri", (el: HTMLButtonElement) => el.click());
                    
                    const resEntryDataFisikPage = await page.waitForResponse(res => res.request().url().includes('/InputDokumen/inputpemohonperorangan') && res.status() == 200, {timeout:0});
                    await page.type("#tNIK", NIK);
                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.type("#tanggallahir", "");
                    await page.$eval("#tanggallahir", (el) => {
                        el.value = "";
                    })
                    await page.type("#tanggallahir", TglLahir);
                    await page.type("#tNAMA_LENGKAP", NamaLengkap);
                    await page.type("#tTEMPAT_LAHIR", TempatLahir);
                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.$eval("#btnceknik", (el: HTMLButtonElement) => el.click());

                    await (new Promise(r => setTimeout(r, 1000)));
                    const btnError = await page.$("#btn-ok");
                    if(btnError) {
                        await page.$eval("#btn-ok", (el: HTMLButtonElement) => el.click());
                        App.send('bot:statushandler', {Pesan: `Gagal Nomor ${NoFisik} & ${Tahun}`, Status: false});
                        continue;
                    }
                    
                    const resInputPemohon = await page.waitForResponse(res => res.request().url().includes('/InputDokumen/InputPemohonDukcapil') && res.status() == 200, {timeout:0});
                    await page.type("#tALAMAT", Alamat);
                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.select("#tSTATUS_KAWIN", "Kawin");
                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.type("#tJENIS_PEKERJAAN", Pekerjaan);
                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.select("#SELAKU", Selaku);

                    await (new Promise(r => setTimeout(r, 1000)));
                    await page.click("#btn-tambah.btn-success");
                    console.log("sudah klik");
                    
                    const resCheck = await page.waitForResponse(res => res.request().url().includes('/InputDokumen/TambahPemohon') && res.status() == 200, {timeout:0});
                    const resCheckJson = await resCheck.json();
                    
                    console.log(resCheckJson);


                    App.send('bot:statushandler', resCheckJson);
                }
            });


        } catch (err) {
            console.log(err);
        }
    }
}