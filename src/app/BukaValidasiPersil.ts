import App from './App';
import { Bot } from './Bot';
import * as fs from 'fs';
import * as path from 'path';

export class BukaValidasiPersil extends Bot {

    async start(user: string, pass: string, kabupatenId: string, kecamatanId: string, desaId: string, data: any[], loc: string) {
        try {
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

            await page.goto("https://dokumen.atrbpn.go.id/DokumenPengukuran/Persil", {
                waitUntil: "networkidle2",
                timeout: 0,
            });

            for (const { NIB } of data) {
                await (new Promise(r => setTimeout(r, 1000)));
                await page.select('#cari-persil_inputwilayah_SelectedDesa', desaId)

                await (new Promise(r => setTimeout(r, 1000)));
                await page.type('#NomorBidang', NIB)

                await (new Promise(r => setTimeout(r, 1000)));
                await page.$eval("#btncaripersil", (el: HTMLButtonElement) => el.click());

                const listpersil = await page.waitForSelector("#listpersilplaceholder > tr", { timeout: 0 });
                if (listpersil == null) {
                    console.log("[ERROR] : " + NIB + " tidak ditemukan");
                    continue;
                }

                const pid = await page.$eval('#listpersilplaceholder > tr', (el) => el.dataset.persil)

                const bukavalidasiFetch = await page.evaluateHandle((pid) => {
                    fetch("https://dokumen.atrbpn.go.id/DokumenPengukuran/BukaValidasiPersil", {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin"
                        },
                        "referrer": "https://dokumen.atrbpn.go.id/DokumenPengukuran/Persil",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": `pid=${pid}`,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(resp => {
                        return resp.json();
                    }).then(json => {
                        return json;
                    });
                }, pid);

                const bukavalidasiRes = await page.waitForResponse((res) => res.url().includes('/BukaValidasiPersil'), {timeout: 0});

                const bukaValidasiJSON = await bukavalidasiRes.json();

                App.send('bot:statushandler', {
                    nib: NIB,
                    msg: bukaValidasiJSON.Message,
                    status: bukaValidasiJSON.Status,
                });

                await (new Promise(r => setTimeout(r, 1000)));
                await page.reload();
            }

        } catch (err) {
            console.log(err);
        }
    }
}