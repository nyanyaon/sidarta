export interface FileInterface {
    nama: string,
    tipe: string,
    nomor:  string,
    tahun?:  string,
    isValid: boolean,
    isUploaded?: boolean,
}

export class Fileman {
    private REGEXBT = /^(BT)(_)(\d{14})/;
    private REGEXSU = /^(SU|GS|PLL|SUS|GT)(_)(\d{8})(_)(\d{5})(_)(\d{4})/;

    private files: string[];
    private type: "SU" | "BT";

    constructor(files: string[], type: "SU" | "BT") {
        this.files = files;
        this.type = type
    }

    extract(): FileInterface[] {
        const files: FileInterface[] = this.files.map(data => {
            let filename = data.replace('.pdf', '');
            if (this.type === "BT") {
                let regex = filename.match(this.REGEXBT);
                return {
                    nama: data,
                    tipe: regex !== null ? regex[3].slice(8, 9) : "",
                    nomor: regex !== null ? regex[3].slice(-5) : "",
                    isValid: regex !== null ? true : false,
                }
            }

            if (this.type === "SU") {
                let regex = filename.match(this.REGEXSU);
                return {
                    nama: data,
                    tipe: regex !== null ? regex[1] : "",
                    nomor: regex !== null ? regex[5] : "",
                    tahun: regex !== null ? regex[7] : "",
                    isValid: regex !== null ? true : false,
                }
            }
        });

        return files;
    }

}