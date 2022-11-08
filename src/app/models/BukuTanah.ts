import { ObjectId } from "mongodb";

export default class BukuTanah {
    constructor (
        public nama: string,
        public nomor: string,
        public type: string,
        public kec: string,
        public desa: string,
        public uploadAt: Date,
        public suratukur: {
            nomor: string,
            desa: string,
            tahun: string,
        }
    ) {}
}
