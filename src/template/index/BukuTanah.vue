<template>
    <Header />
    <div class="content">
        <h2>BUKU TANAH</h2>
        <div class="form-loc">
            <label for="kecamatan">Kecamatan</label>
            <input type="text" name="kecamatan">
            <label for="desa">Desa</label>
            <input type="text" name="desa">
            <label for="file-loc">Lokasi Dokumen</label>
            <button @click="selectFolder">{{ fileLocBtnTxt }}</button>
            <button class="start">Mulai</button>
        </div>
    </div>
</template>

<style scoped> 
.form-loc {
    display: flex;
    flex-direction: column;
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
    background: #1FC374!important;
}
.content {
    margin-top: 3em;
    margin-left: 4em;
    margin-right: 4em;
}
.content h2 {
    font-size: 1em;
    color: #393939;
    font-weight: 700;
    margin-bottom: 4em;
}
</style>

<script lang="ts">
import Header from './Header.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "BukuTanahUploader",
    components: {
        Header
    },
    data() {
        return {
            fileLocBtnTxt: "Pilih"
        }
    },
    
    methods: {
        selectFolder() {
            window.COMM.folderSelect();
        },
        updateFolderSelect(event: Electron.IpcRenderer, data: string) {
            this.fileLocBtnTxt = data[0];
        }
    },
    mounted() {
        window.COMM.folderSelected(this.updateFolderSelect);
        
    }
});
</script>