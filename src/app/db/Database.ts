import * as mongoDB from 'mongodb';

export class Database {
    private _dbname: string = "darta";
    private _db: mongoDB.Db;

    async connect() {
        const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://root:12345@nyanyaon.my.id/");

        await client.connect();

        const db: mongoDB.Db = client.db(this._dbname);

        this._db = db;
    }

    getCollection(name: string): mongoDB.Collection {
        return this._db.collection(name);
    }
}