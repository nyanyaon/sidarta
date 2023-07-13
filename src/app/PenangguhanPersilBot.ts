import App from './App';
import { Bot } from './Bot';
import * as fs from 'fs';

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


export class PenangguhanPersilBot extends Bot {
    async startNIB(user: string, pass: string, kabupatenId: string, kecamatanId: string, desaId: string, fileLoc: string) {
        try {
            const rStream = fs.createReadStream(fileLoc, { encoding: "utf-8" });
            const arrStatusValidasi: StatusValidasi[] = [];
            let nib: string;

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

            page.on('response', async (response) => {
                const request = response.request();

                if (request.url().includes('DaftarPersil')) {
                    const text = await response.text();
                    const parser = new DOMParser();
                    const htmlDom = parser.parseFromString(text, 'text/html');
                    const pid = htmlDom.querySelector('tr').dataset.persil;
                    const nib = htmlDom.querySelectorAll('td')[3].innerText;
                    arrStatusValidasi.push({
                        pid,
                        nib,
                        status: '',
                        success: false,
                    });
                    page.evaluate((pid) => {
                        fetch("https://dokumen.atrbpn.go.id/DokumenPengukuran/PenangguhanPersil", {
                            "headers": {
                                "accept": "*/*",
                                "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Microsoft Edge\";v=\"114\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin"
                            },
                            "referrer": "https://dokumen.atrbpn.go.id/DokumenPengukuran/Persil",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": `ps=${pid}`,
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        });
                    }, pid);
                }

                if (request.url().includes('ValidasiBidang')) {
                    const text = await response.text();
                    const pid = request.postData().replace("pid=", "");
                    const jsonObj = JSON.parse(text);
                    const indexStatusValidasi = arrStatusValidasi.findIndex(val => val.pid === pid);
                    arrStatusValidasi[indexStatusValidasi].status = jsonObj.Message;
                    arrStatusValidasi[indexStatusValidasi].success = jsonObj.Status;
                    App.send('botvalidasi:status', arrStatusValidasi[indexStatusValidasi]);
                }
            });

            const petaPage = await page.goto("https://peta.atrbpn.go.id/", {
                timeout: 0,
                waitUntil: "networkidle0",
            });

            if (petaPage != null) {
                console.log(petaPage.ok());
            }

            await page.waitForSelector("#right_col > div.x_panel > div.x_title > h2");

            console.log("Peta");

            rStream.on("data", async (chunk) => {
                console.log("Start Processing");
                const str = String(chunk).split('\r\n');
                str.shift();
                console.log(str);
                while ((nib = str.pop()) !== undefined) {
                    if (nib == "") continue;
                    console.log(nib);
                    const status = await page.evaluateHandle((kabupatenId, kecamatanId, desaId, nib) => {
                        fetch("https://dokumen.atrbpn.go.id/DokumenPengukuran/DaftarPersil", {
                            "headers": {
                                "accept": "*/*",
                                "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Microsoft Edge\";v=\"114\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin"
                            },
                            "referrer": "https://dokumen.atrbpn.go.id/DokumenPengukuran/Persil",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": `inputwilayah.SelectedPropinsi=bdd0eb668e5340ebafd02241a05e623b23&inputwilayah.SelectedKabupaten=${kabupatenId}&inputwilayah.SelectedKecamatan=${kecamatanId}&inputwilayah.SelectedDesa=${desaId}&NomorBidang=${nib}&StatusValidasi=2&HguHpl=False`,
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        });
                    }, kabupatenId, kecamatanId, desaId, nib);
                    console.log(await status.jsonValue());
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    async startPersilId(user: string, pass: string, fileLoc: string) {
        try {
            const rStream = fs.createReadStream(fileLoc, { encoding: "utf-8" });
            const arrStatus: IStatusUpdate[] = [];

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

            page.on('response', async (response) => {
                const request = response.request();

                if (request.url().includes('MutahirkanWilayahSpaPersil')) {
                    const text = await response.text();
                    const pid = request.postData().split('&').find(val => val.includes('pid=')).replace("pid=", "");
                    console.log(pid);
                    const jsonObj = JSON.parse(text);
                    const statusValidasiData = {
                        pid: pid,
                        status: jsonObj.Message,
                        success: jsonObj.Status,
                    }
                    console.log(statusValidasiData);
                    arrStatus.push(statusValidasiData);
                    App.send('bot:statushandler', statusValidasiData);
                }
            });

            const dokHakPage = await page.goto("https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah", {
                timeout: 0,
                waitUntil: "networkidle0",
            });

            if (dokHakPage != null) {
                console.log(dokHakPage.ok());
            }

            await page.waitForSelector("#judul");

            console.log("Dokumen Hak Page");

            rStream.on("data", async (chunk) => {
                console.log("Start Processing");
                const str = String(chunk).split('\r\n');
                str.shift();

                for (const pid of str) {
                    console.log(pid);
                    if (pid == "") continue;
                    page.evaluate((pid) => {
                        fetch("https://dokumen.atrbpn.go.id/DokumenHak/MutahirkanWilayahSpaPersil", {
                            "headers": {
                                "accept": "*/*",
                                "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Microsoft Edge\";v=\"114\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin"
                            },
                            "referrer": "https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": "pid=" + pid + "&tid=7",
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        });
                    }, pid);
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}