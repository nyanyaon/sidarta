<template>
    <Modal v-if="!isBrowserExist" btn="Unduh" content="Maaf, edge tidak ditemukan silahkan mengunduh terlebih dahulu" :handler="unduh"/>
    <Loader v-if="isLoading" />
    <Home v-if="store.isLogin" />
    <Login v-else />
    <p style="text-align: center;">{{ getClock }}</p>
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
    background: #fcfbfb;
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
import Loader from './index/Loader.vue';
import Modal from './index/Modal.vue';

export default {
    name: "App",
    components: {
        Login,
        Home,
        Loader,
        Modal,
    },
    data() {
        return {
            store,
            timeMs: 0,
            timeSe: 0,
            timeMi: 0,
            timeHo: 0,
            clockInterval: {},
            isLoading: false,
            isBrowserExist: true,
        }
    },
    methods: {
        toggleAuth(event: Electron.IpcRenderer, ...data: any) {
            window.localStorage.setItem('IS_LOGIN', JSON.stringify(true));
            window.localStorage.setItem('USER_NAME', data[0][0]);
            window.localStorage.setItem('USER_DATE', JSON.stringify(new Date()));
            this.store.isLogin = true;
        },
        setDataOpt(event: Electron.IpcRenderer, ...data: any[]) {
            window.localStorage.setItem('UPLOAD_OPTION', JSON.stringify(data[0][0]));
            this.isLoading = false;
        },
        unduh() {
            window.COMM.appOpenExternal('https://www.microsoft.com/en-us/edge?form=MA13FJ');
        }
    },
    computed: {
        getClock() {
            if (this.store.isLogin) {
                this.clockInterval = window.setInterval(() => {
                    const timeInDate = new Date(JSON.parse(window.localStorage.getItem('USER_DATE')));
                    this.timeMs = Date.now() - timeInDate.getTime();
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
        window.COMM.appWaitDataOpt(this.setDataOpt);

        this.isBrowserExist = window.COMM.appCheckBrowser();
        this.store.isLogin = JSON.parse(window.localStorage.getItem('IS_LOGIN'));

        if (!this.store.isLogin) window.COMM.authStart(true);

        if(window.localStorage.getItem('UPLOAD_OPTION') === null && this.store.isLogin) {
            this.isLoading = true;
            window.COMM.botGetOption();
        }
    },
    updated() {
        if (8 - this.store.loggedTime <= 0) {
            window.localStorage.removeItem('IS_LOGIN');
            window.localStorage.removeItem('USER_DATE');
            window.localStorage.removeItem('USER_NAME');
            window.localStorage.removeItem('UPLOAD_OPTION');
            window.clearInterval(this.clockInterval);
            this.timeMs = 0;
            this.store.isLogin = false;
        }
    }
};
</script>