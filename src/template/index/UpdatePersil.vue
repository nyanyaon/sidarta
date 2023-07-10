<template>
    <Loader />
    <Header />
    <div class="content">
        <h2>TOOL UPDATE WILAYAH PERSIL</h2>
        <div class="section">
            <div class="form-loc">
                <div class="input-type">
                    <input v-model="inputType" type="radio" id="persilid" value="persilid" name="persilid">
                    <label for="persilid">List PersilId</label>
                    <input v-model="inputType" type="radio" id="nib" value="nib" name="nib" checked>
                    <label for="nib">List NIB</label>
                    <input v-model="inputType" type="radio" id="hak" value="hak" name="hak">
                    <label for="hak">List NomorHak</label>
                </div>
                <div class="input-group">
                    <label for="user">Username</label>
                    <input @change="updateUser" v-model="user" type="text" id="user" name="user">
                </div>
                <div class="input-group">
                    <label for="pass">Password</label>
                    <input @change="updatePass" v-model="pass" type="password" id="pass" name="pass">
                </div>
                <div v-if="inputType == 'nib' || inputType == 'hak'" class="input-group">
                    <label for="kabupaten">Kabupaten</label>
                    <input @change="updateKabupaten" v-model="kabupaten" list="listkabupaten" type="text"
                    :data-kabid="kabupatenId" id="kabupaten" name="kabupaten">
                    <datalist id="listkabupaten">
                        <option :data-kab-id="item.wilayahid" v-for="item in getListKabupaten" :value="item.tipewilayahid == 3 ? 'Kota ' + item.nama : 'Kab. ' + item.nama"></option>
                    </datalist>
                </div>
                <div v-if="inputType == 'nib' || inputType == 'hak'" class="input-group">
                    <label for="kecamatan">Kecamatan</label>
                    <input @change="updateKecamatan" v-model="kecamatan" list="listkecamatan" type="text"
                    :data-kecid="kecamatanId" id="kecamatan" name="kecamatan">
                    <datalist id="listkecamatan">
                        <option :data-kec-id="item.wilayahid" v-for="item in getListKecamatan" :value="item.nama"></option>
                    </datalist>
                </div>
                <div v-if="inputType == 'nib' || inputType == 'hak'" class="input-group">
                    <label for="desa">Desa</label>
                    <input @change="updateDesa" v-model="desa" list="listdesa" type="text" name="desa" id="desa">
                    <datalist id="listdesa">
                        <option :data-kec-id="item.wilayahid" v-for="item in getListDesa" :value="item.nama"></option>
                    </datalist>
                </div>
                <div class="input-group">
                    <label v-if="inputType == 'nib'" for="file-loc">Daftar NIB (*.csv)</label>
                    <label v-if="inputType == 'persilid'" for="file-loc">Daftar PersilId (*.csv)</label>
                    <label v-if="inputType == 'hak'" for="file-loc">Daftar Hak (*.csv)</label>
                    <button @click="selectFile">{{ fileLocBtnTxt }}</button>
                </div>
                <button @click="start" class="start">Mulai</button>
            </div>
            <div class="doc-container">
                <div class="berhasil">
                    <h3>BERHASIL :</h3>
                    <p>{{ cBerhasil }} Bidang</p>
                </div>
                <div class="gagal">
                    <h3>GAGAL :</h3>
                    <p>{{ cGagal }} Bidang</p>
                </div>
                <button @click="downloadReport" class="report-btn">
                    <Fa icon="fa-solid fa-download" size="xl" style="color: #ffffff;"/> 
                    <p class="text"> REPORT HASIL</p>
                </button>
            </div>
        </div>
    </div>
    <Footer />
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
import Header from './Header.vue';
import Loader from './Loader.vue';
import Footer from './Footer.vue';
import { store } from '../../Store';
import { defineComponent } from 'vue';
import type { Kecamatan, Desa, Kabupaten } from '../../app/Bot';
import kabJson from '../json/ntb_kabk.json';

export default defineComponent({
    name: "ValidasiPersil",
    components: {
        Header,
        Loader,
        Footer,
    },
    data() {
        return {
            fileLocBtnTxt: "Pilih",
            store,
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
            inputType: "nib",
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
            return this.kecJson;
        },
        getListDesa(): Desa[] {
            if (this.kecamatanId === "") return this.desaJson;

            const listdesa = (this.desaJson as Desa[]).filter(value => value.induk === this.kecamatanId);

            return listdesa;
        }
    },
    methods: {
        updateUser(ev: Event) {
            window.localStorage.setItem("USER", this.user);
        },
        updatePass(ev: Event) {
            window.localStorage.setItem("PASS", this.pass);
        },
        selectFile() {
            window.COMM.fileSelect();
        },
        downloadReport() {
            if((this.reportJson as String[]).length < 2) {
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
            window.COMM.botStartUpdatePersil(this.user, this.pass, this.inputType,this.kabupatenId, this.kecamatanId, this.desaId, this.fileLocBtnTxt);
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
        document.title = "SIDARTA | VALIDASI PERSIL BOT"
        window.COMM.fileSelected(this.updateFileSelect);
        window.COMM.botStatusHandler(this.updateStatusValidasi);
        this.reportJson.push('pid,nib,message,isberhasil');
        this.user = window.localStorage.getItem("USER");
        this.pass = window.localStorage.getItem("PASS");
        if(window.localStorage.getItem("USER_KAB") === null) {
            const [ kab, kabId ]  = window.localStorage.getItem("USER_KAB").split(",");
            this.kabupatenId = kabId;
            this.kabupaten = kab;
        }
    }
});
</script>