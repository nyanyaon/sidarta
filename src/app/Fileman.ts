export interface FileInterface {
    nama: string,
    tipe: string,
    nomor: string,
    kodedesa?: string,
    tahun?: string,
    nomorX?: string,
    tipeUrut?: string,
    isValid: boolean,
    isUploaded?: boolean,
}

export class Fileman {
    private REGEXBT = /^(M|GB|GU)(_)(\d{14})(.pdf)/;
    private REGEXBTS = /^(M|GB|GU)(_)(\d{5})(.pdf)/;
    private REGEXSU = /^(SU|GS|PLL|SUS|GT)(_)(\d{8})(_)(\d{5})(_)(\d{4})(.pdf)/;
    private REGEXSUS = /^(SU|GS|PLL|SUS|GT)(_)(\d{5})(_)(\d{4})(.pdf)/;
    private REGEXW = /^(W)(_)(\d{5})(-|~)?(\d{5})?(_)(\d{4})(.pdf)/;
    private REGEXW302 = /^(W302)(_)(\d{5})(-|~)?(\d{5})?(_)(\d{4})(.pdf)/;

    private files: string[];
    private type: "SU" | "BT" | "BT-S" | "SU-S" | "W" | "W302";

    constructor(files: string[], type: "SU" | "BT" | "BT-S" | "SU-S" | "W" | "W302") {
        this.files = files;
        this.type = type;
    }

    extract(): FileInterface[] {
        const files: FileInterface[] = this.files.map(data => {
            const filename = data;
            if (this.type === "BT") {
                const regex = filename.match(this.REGEXBT);
                return {
                    nama: data,
                    tipe: regex !== null ? regex[3].slice(8, 9) : "",
                    nomor: regex !== null ? regex[3].slice(-5) : "",
                    isValid: regex !== null ? true : false,
                }
            }
            if (this.type === "BT-S") {
                const regex = filename.match(this.REGEXBTS);
                return {
                    nama: data,
                    tipe: regex !== null ? regex[1] : "",
                    nomor: regex !== null ? regex[3] : "",
                    isValid: regex !== null ? true : false,
                }
            }

            if (this.type === "SU") {
                const regex = filename.match(this.REGEXSU);
                return {
                    nama: data,
                    tipe: regex !== null ? regex[1] : "",
                    kodedesa: regex !== null ? regex[3] : "",
                    nomor: regex !== null ? regex[5] : "",
                    tahun: regex !== null ? regex[7] : "",
                    isValid: regex !== null ? true : false,
                }
            }

            if (this.type === "SU-S") {
                const regex = filename.match(this.REGEXSUS);
                return {
                    nama: data,
                    tipe: regex !== null ? regex[1] : "",
                    nomor: regex !== null ? regex[3] : "",
                    tahun: regex !== null ? regex[5] : "",
                    isValid: regex !== null ? true : false,
                }
            }

            if (this.type === "W") {
                const regex = filename.match(this.REGEXW);
                return {
                    nama: data,
                    tipe: regex !== null ? regex[1] : "",
                    nomor: regex !== null ? regex[3] : "",
                    tipeUrut: regex !== null ? regex[4] !== undefined ? regex[4] : "" : "",
                    nomorX: regex !== null ? regex[5] !== undefined ? regex[5] : "" : "",
                    tahun: regex !== null ? regex[7] : "",
                    isValid: regex !== null ? true : false,
                }
            }

            if (this.type === "W302") {
                const regex = filename.match(this.REGEXW302);
                return {
                    nama: data,
                    tipe: regex !== null ? regex[1] : "",
                    nomor: regex !== null ? regex[3] : "",
                    tipeUrut: regex !== null ? regex[4] !== undefined ? regex[4] : "" : "",
                    nomorX: regex !== null ? regex[5] !== undefined ? regex[5] : "" : "",
                    tahun: regex !== null ? regex[7] : "",
                    isValid: regex !== null ? true : false,
                }
            }
        });

        return files;
    }

}