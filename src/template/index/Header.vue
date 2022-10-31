<template>
    <div class="header">
        <div class="brand" @click="goToHome">
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
</template>

<style lang="css" scoped>
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
import { store } from '../../Store';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "Header",
    data() {
        return {
            store
        }
    },
    computed: {
        getUserNama() {
            const nama: string = this.store.user;
            return nama.replace(",", ",<br />");
        }
    },
    methods: {
        goToHome() {
            this.$router.push('/');
        }
    }
})
</script>
