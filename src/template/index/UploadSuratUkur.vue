<template>
    <Loader />
    <Header />
    <div class="content">
        <h2>TOOL UPLOAD SURAT UKUR</h2>
        <div class="section">
            <div class="form-loc">
                <label for="user">Username</label>
                <input @change="updateUser" v-model="user" type="text" id="user" name="user">
                <label for="pass">Password</label>
                <input @change="updatePass" v-model="pass" type="password" id="pass" name="pass">
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
    <Footer />
</template>

<style scoped>

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

.form-loc label {
    font-size: 0.625em;
    font-weight: 700;
    color: #7B7B7B;
    margin-bottom: 0.625em;
}

.form-loc input {
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
import Header from './Header.vue';
import Loader from './Loader.vue';
import Footer from './Footer.vue';
import { store } from '../../Store';
import { defineComponent } from 'vue';
import type { Kabupaten, Kecamatan, Desa } from '../../app/Bot';
import { FileInterface } from '../../app/Fileman';

export default defineComponent({
    name: "UploadSuratUkur",
    components: {
        Header,
        Loader,
        Footer,
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
    },
    methods: {
        selectFolder() {
            window.COMM.folderSelect('SU');
        },
        start() {
            const text = JSON.stringify(this.files);
            const files = JSON.parse(text) as FileInterface[];

            window.COMM.botStartUploadSuratUkur(this.user, this.pass, files, this.fileLocBtnTxt);
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
        },
    },
    mounted() {
        document.title = "SIDARTA - Upload Surat Ukur";
        window.COMM.folderSelected(this.updateFolderSelect);
        this.reportJson.push('pid,nib,message,isberhasil');
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