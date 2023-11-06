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


export class EntryFisikPTSLBot extends Bot {
    async start(user: string, pass: string, kabupatenId: string, kecamatanId: string, desaId: string, fileLoc: string) {
        try {
            const rStream = fs.createReadStream(fileLoc, { encoding: "utf-8" });
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

            await page.goto('https://fisik-ptsl.atrbpn.go.id/Berkas/EntriBerkas');


        } catch (err) {
            console.log(err);
        }
    }
}