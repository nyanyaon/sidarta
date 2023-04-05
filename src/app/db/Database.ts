import * as mongoDB from 'mongodb';

export class Database {
    private _dbname = "darta";
    private _db: mongoDB.Db;

    async connect() {
        const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://spntb:geoserver23@103.52.114.166");

        await client.connect();

        const db: mongoDB.Db = client.db(this._dbname);

        this._db = db;
    }

    getCollection(name: string): mongoDB.Collection {
        return this._db.collection(name);
    }
}