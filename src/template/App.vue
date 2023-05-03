<template>
    <Modal v-if="!isBrowserExist" btn="Unduh" content="Maaf, edge tidak ditemukan silahkan mengunduh terlebih dahulu" :handler="unduh" />
    <Modal v-if="isDenied" btn="Keluar" content="Akun yang anda gunakan tidak memenuhi syarat aplikasi, mohon masuk menggunakan akun yang lain" :handler="logout" />
    <Loader />
    <Home v-if="store.isLogin" />
    <Login v-else />
    <p style="text-align: center;">{{ getClock }}</p>
    <div class="section">
        <a href="http://" class="donate-btn">DONASI!</a>
    </div>
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

.donate-btn {
  font-size: 0.75em;
  font-weight: 600;
  color: #fff;
  background: #FF9D56;
  border: none;
  padding: 0.8em 0.8em;
  margin-top: 3em;
  border-radius: 0 0.8em 0.8em 0;
  position: absolute;
  bottom: 5%;
  text-decoration: none;
}

.donate-btn:hover {
  background: #D67026;
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
            isBrowserExist: true,
            isDenied: false,
        }
    },
    methods: {
        toggleAuth(event: Electron.IpcRenderer, ...data: any) {
            window.localStorage.setItem('IS_LOGIN', JSON.stringify(true));
            window.localStorage.setItem('USER_NAME', data[0][0]);
            window.localStorage.setItem('USER_DATE', JSON.stringify(new Date()));
            this.store.isLoading = false;
            window.location.reload();
        },
        setDataOpt(event: Electron.IpcRenderer, ...data: any[]) {
            const dataOpt = JSON.stringify(data[0][0]);
            if(dataOpt === undefined) {
                this.isDenied = true;
                this.store.isLoading = true;
                return;
            }

            window.localStorage.setItem('UPLOAD_OPTION', dataOpt);
            
            this.store.isLoading = false;
        },
        unduh() {
            window.COMM.appOpenExternal('https://www.microsoft.com/en-us/edge?form=MA13FJ');
        },
        logout() {
            window.COMM.authLogout();
            window.localStorage.removeItem('IS_LOGIN');
            window.localStorage.removeItem('USER_DATE');
            window.localStorage.removeItem('USER_NAME');
            window.localStorage.removeItem('UPLOAD_OPTION');
            window.location.reload();
        },
        updateLoaderDialogue(event: Electron.IpcRenderer, ...data: any[]) {
            this.store.loadDialog = data[0][0];
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
        // window.COMM.appWaitDataOpt(this.setDataOpt);
        window.COMM.appUpdateDialog(this.updateLoaderDialogue);

        this.isBrowserExist = window.COMM.appCheckBrowser();
        this.store.isLogin = JSON.parse(window.localStorage.getItem('IS_LOGIN'));

        if (!this.store.isLogin) window.COMM.authStart(true);

        // if(window.localStorage.getItem('UPLOAD_OPTION') === null && this.store.isLogin) {
        //     this.store.isLoading = true;
        //     window.COMM.botGetOption();
        // }
    },
    updated() {
        if (8 - this.store.loggedTime <= 0 && this.store.isLogin) {
            window.localStorage.removeItem('IS_LOGIN');
            window.localStorage.removeItem('USER_DATE');
            window.localStorage.removeItem('USER_NAME');
            window.localStorage.removeItem('UPLOAD_OPTION');
            window.clearInterval(this.clockInterval);
            this.timeMs = 0;
            this.store.isLogin = false;
            window.location.reload();
        }
    }
};
</script>