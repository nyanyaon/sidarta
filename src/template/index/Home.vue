<template>
    <div class="header">
        <div class="brand">
            <img src="../img/logo.png" class="logo" alt="logo sidarta">
            <div class="brand-info">
                <h1>SIDARTA</h1>
                <p>Sistem Digitalisasi Arsip Pertanahan</p>
            </div>
        </div>

        <div class="user">
            <div class="info">
                <p><span v-html="getUserNama"></span></p>
            </div>
            <div class="box">
                <Fa icon="fa-solid fa-user" class="icon"/>
            </div>
        </div>
    </div>
    <div class="section">
        <h2>FITUR KAMI</h2>
        <div class="feature-container">
            <div class="feature-box available">
                <p>BUKU TANAH</p>
            </div>
            <div class="feature-box available">
                <p>SURAT UKUR</p>
            </div>
            <div class="feature-box unavailable">
                <p>COMING SOON</p>
            </div>
        </div>
    </div>
    <div class="section">
        <h2>STATISTK</h2>
        <div class="statistic-container">
            <div class="statistic-item">
                <p> {{ countBukuTanah  }}</p>
                <span>BUKU TANAH</span>
            </div>
            <div class="statistic-item">
                <p> {{ getSum  }}</p>
                <span>BULAN INI</span>
            </div>
            <div class="statistic-item">
                <p> {{ countSuratUkur  }}</p>
                <span>SURAT UKUR</span>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.statistic-item {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}
.statistic-item span {
    font-size: 0.75em;
    font-weight: 700;
    color: #FF7F22;
}
.statistic-item p {
    margin: 0;
    font-size: 2.25em;
    font-weight: 700;
    color: #393939;
}
.statistic-container {
    display: flex;
    flex-direction: row;
}
.feature-container {
    display: flex;
    flex-direction: row;
    gap: 1em;
}
.feature-box {
    color: #F4F4F4;
    font-size: 2em;
    font-weight: 700;
    margin: 0 auto;
    padding: 1em;
    border-radius: 1.25em;
    filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3));
}
.available {
    background: #FF614A;
}
.available:hover {
    background: #CC4E3B;
}

.unavailable {
    background: #FF9D56;
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
    font-weight: 700;
}

.header {
    display: flex;
    margin-top: 2em;
    margin-left: 2em;
    margin-right: 2em;
}
.brand {
    display: flex;
    flex-direction: row;
    margin-right: auto;
}
.brand img {
    height: 38px;
    width: auto;
}

.brand-info {
  margin-left: 0.875em;
}
.brand h1 {
  margin: 0;
  color: #FF9D56;
  font-size: 1em;
  font-weight: 700;
}

.brand p {
  margin: 0;
  margin-top: 3px;
  color: #000000;
  font-size: 0.625em;
  font-weight: 700;
}

.user {
    display: flex;
    flex-wrap: nowrap;
}

.user .info {
    font-size: 0.5625em;
    text-align: right;
    font-size: 0.625em;
    color: #000000;
    font-weight: 700;
    margin-right: 8px;
}

.user .box {
    display: flex;
    align-items: center;
}
.user .icon {
    padding: 0.3em;
    background: #FF9D56;
    color: #F3F3F3;
    border-radius: 0.2em;
    font-size: 21px;
    text-align: center;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "Home",
    props: {
        nama: String,
    },
    data() {
        return {
            _nama: this.nama || "Selamat datang, anon",
            countBukuTanah: 1000,
            countSuratUkur: 2000,
        }
    },
    computed: {
        getUserNama() {
            const nama: string = this._nama;
            return nama.replace(",", ",<br />");
        },
        getSum() {
            return this.countBukuTanah + this.countSuratUkur;
        }
    }
})
</script>
