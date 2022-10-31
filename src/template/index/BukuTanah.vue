<template>
    <Header />
    <div class="content">
        <h2>BUKU TANAH</h2>
        <div class="section">
            <div class="form-loc">
                <label for="kecamatan">Kecamatan</label>
                <input @change="updateKecamatan" v-model="kecamatan" list="listkecamatan" type="text" id="kecamatan" name="kecamatan">
                <datalist id="listkecamatan">
                    <option v-for="item in getListKecamatan" :value="item.nama"></option>
                </datalist>
                <label for="desa">Desa</label>
                <input @change="updateDesa" v-model="desa" list="listdesa" type="text" name="desa" id="desa">
                <datalist id="listdesa">
                    <option v-for="item in getListDesa" :value="item.nama"></option>
                </datalist>
                <label for="file-loc">Lokasi Dokumen</label>
                <button @click="selectFolder">{{ fileLocBtnTxt }}</button>
                <button class="start">Mulai</button>
            </div>
            <div class="doc-container">
                <h3>List Dokumen ({{ getCountFiles }})</h3>
                <div v-for="file, index in getFiles" class="doc-item">
                    <Fa icon="fa-solid fa-file-pdf" class="icon" />
                    <p>{{ file }}</p>
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
    margin-right: 4em;
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

.doc-item .icon {
    color: #FF3636;
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
import { store } from '../../Store';
import { defineComponent } from 'vue';
import { BukuTanahOption, Kecamatan, Desa } from '../../app/Bot';

export default defineComponent({
    name: "BukuTanahUploader",
    components: {
        Header
    },
    data() {
        return {
            fileLocBtnTxt: "Pilih",
            store,
            options: {} as BukuTanahOption,
            kecamatan: "",
            desa: "",
        }
    },
    computed: {
        getFiles(): string[] {
            return this.store.files.slice(0, 10);
        },
        getCountFiles(): number {
            return this.store.files.length;
        },
        getListKecamatan(): Kecamatan[]{
            return this.options.dataKecamatanJSON;
        },
        getListDesa(): Desa[]{
            if(this.kecamatan === "") return this.options.dataDesaJSON;

            const options: BukuTanahOption = this.options;
            const kec = options.dataKecamatanJSON.find(value => value.nama === this.kecamatan);
            if(kec === undefined) return;
            const listdesa = options.dataDesaJSON.filter(value => value.induk === kec.wilayahid);

            return listdesa;
        }
    },
    methods: {
        selectFolder() {
            window.COMM.folderSelect();
        },
        updateFolderSelect(event: Electron.IpcRenderer, data: any[]) {
            this.store.files = data[1];
            this.fileLocBtnTxt = data[0];
        },
        updateDataOpt(event: Electron.IpcRenderer, ...data: any[]) {
            this.options = data[0][0];
            console.log(this.options);
        },
        updateKecamatan(event: Event) {
            if(this.kecamatan === "") return;
            const options: BukuTanahOption = this.options;
            const kec = options.dataKecamatanJSON.find(value => value.nama === this.kecamatan);
            const desa = options.dataDesaJSON.find(value => value.induk === kec.wilayahid);

            this.desa = desa.nama;
        },
        updateDesa(event: Event) {
            if(this.desa === "") return;
            const options: BukuTanahOption = this.options;
            const desa = options.dataDesaJSON.find(value => value.nama === this.desa);
            const kec = options.dataKecamatanJSON.find(value => value.wilayahid === desa.induk);

            this.kecamatan = kec.nama;
        },
    },
    mounted() {
        window.COMM.folderSelected(this.updateFolderSelect);
        window.COMM.bukutanahWaitData(this.updateDataOpt);
        window.COMM.botGetBukuTanahOption();
    }
});
</script>