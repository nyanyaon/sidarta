<template>
    <Header />
    <div class="section">
        <h2>FITUR KAMI</h2>
        <div class="feature-container">
            <div @click="goToBukuTanah" class="feature-box available">
                <p>BUKU TANAH</p>
            </div>
            <div @click="goToSuratUkur" class="feature-box available">
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
                <span>TOTAL</span>
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
            this.$router.replace('/bukutanah')
        },
        goToSuratUkur() {
            this.$router.replace('/suratukur')
        },
    },
    async mounted() {
        this.countBukuTanah = (await window.COMM.databaseGetAll('bukutanah')).length;
        this.countSuratUkur = (await window.COMM.databaseGetAll('suratukur')).length;
    }
})
</script>
