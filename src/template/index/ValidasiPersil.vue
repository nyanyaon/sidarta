<template>
    <Loader />
    <Header />
    <div class="content">
        <h2>TOOL VALIDASI BIDANG TANAH</h2>
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
                    <option :data-kab-id="item.wilayahid" v-for="item in getListKabupaten" :value="item.tipewilayahid == 3 ? 'Kota ' + item.nama : 'Kab. ' + item.nama"></option>
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
                    <option :data-kec-id="item.wilayahid" v-for="item in getListDesa" :value="item.nama"></option>
                </datalist>
                <label for="file-loc">Daftar NIB (*.csv)</label>
                <button @click="selectFolder">{{ fileLocBtnTxt }}</button>
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
                <button @click="downloadReport" class="report-btn">REPORT HASIL</button>
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
    padding: 1em;
    color: #F4F4F4;
    font-size: 0.625em;
    font-weight: 700;
    font-family: 'Montserrat';
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
    margin-top: 4em;
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
import { store } from '../../Store';
import { defineComponent } from 'vue';
import type { Kecamatan, Desa, Kabupaten } from '../../app/Bot';
import kabJson from '../json/ntb_kabk.json';

export default defineComponent({
    name: "ValidasiPersil",
    components: {
        Header,
        Loader,
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
        }
    },
    computed: {
        getListKabupaten(): Kabupaten[] {
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
        selectFolder() {
            window.COMM.fileSelect();
        },
        downloadReport() {
            if((this.reportJson as String[]).length < 2) {
                alert('No Data');
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
            window.COMM.botStartValidasiPersil(this.user, this.pass, this.kabupatenId, this.kecamatanId, this.desaId, this.fileLocBtnTxt);
        },
        updateFolderSelect(event: Electron.IpcRenderer, data: any[]) {
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
        window.COMM.fileSelected(this.updateFolderSelect);
        window.COMM.botValidasiStatus(this.updateStatusValidasi);
        this.reportJson.push('pid,nib,message,isberhasil');
        this.user = window.localStorage.getItem("USER");
        this.pass = window.localStorage.getItem("PASS");
    }
});
</script>