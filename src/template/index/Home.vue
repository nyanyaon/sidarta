<template>
    <Header />
    <div class="section">
        <h2>REKAP VALIDASI PERSIL</h2>
        <div class="feature-container">
            <div class="feature-box available">
                <p class="context">Lombok<br/> Barat</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Lombok<br/> Tengah</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Lombok<br/> Timur</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Lombok<br/> Utara</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Kota<br/> Mataram</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Sumbawa<br/> Barat</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Sumbawa</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Dompu</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Kota<br/> Bima</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available">
                <p class="context">Kabupaten<br/> Bima</p>
                <p class="total">90</p>
            </div>
            <div class="feature-box available bg-green">
                <p class="context">Total</p>
                <p class="total">900</p>
            </div>
            <div @click="goToValidasiPersil" class="feature-box available bg-orange">
                <p class="context">Validasi<br/> Persil</p>
                <p class="total">GO</p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.bg-green {
    background: #1FC374!important;
}

.bg-orange {
    background: #FF9D56!important;
}

.feature-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    column-gap: 1em;
    row-gap: 1em;
}

.feature-box {
    margin: 0 auto;
    display: flex;
    width: 178px;
    height: 73px;
    padding: 1em;
    border-radius: 0.8em;
    align-items: center;
    box-sizing: border-box;
}

.feature-box .context {
    font-size: 1em;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    color: #F4F4F4;
    justify-content: center;
    margin-right: auto;
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
}

.available:hover {
    filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3));
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
    line-height: normal;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './Header.vue';

export default defineComponent({
    name: "Home",
    components: {
        Header,
    },
    data() {
        return {
            countBukuTanah: 0,
            countSuratUkur: 0,
        }
    },
    computed: {
        getSum() {
            return this.countBukuTanah + this.countSuratUkur;
        }
    },
    methods: {
        goToBukuTanah() {
            this.$router.replace('/bukutanah');
        },
        goToSuratUkur() {
            this.$router.replace('/suratukur');
        },
        goToValidasiPersil() {
            this.$router.replace('/validasipersil');
        }
    },
    // async mounted() {
    //     this.countBukuTanah = (await window.COMM.databaseGetAll('bukutanah')).length;
    //     this.countSuratUkur = (await window.COMM.databaseGetAll('suratukur')).length;
    // }
})
</script>
