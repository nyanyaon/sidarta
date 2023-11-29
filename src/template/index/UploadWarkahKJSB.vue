<template>
    <div class="content">
        <h2>TOOL UPLOAD WARKAH PT.LURA</h2>
        <div class="section">
            <div class="form-loc">
                <div class="input-type">
                    <input v-model="inputType" type="radio" id="di208" value="di208" name="di208" checked>
                    <label for="di208">DI208</label>
                    <input v-model="inputType" type="radio" id="di302" value="di302" name="di302">
                    <label for="di302">DI302</label>
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
import { defineComponent } from 'vue';
import type { FileInterface } from '../../app/Fileman';

export default defineComponent({
    name: "UploadWarkahKJSB",
    data() {
        return {
            fileLocBtnTxt: "Pilih",
            reportJson: [],
            user: "",
            pass: "",
            cBerhasil: 0,
            cGagal: 0,
            cFiles: 0,
            inputType: "di208",
        }
    },
    watch: {
        inputType(newType, oldType) {
            this.fileLocBtnTxt = "Pilih";
            this.cFiles = 0;
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
            if (this.inputType == 'di208') {
                window.COMM.folderSelect('W');
                return;
            }
            if (this.inputType == 'di302') {
                window.COMM.folderSelect('W302');
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
            link.download = `test.csv`;

            link.href = URL.createObjectURL(blob);
            link.click();

            URL.revokeObjectURL(link.href);
        },
        start() {
            // window.COMM.appOpenExternal('https://www.highcpmrevenuegate.com/qfmnuap5z?key=4c47fd32a3fe0a592119563c8f704443')
            const text = JSON.stringify(this.files);
            const files = JSON.parse(text) as FileInterface[];

            window.COMM.botStartUploadWarkahKJSB(this.user, this.pass, this.inputType, files, this.fileLocBtnTxt);
        },
        updateFileSelect(event: Electron.IpcRenderer, data: any[]) {
            this.fileLocBtnTxt = data[0];
        },
        updateStatusValidasi(event: Electron.IpcRenderer, data: any[]) {
            (this.reportJson as String[]).push(`${data[0].nama},${data[0].id},${data[0].keterangan},${data[0].success}`);
            if (data[0].success == true) {
                this.cBerhasil++
            } else {
                this.cGagal++
            }
        },
        updateFolderSelect(event: Electron.IpcRenderer, data: any[]) {
            this.files = data[1];
            this.cFiles = (data[1] as FileInterface[]).filter(item => item.isValid === true).length;

            this.fileLocBtnTxt = data[0];
        },
    },
    mounted() {
        document.title = "AutoMate - Upload Warkah Lura";;
        window.COMM.folderSelected(this.updateFolderSelect);
        window.COMM.botStatusHandler(this.updateStatusValidasi);
        this.reportJson.push('nama,id,keterangan,berhasil');
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