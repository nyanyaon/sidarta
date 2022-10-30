<template>
    <!-- <div id="main-entry" class="wrapper" style="display: none;">
        <div class="header">
            <img class="logo" alt="logo sidarta">
            <h1>SIDARTA</h1>
            <p>Sistem Digitalisasi Arsip Pertanahan</p>
        </div>
    </div> -->
    <!-- <Login v-if="isLogin" /> -->
    <Home :nama="name"/>
</template>

<style>
@font-face {
  font-family: 'Montserrat';
  src: url('./assets/Montserrat-ExtraBold.ttf') format('truetype');
  font-style: normal;
  font-weight: 800;
}

@font-face {
  font-family: 'Montserrat';
  src: url('./assets/Montserrat-Bold.ttf') format('truetype');
  font-style: normal;
  font-weight: 700;
}

@font-face {
  font-family: 'Montserrat';
  src: url('./assets/Montserrat-Medium.ttf') format('truetype');
  font-style: normal;
  font-weight: 500;
}

@font-face {
  font-family: 'Montserrat';
  src: url('./assets/Montserrat-Regular.ttf') format('truetype');
  font-style: normal;
  font-weight: 400;
}

body {
    background: #F3F3F3;
    font-family: 'Montserrat';
    margin: 0;
    padding: 0;
}

.wrapper {
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import Login from './login/Login.vue';
import Home from './index/Home.vue';

export default {
    name: "App",
    components: {
        Login,
        Home,
    },
    data() {
        return {
            isLogin: true,
            name: "",
        }
    },
    methods: {
        toggleAuth(event: Electron.IpcRenderer, data: any) {
            this.isLogin = !this.isLogin;
            this.name = data[0];
        }
    },
    mounted() {
        window.COMM.authSuccess(this.toggleAuth);

        window.COMM.authStart(true);
    }
};
</script>