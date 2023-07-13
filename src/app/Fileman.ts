export interface FileInterface {
    nama: string,
    tipe: string,
    nomor:  string,
    kodedesa?: string,
    tahun?:  string,
    isValid: boolean,
    isUploaded?: boolean,
}

export class Fileman {
    private REGEXBT = /^(BT)(_)(\d{14})/;
    private REGEXBTS = /^(BT)(_)(\d{6})/;
    private REGEXSU = /^(SU|GS|PLL|SUS|GT)(_)(\d{8})(_)(\d{5})(_)(\d{4})/;

    private files: string[];
    private type: "SU" | "BT" | "BT-S";

    constructor(files: string[], type: "SU" | "BT" | "BT-S") {
        this.files = files;
        this.type = type
    }

    extract(): FileInterface[] {
        const files: FileInterface[] = this.files.map(data => {
            const filename = data.replace('.pdf', '');
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
                    tipe: regex !== null ? regex[3].slice(0, 1) : "",
                    nomor: regex !== null ? regex[3].slice(-5) : "",
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
        });

        return files;
    }

}