import { ObjectId } from "mongodb";

export default class SuratUkur {
    constructor (
        public nama: string,
        public nomor: string,
        public type: string,
        public tahun: string,
        public kec: string,
        public desa: string,
        public uploadAt: Date,
    ) {}
}
