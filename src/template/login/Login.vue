<template>
    <div class="wrapper">
        <div class="header">
            <img src="../img/logo.png" class="logo" alt="logo sidarta">
            <h1>SIDARTA</h1>
            <p>Sistem Digitalisasi Arsip Pertanahan</p>
        </div>
        <div id="login" class="login">
            <p id="info" class="info-error">Terjadi Kesalahan</p>
            <label for="username">Username</label>
            <input type="text" v-model="user">
            <label for="pass">Password</label>
            <input type="password" v-model="pass">
            <button @click="save">Simpan</button>
        </div>
        <button @click="start">Mulai</button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "Login",
    data() {
        return {
            user: this.username as string,
            pass: this.password as string,
        }
    },
    props: {
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    methods: {
        save(evt: Event): MouseEvent {
            console.log(this.user, this.pass);
            window.COMM.authSave(this.user, this.pass);
            return new MouseEvent('click');
        },
        start(): MouseEvent {
            console.log('start');
            window.COMM.authStart(false);
            return new MouseEvent('click');
        }
    }
})
</script>
