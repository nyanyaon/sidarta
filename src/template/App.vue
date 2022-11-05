<template>
    <Home v-if="store.isLogin" />
    <Login v-else />
    <p>{{ getClock }}</p>
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
import { store } from '../Store';
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
            store,
            timeMs: 0,
            timeSe: 0,
            timeMi: 0,
            timeHo: 0,
            clockInterval: '',
        }
    },
    methods: {
        toggleAuth(event: Electron.IpcRenderer, ...data: any) {
            window.localStorage.setItem('IS_LOGIN', JSON.stringify(this.store.isLogin = true));
            window.localStorage.setItem('USER_NAME', data[0][0]);
            window.localStorage.setItem('USER_DATE', JSON.stringify(new Date()));
        },
    },
    computed: {
        getClock() {
            if (this.store.isLogin) {
                this.clockInterval = setInterval(() => {
                    let logTime: string = JSON.parse(window.localStorage.getItem('USER_DATE'));
                    let timeInDate = new Date(logTime);
                    let now = Date.now();
                    this.timeMs = now - timeInDate.getTime();
                    this.timeHo = this.timeMs / (1000 * 60 * 60);
                    this.timeMi = (this.timeHo - Math.floor(this.timeHo)) * 60;
                    this.timeSe = (this.timeMi - Math.floor(this.timeMi)) * 60;
                    this.store.loggedTime = Math.floor(this.timeHo);
                }, 1000);
            }

            return Math.floor(this.timeHo) + ":" + Math.floor(this.timeMi) + ":" + Math.floor(this.timeSe);
        }
    },
    mounted() {
        window.COMM.authSuccess(this.toggleAuth);

        this.store.isLogin = JSON.parse(window.localStorage.getItem('IS_LOGIN'));

        if (!this.store.isLogin) window.COMM.authStart(true);
    },
    beforeUnmount() {
        clearInterval(this.clockInterval);
    },
    watch: {

    },
    updated() {
        if (8 - this.store.loggedTime <= 0) {
            window.localStorage.removeItem('IS_LOGIN');
            window.localStorage.removeItem('USER_DATE');
            window.localStorage.removeItem('USER_NAME');
        }
    },
};
</script>