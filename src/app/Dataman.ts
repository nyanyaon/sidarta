import * as fs from 'fs'
import * as fastCSV from 'fast-csv'

export async function readCsv(fileloc: string) {
    const options = {
        objectMode: true,
        delimiter: ',',
        headers: true,
        renameHeaders: false,
    }

    return new Promise((resolve, reject) => {
        const data: string[] = []
        
        const dataRead = fs.createReadStream(fileloc)
        .pipe(fastCSV.parse(options))
        .on('error', (error) => {
            console.log(error)
        })
        .on('data', (row) => {
            data.push(row)
        })
        .on('end', () => {
            resolve(data)
        })  
    })
}