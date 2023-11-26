<template>
    <div class="content">
        <h2>TOOL UPLOAD SURAT UKUR KJSB</h2>
        <div class="section">
            <div class="form-loc">
                <div class="input-type">
                    <input v-model="inputType" type="radio" id="btSimple" value="btSimple" name="suSimple" checked>
                    <label for="btSimple">SU Simple</label>
                    <input v-model="inputType" type="radio" id="btFull" value="btFull" name="suFull">
                    <label for="btFull">SU Full</label>
                </div>
                <div class="input-group">
                    <label for="user">Username</label>
                    <input @change="updateUser" v-model="user" type="text" id="user" name="user">
                </div>
                <div class="input-group">
                    <label for="pass">Password</label>
                    <input @change="updatePass" v-model="pass" type="password" id="pass" name="pass">
                </div>
                <div class="input-group">
                    <label for="kabupaten">Kabupaten</label>
                    <input @change="updateKabupaten" v-model="kabupaten" list="listkabupaten" type="text"
                        :data-kabid="kabupatenId" id="kabupaten" name="kabupaten">
                    <datalist id="listkabupaten">
                        <option :data-kab-id="item.wilayahid" v-for="item in getListKabupaten"
                            :value="parseWil(item.nama, item.tipewilayahid)"></option>
                    </datalist>
                </div>
                <div class="input-group">
                    <label for="kecamatan">Kecamatan</label>
                    <input @change="updateKecamatan" v-model="kecamatan" list="listkecamatan" type="text"
                        :data-kecid="kecamatanId" id="kecamatan" name="kecamatan">
                    <datalist id="listkecamatan">
                        <option :data-kec-id="item.wilayahid" v-for="item, index in getListKecamatan"
                            :value="index + 1 + '.' + item.nama">
                        </option>
                    </datalist>
                </div>
                <div class="input-group">
                    <label for="desa">Desa</label>
                    <input @change="updateDesa" v-model="desa" list="listdesa" type="text" name="desa" id="desa">
                    <datalist id="listdesa">
                        <option :data-kel-id="item.wilayahid" v-for="item in getListDesa"
                            :value="parseWil(item.nama, item.tipewilayahid)"></option>
                    </datalist>
                </div>
                <div class="input-group">
                    <label for="file-loc">Pilih Folder</label>
                    <button @click="selectFolder">{{ fileLocBtnTxt }}</button>
                </div>
                <button @click="start" class="start">Mulai</button>
            </div>
            <div class="doc-container">
                <div class="berhasil">
                    <h3>JUMLAH :</h3>
                    <p>{{ cFiles }} Berkas</p>
                </div>
                <div class="berhasil">
                    <h3>BERHASIL :</h3>
                    <p>{{ cBerhasil }} Berkas</p>
                </div>
                <div class="gagal">
                    <h3>GAGAL :</h3>
                    <p>{{ cGagal }} Berkas</p>
                </div>
                <button @click="downloadReport" class="report-btn">
                    <Fa icon="fa-solid fa-download" size="xl" style="color: #ffffff;" />
                    <p class="text"> REPORT HASIL</p>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section {
    display: flex;
    margin-top: 1em;
}

.doc-container {
    display: flex;
    flex-direction: column;
}

.doc-container h3 {
    margin: 0;
    font-size: 0.625em;
    font-weight: 700;
    margin-bottom: 0.75em;
}

