<template>
    <div class="section">
        <h2>ALAT YANG TERSEDIA</h2>
        <div class="feature-container">
            <div @click="goToValidasiPersil" class="feature-box available">
                <p class="context">Validasi<br /> Persil</p>
                <p class="total">GO</p>
            </div>
            <div @click="goToUploadBukuTanah" class="feature-box available">
                <p class="context">Upload <br /> BT</p>
                <p class="total">GO</p>
            </div>
            <div @click="goToUploadSuratUkur" class="feature-box available">
                <p class="context">Upload<br /> SU</p>
                <p class="total">GO</p>
            </div>
            <div @click="goToUpdatePersil" class="feature-box available">
                <p class="context">Update<br /> Persil</p>
                <p class="total">GO</p>
            </div>
            <div class="feature-box unavailable">
                <p class="context">Validasi<br /> BT</p>
                <p class="total">GO</p>
            </div>
            <div class="feature-box unavailable">
                <p class="context">Validasi<br /> SU</p>
                <p class="total">GO</p>
            </div>
            <div @click="goToPenangguhanPersil" class="feature-box available">
                <p class="context">Tangguh<br /> Persil</p>
                <p class="total">GO</p>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.bg-green {
    background: #1FC374 !important;
}

.bg-orange {
    background: #FF9D56 !important;
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
    },
    computed: {
        ...mapWritableState(useAppStore, ['showSawer'])
    },
    mounted() {
        document.title = "SIDARTA";
        this.showSawer = true;
        const pageView = inject('page_view') as Function;
        pageView();
    },
})
</script>
