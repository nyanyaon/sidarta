import App from './App';
import { Bot } from './Bot';
import * as fs from 'fs';

interface NIPID {
    pid: string;
    nib: string;
    status: string;
}

export class UpdatePersilBot extends Bot {
    async start(user: string, pass: string, kecamatanId: string, desaId: string, fileLoc: string) {
        try {
            const rStream = fs.createReadStream(fileLoc, {encoding: "utf-8"});
            const wStream = fs.createWriteStream('tmp.csv', {encoding: "utf-8"});
            wStream.write('persilid,nib,status,berhasil\n');
            const arrNibPid: NIPID[] = [];
            let totalnib: number;
            let nib: string;

            wStream.on("error", (err) => {
                console.log(err);
            });

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
                console.log("OTP");

                await page.waitForNavigation({
                    timeout: 0
                });
            }

            await page.waitForNetworkIdle({
                timeout: 0,
            });

            page.on('response', async (response) => {
                const request = response.request();

                if (request.url().includes('QueryByNIB')) {
                    const text = await response.text();
                    const json = JSON.parse(text);
                    arrNibPid[json.data[0].PersilId] = {
                        pid: json.data[0].PersilId,
                        nib: json.data[0].Nomor,
                        status: "",
                    };
                    console.log(json.data[0].PersilId);
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
                    }, json.data[0].PersilId);
                }

                if (request.url().includes('ValidasiBidang')) {
                    const text = await response.text();
                    const pid: any = request.postData().replace("pid=", "");
                    const jsonObj = JSON.parse(text);
                    arrNibPid[pid].status = jsonObj.Message;
                    App.send('botvalidasi:status', jsonObj.Status);
                    console.log(pid);
                    console.log(text);
                    wStream.write(`${arrNibPid[pid].pid},${arrNibPid[pid].nib},${arrNibPid[pid].status},${jsonObj.Status}\n`);
                }
            });

            console.log("Login");

            const DokHATPage = await page.goto("https://dokumen.atrbpn.go.id/DokumenHak/HakAtasTanah", {
                timeout: 0,
                waitUntil: "networkidle0",
            });

            if (DokHATPage != null) {
                console.log(DokHATPage.ok());
            }

            await page.waitForSelector("#judul");

            rStream.on("data", async (chunk) => {
                console.log("Start Processing");
                const str = String(chunk).split('\r\n');
                str.shift();
                console.log(str);
                totalnib = str.length;
                while ((nib = str.pop()) !== undefined) {
                    if(nib == "") continue;
                    console.log(nib);
                    const status = await page.evaluateHandle((kecamatanId, desaId, nib) => {
                        fetch("https://peta.atrbpn.go.id/DataSpasial/QueryByNIB", {
                            "headers": {
                                "accept": "application/json, text/javascript, */*; q=0.01",
                                "accept-language": "en-US,en;q=0.9",
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                            },
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": `inputwilayah.SelectedPropinsi=bdd0eb668e5340ebafd02241a05e623b&inputwilayah.SelectedKabupaten=e8f71090d3d94c469824bd09cd3e3ebf&inputwilayah.SelectedKecamatan=${kecamatanId}&inputwilayah.SelectedDesa=${desaId}&NomorBidang=${nib}&HguHpl=False&draw=1&start=0&length=20`,
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        }).then(resp => {
                            return resp.json();
                        }).then(json => {
                            return json;
                        });
                    }, kecamatanId, desaId, nib);
                    console.log(await status.jsonValue());
                }
            });



            // End line Comp

            // await page.click("#petapendaftaran > div.menu-panel.ol-control > button.btn-toggle");

            // await page.waitForNetworkIdle();

            // await page.click("#ui-id-5");

            // await page.waitForNetworkIdle();

            // await page.click("#divdesa > div > span.select2.select2-container.select2-container--default");

            // await page.type("#frmCariNIB > span > span > span.select2-search.select2-search--dropdown > input", "Batu rotok");

            // await page.click("#select2-cariNIB_inputwilayah_SelectedDesa-results > li");

            // await page.type("#nmrBidangQnib", "01970");

            // await page.click("#btnCariNIB");

            // await page.waitForNetworkIdle();

            // await page.click("#tblBidangNIB > tbody > tr > td.goto-column");

            // await page.waitForNetworkIdle();

            // await page.mouse.click(390, 250);


        } catch (err) {
            console.log(err);
        }
    }
}