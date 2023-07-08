<template>
    <Loader />
    <Header />
    <div class="content">
        <h2>SURAT UKUR</h2>
        <div class="section">
            <div class="form-loc">
                <label for="user">Username</label>
                <input @change="updateUser" v-model="user" type="text" id="user" name="user">
                <label for="pass">Password</label>
                <input @change="updatePass" v-model="pass" type="password" id="pass" name="pass">
                <label for="kabupaten">Kabupaten</label>
                <input @change="updateKabupaten" v-model="kabupaten" list="listkabupaten" type="text"
                    :data-kabid="kabupatenId" id="kabupaten" name="kabupaten">
                <datalist id="listkabupaten">
                    <option :data-kab-id="item.wilayahid" v-for="item in getListKabupaten"
                        :value="item.tipewilayahid == 3 ? 'Kota ' + item.nama : 'Kab. ' + item.nama"></option>
                </datalist>
                <label for="kecamatan">Kecamatan</label>
                <input @change="updateKecamatan" v-model="kecamatan" list="listkecamatan" type="text"
                    :data-kecid="kecamatanId" id="kecamatan" name="kecamatan">
                <datalist id="listkecamatan">
                    <option :data-kec-id="item.wilayahid" v-for="item in getListKecamatan" :value="item.nama"></option>
                </datalist>
                <label for="desa">Desa</label>
                <input @change="updateDesa" v-model="desa" list="listdesa" type="text" name="desa" id="desa">
                <datalist id="listdesa">
                    <option v-for="item in getListDesa" :value="item.nama"></option>
                </datalist>
                <label for="file-loc">Lokasi Dokumen</label>
                <button @click="selectFolder">{{ fileLocBtnTxt }}</button>
                <button @click="start" class="start">Mulai</button>
            </div>
            <div class="doc-container">
                <h3>List Dokumen ({{ getCountFiles }}) : ❌{{ getFilesError }} ✔{{ getFilesOk }}</h3>
                <div v-for="file, index in getFiles" class="doc-item">
                    <Fa icon="fa-solid fa-file-pdf" :class="file.isValid ? 'icon-ready' : 'icon-error'" />
                    <p>{{ file.nama }} <span v-if="file.isUploaded">👍</span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section {
    display: flex;
    margin-top: 2em;
}

.doc-container {
    display: flex;
    flex-direction: column;
    margin-left: auto;
}

.doc-container h3 {
    margin: 0;
    font-size: 0.625em;
    font-weight: 700;
    color: #7B7B7B;
    margin-bottom: 0.75em;
}

.doc-item {
    display: flex;
    margin: 0;
    align-items: center;
}

.doc-item .icon-error {
    color: #FF3636;
    font-size: 15px;
    text-align: center;
}

.doc-item .icon-ready {
    color: #02B334;
    font-size: 15px;
    text-align: center;
}

.doc-item p {
    font-size: 0.625em;
    font-weight: 700;
    color: #393939;
    margin-left: 0.5em;
}

.form-loc {
    display: flex;
    flex-direction: column;
    width: 70%;
}

.form-loc label {
    font-size: 0.625em;
    font-weight: 700;
    color: #7B7B7B;
    margin-bottom: 0.625em;
}

.form-loc input {
    background: none;
    border: 1px solid #FF9D56;
    font-size: .8em;
    font-weight: 400;
    padding: 0.5em 1em;
    margin-bottom: 0.625em;
    border-radius: 1rem;
}

.form-loc button {
    background: #FF9D56;
    color: #F4F4F4;
    border: none;
    font-size: .8em;
    font-weight: 700;
    padding: 0.5em 1em;
    margin-bottom: 0.625em;
    border-radius: 1rem;
}

.start {
    margin-top: 4em;
    background: #1FC374 !important;
}

.content {
    margin-top: 2em;
    margin-left: 4em;
    margin-right: 4em;
}

.content h2 {
    font-size: 1em;
    color: #393939;
    font-weight: 700;
}
</style>

<script lang="ts">
import Header from './Header.vue';
import Loader from './Loader.vue';
import { store } from '../../Store';
import { defineComponent } from 'vue';
import type { Kabupaten, Kecamatan, Desa } from '../../app/Bot';
import { FileInterface } from '../../app/Fileman';
import kabJson from '../json/ntb_kabk.json';

export default defineComponent({
    name: "UploadSuratUkur",
    components: {
        Header,
        Loader,
    },
    data() {
        return {
            fileLocBtnTxt: "Pilih",
            store,
            files: [] as FileInterface[],
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
        }
    },
    computed: {
        getFiles(): FileInterface[] {
            return this.files.map((val: FileInterface) => val).sort((valA: FileInterface, valB: FileInterface) => (valA.isValid === valB.isValid) ? 0 : valA.isValid ? -1 : 1).splice(0, 10);
        },
        getFilesError(): number {
            return this.files.filter((val: FileInterface) => !val.isValid).length;
        },
        getFilesOk(): number {
            return this.files.filter((val: FileInterface) => val.isValid).length;
        },
        getCountFiles(): number {
            return this.files.length;
        },
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
            return this.kecJson;
        },
        getListDesa(): Desa[] {
            if (this.kecamatanId === "") return this.desaJson;

            const listdesa = (this.desaJson as Desa[]).filter(value => value.induk === this.kecamatanId);

            return listdesa;
        }
    },
    methods: {
        selectFolder() {
            window.COMM.folderSelect('SU');
        },
        start() {
            const files: FileInterface[] = this.files.map((v: FileInterface) => {
                const nama = v.nama;
                const isValid = v.isValid;
                const isUploaded = v.isUploaded;
                const nomor = v.nomor;
                const tipe = v.tipe;
                const tahun = v.tahun;

                return {
                    nama,
                    isValid,
                    isUploaded,
                    nomor,
                    tipe,
                    tahun,
                }
            });

            window.COMM.botStartSuratUkur(this.kecamatan, this.kecamatanId, this.desa, files, this.fileLocBtnTxt);
        },
        updateUser(ev: Event) {
            window.localStorage.setItem("USER", this.user);
        },
        updatePass(ev: Event) {
            window.localStorage.setItem("PASS", this.pass);
        },
        updateFolderSelect(event: Electron.IpcRenderer, data: any[]) {
            this.files = data[1];

            this.fileLocBtnTxt = data[0];
            this.store.isLoading = true;
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
        },
        updateDesa(event: Event) {
            if (this.desa === "") return;
            const desa = (this.desaJson as Desa[]).find(value => value.nama === this.desa);
            const kec = (this.kecJson as Kecamatan[]).find(value => value.wilayahid === desa.induk);

            this.kecamatan = kec.nama;
            this.kecamatanId = kec.wilayahid;
            this.desaId = desa.wilayahid;
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
    },
    mounted() {
        document.title = "SIDARTA | UPLOAD SURAT UKUR"
        window.COMM.folderSelected(this.updateFolderSelect);
        this.reportJson.push('pid,nib,message,isberhasil');
        this.user = window.localStorage.getItem("USER");
        this.pass = window.localStorage.getItem("PASS");
        if (window.localStorage.getItem("USER_KAB") === null) {
            const [kab, kabId] = window.localStorage.getItem("USER_KAB").split(",");
            this.kabupatenId = kabId;
            this.kabupaten = kab;
        }
    }
});
</script>