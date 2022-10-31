import * as puppeteer from "puppeteer";
import { store } from "../Store";

class Bot {
    private static browser: puppeteer.Browser;

    static async getStateId() {
        try {
            Bot.browser = await puppeteer.launch({
                userDataDir: './datadir',
                args: ["--no-sandbox"],
                headless: false,
            });

            const page = await Bot.browser.newPage();
            
            await page.goto("https://kkp2.atrbpn.go.id/dokumen/DokumenHak/HakAtasTanah");

            const stateId = await page.$eval("#cari-hat_inputwilayah_SelectedKabupaten > option", (el: HTMLOptionElement) => {
                return el.value;
            });

            store.stateId = stateId;

            
        } catch(err) {
            console.log(err);
            
        }
    }
}