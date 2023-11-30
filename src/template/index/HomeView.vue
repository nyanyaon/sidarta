<template>
    <div class="section">
        <h2>ALAT YANG TERSEDIA</h2>
        <div class="feature-container">
            <div @click="goToValidasiPersil" class="feature-box status-warn available">
                <img src="../img/logo-atrbpn.png" alt="ATRBPN" />
                <p class="context">Validasi<br /> Persil</p>
            </div>
            <div @click="goToUploadBukuTanah" class="feature-box status-warn available">
                <img src="../img/logo-atrbpn.png" alt="ATRBPN" />
                <p class="context">Upload <br /> BT</p>
            </div>
            <div @click="goToUploadSuratUkur" class="feature-box status-warn available">
                <img src="../img/logo-atrbpn.png" alt="ATRBPN" />
                <p class="context">Upload<br /> SU</p>
            </div>
            <div @click="goToUpdatePersil" class="feature-box status-warn available">
                <img src="../img/logo-atrbpn.png" alt="ATRBPN" />
                <p class="context">Update<br /> Persil</p>
            </div>
            <!-- <div class="feature-box unavailable">
                <p class="context">Validasi<br /> BT</p>
                <p class="total">GO</p>
            </div>
            <div class="feature-box unavailable">
                <p class="context">Validasi<br /> SU</p>
                <p class="total">GO</p>
            </div> -->
            <div @click="goToPenangguhanPersil" class="feature-box status-warn available">
                <img src="../img/logo-atrbpn.png" alt="ATRBPN" />
                <p class="context">Tangguh<br /> Persil</p>
            </div>
            <div @click="gotoEntryFisikPTSL" class="feature-box status-error available">
                <img src="../img/logo-atrbpn.png" alt="ATRBPN" />
                <p class="context">Entry Fisik<br /> PTSL</p>
            </div>
            <div @click="gotoSuratUkurKJSB" class="feature-box status-ready available">
                <img src="../img/logo-lura.png" alt="PT Lura Karya" />
                <p class="context">Upload<br /> SU</p>
            </div>
            <div @click="gotoBukuTanahKJSB" class="feature-box status-ready available">
                <img src="../img/logo-lura.png" alt="PT Lura Karya" />
                <p class="context">Upload<br /> BT</p>
            </div>
            <div @click="gotoWarkahKJSB" class="feature-box status-ready available">
                <img src="../img/logo-lura.png" alt="PT Lura Karya" />
                <p class="context">Upload<br /> Warkah</p>
            </div>
        </div>
    </div>
    <div class="logoveea">
        <img src="../img/Logo2.png" alt="logo veea">
        <p>Copyright 2022 By <br/> VEEA UTAMA TECH</p>
    </div>
</template>

<style lang="css" scoped>
.logoveea {
    width: 100vw;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 1.5em;
}

.logoveea img {
    height: 34px;
    width: auto;
}

.logoveea p {
    font-size: 0.7em;
    font-weight: 700;
}
.bg-green {
    background: #1FC374 !important;
}

.bg-orange {
    background: #FF9D56 !important;
}

.status-ready {
    border-left: 5px solid #33FF00;
}

.status-warn {
    border-left: 5px solid #FFC736;
}

.status-error {
    border-left: 5px solid #FF3636;
}

.feature-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    column-gap: 0.6em;
    row-gap: 1.2em;
}

.feature-box {
    margin: 0 auto;
    display: flex;
    width: 178px;
    height: 73px;
    padding: 1em;
    align-items: center;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
}
.feature-box img {
    height: 60px;
    widows: auto;
}

.feature-box .context {
    font-size: 1em;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    color: #F4F4F4;
    justify-content: center;
    margin-right: auto;
    margin-left: 0.7em;
}

.feature-box .total {
    color: #F4F4F4;
    text-align: right;
    font-size: 2em;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    justify-content: center;
}

.available {
    background: #00B2FF;
    cursor: pointer;
}

.available:hover {
    filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3));
}

.unavailable {
    background: #818181;
    cursor: not-allowed;
}

.section {
    margin-top: 2em;
    margin-left: 2em;
    margin-right: 2em;
}

.section h2 {
    text-align: center;
    font-size: 1em;
    color: #7B7B7B;
    margin-bottom: 2em;
    font-weight: 700;
    line-height: normal;
}
</style>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { useAppStore } from '../store/app';
import { mapWritableState } from 'pinia';

export default defineComponent({
    name: "HomeView",
    methods: {
        goToUploadBukuTanah() {
            this.$router.replace('/uploadbukutanah');
        },
        goToUploadSuratUkur() {
            this.$router.replace('/uploadsuratukur');
        },
        goToValidasiPersil() {
            this.$router.replace('/validasipersil');
        },
        goToUpdatePersil() {
            this.$router.replace('/updatepersil');
        },
        goToPenangguhanPersil() {
            this.$router.replace('/penangguhanpersil');
        },
        gotoEntryFisikPTSL() {
            this.$router.replace('/entryfisikptsl');
        },
        gotoSuratUkurKJSB() {
            this.$router.replace('/suratukurkjsb');
        },
        gotoBukuTanahKJSB() {
            this.$router.replace('/bukutanahkjsb');
        },
        gotoWarkahKJSB() {
            this.$router.replace('/warkahkjsb');
        },
    },
    computed: {
        ...mapWritableState(useAppStore, ['showSawer'])
    },
    mounted() {
        document.title = "AutoMate v1.2.7";
        this.showSawer = true;
    },
})
</script>
