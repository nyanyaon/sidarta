import { ObjectId } from "mongodb";

export default class BukuTanah {
    constructor (
        public nama: string,
        public nomor: string,
        public type: string,
        public uploadAt: Date,
        public suID: string,
        public id?: ObjectId,
    ) {}
}