.berhasil h3 {
    color: #009721;
    font-size: 0.625rem;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.gagal h3 {
    color: #D70000;
    font-size: 0.625rem;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.doc-container p {
    color: #393939;
    font-size: 1rem;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.report-btn {
    border-radius: 0.875em;
    background: #00B2FF;
    border: none;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    padding-left: 1.25em;
    padding-right: 1.25em;
    display: flex;
    align-items: center;
    justify-content: center;
}

.report-btn .text {
    color: #F4F4F4;
    font-size: 0.8em;
    font-weight: 700;
    font-family: 'Montserrat';
    margin-left: 12px;
    margin-top: 0;
    margin-bottom: 0;
}

.form-loc {
    display: flex;
    flex-direction: column;
    width: 70%;
    margin-right: 2em;
}

.input-type {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
}

.input-type label {
    font-size: 0.625em;
    font-weight: 700;
    color: #7B7B7B;
    margin-bottom: 0;
    margin-right: 0.5em;
}

.input-type input {
    font-size: 0.625em;
    font-weight: 700;
    color: #7B7B7B;
    margin-top: 0;
}

.input-group {
    display: flex;
    flex-direction: column;
}

.input-group label {
    font-size: 0.625em;
    font-weight: 700;
    color: #7B7B7B;
    margin-bottom: 0.625em;
}

.input-group input {
    background: none;
    border: 1px solid #00B2FF;
    font-size: .8em;
    font-weight: 400;
    padding: 0.5em 1em;
    margin-bottom: 0.625em;
    border-radius: 1rem;
}

.form-loc button {
    background: #00B2FF;
    color: #F4F4F4;
    border: none;
    font-size: .8em;
    font-weight: 700;
    padding: 0.5em 1em;
    margin-bottom: 0.625em;
    border-radius: 1rem;
}

.form-loc button:hover {
    cursor: pointer;
}

.start {
    margin-top: 2em;
    background: #1FC374 !important;
}

.content {
    margin-top: 1.2em;
    margin-left: 2.875em;
    margin-right: 2em;
}

.content h2 {
    font-size: 1em;
    color: #393939;
    font-weight: 700;
}
</style>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { Kecamatan, Desa, Kabupaten } from '../../app/Bot';
import type { FileInterface } from '../../app/Fileman';

import kabJson from '../json/ntb_kabk.json';

export default defineComponent({
    name: "UploadSuratUkurKJSB",
    data() {
        return {
            fileLocBtnTxt: "Pilih",
            kecJson: [] as Kecamatan[],
            desaJson: [] as Desa[],
            reportJson: [],
            kabupatenId: "",
            kabupaten: "",
            kecamatanId: "",
            kecamatan: "",
            desaId: "",
            desa: "",
            user: "",
            pass: "",
            cBerhasil: 0,
            cGagal: 0,
            cFiles: 0,
            inputType: "suSimple",
        }
    },
    computed: {
        getListKabupaten(): Kabupaten[] {
            if (this.kabupaten == "") return kabJson;

            fetch('https://nyanyaon.github.io/sidarta_server/' + this.kabupatenId + '_kec.json')
                .then(res => res.json())
                .then(json => { this.kecJson = json });
            fetch('https://nyanyaon.github.io/sidarta_server/' + this.kabupatenId + '_desa.json')
                .then(res => res.json())
                .then(json => { this.desaJson = json });

            return kabJson;
        },
        getListKecamatan(): Kecamatan[] {
            return (this.kecJson as Kecamatan[]).filter(value => value.validsampai === null);
        },
        getListDesa(): Desa[] {
            const listdesa = (this.desaJson as Desa[]).filter(value => value.validsampai === null)
            if (this.kecamatan === "") return listdesa;

            return listdesa.filter(value => value.induk === this.kecamatanId);
        }
    },
    methods: {
        parseWil(nama: string, tipe: number) {
            let namaParsed = ''
            switch (tipe) {
                case 3:
                    namaParsed = `Kota ${nama}`
                    break;
                case 2:
                    namaParsed = `Kab. ${nama}`
                    break;
                case 6:
                    namaParsed = `Desa ${nama}`
                    break;
                case 7:
                    namaParsed = `Kel. ${nama}`
                    break;
                default:
                    break;
            }

            return namaParsed
        },
        updateUser(ev: Event) {
            window.localStorage.setItem("USER", this.user);
        },
        updatePass(ev: Event) {
            window.localStorage.setItem("PASS", this.pass);
        },
        selectFolder() {
            if (this.inputType == 'suFull') {
                window.COMM.folderSelect('SU');
                return;
            }
            if (this.inputType == 'suSimple') {
                window.COMM.folderSelect('SU-S');
                return;
            }
        },
        downloadReport() {
            if ((this.reportJson as String[]).length < 2) {
                alert('no data');
                return;
            }
            const text: string = (this.reportJson as String[]).join('\n');
            const blob = new Blob([text], { type: "text/csv" });

            const link = document.createElement('a');
            link.download = `${this.kabupaten}_${this.kecamatan}_${this.desa}.csv`;

            link.href = URL.createObjectURL(blob);
            link.click();

            URL.revokeObjectURL(link.href);
        },
        start() {
            // window.COMM.appOpenExternal('https://www.highcpmrevenuegate.com/qfmnuap5z?key=4c47fd32a3fe0a592119563c8f704443')
            const text = JSON.stringify(this.files);
            const files = JSON.parse(text) as FileInterface[];

            window.COMM.botStartUploadSuratUkurKJSB(this.user, this.pass, this.kabupatenId, this.kecamatanId, this.desaId, files, this.fileLocBtnTxt);
        },
        updateFileSelect(event: Electron.IpcRenderer, data: any[]) {
            this.fileLocBtnTxt = data[0];
        },
        updateStatusValidasi(event: Electron.IpcRenderer, data: any[]) {
            (this.reportJson as String[]).push(`${data[0].pid},${data[0].nib},${data[0].status},${data[0].success}`);
            if (data[0].success == true) {
                this.cBerhasil++
            } else {
                this.cGagal++
            }
        },
        updateKabupaten(event: Event) {
            if (this.kabupaten === "") return;
            this.updateKabId();
            const kab = kabJson.find(value => value.wilayahid === this.kabupatenId);
            fetch('https://nyanyaon.github.io/sidarta_server/' + kab.wilayahid + '_kec.json')
                .then(res => res.json())
                .then(json => { this.kecJson = json });
            fetch('https://nyanyaon.github.io/sidarta_server/' + kab.wilayahid + '_desa.json')
                .then(res => res.json())
                .then(json => { this.desaJson = json });
            window.localStorage.setItem("USER_KAB", this.kabupaten + "," + this.kabupatenId);
        },
        updateKecamatan(event: Event) {
            if (this.kecamatan === "") return;

            this.updateKecId()
        },
        updateDesa(event: Event) {
            if (this.desa === "") return;
            const listdesa = (document.querySelector('#listdesa') as HTMLDataListElement).options;
            const desa = Array.from(listdesa);
            this.desaId = desa.find(val => val.value === this.desa).dataset.kelId;
            const induk = (this.desaJson as Desa[]).find(val => val.wilayahid === this.desaId).induk;
            const listkec = (document.querySelector('#listkecamatan') as HTMLDataListElement).options;
            const kec = Array.from(listkec);

            this.kecamatanId = induk;
            this.kecamatan = kec.find(val => val.dataset.kecId === induk).value;
        },
        updateKabId() {
            const datalist = (document.querySelector('#listkabupaten') as HTMLDataListElement).options;
            const dataArr = Array.from(datalist);
            this.kabupatenId = dataArr.find(val => val.value === this.kabupaten).dataset.kabId;
        },
        updateKecId() {
            const datalist = (document.querySelector('#listkecamatan') as HTMLDataListElement).options;
            const dataArr = Array.from(datalist);
            this.kecamatanId = dataArr.find(val => val.value === this.kecamatan).dataset.kecId;
        },
        updateFolderSelect(event: Electron.IpcRenderer, data: any[]) {
            this.files = data[1];
            this.cFiles = (data[1] as FileInterface[]).filter(item => item.isValid === true).length;

            this.fileLocBtnTxt = data[0];
        },
    },
    mounted() {
        document.title = "AutoMate - Upload Surat Ukur Lura";;
        window.COMM.folderSelected(this.updateFolderSelect);
        window.COMM.botStatusHandler(this.updateStatusValidasi);
        this.reportJson.push('nama,message,isberhasil');
        this.user = window.localStorage.getItem("USER");
        this.pass = window.localStorage.getItem("PASS");
        if (window.localStorage.getItem("USER_KAB") !== null) {
            const [kab, kabId] = window.localStorage.getItem("USER_KAB").split(",");
            this.kabupatenId = kabId;
            this.kabupaten = kab;
        }
    }
});
</script>