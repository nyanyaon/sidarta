<template>
    <Modal v-if="!isBrowserExist" btn="Unduh" content="Maaf, edge tidak ditemukan silahkan mengunduh terlebih dahulu" :handler="unduh" />
    <Loader />
    <Home />
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
import Home from './index/Home.vue';
import Loader from './index/Loader.vue';
import Modal from './index/Modal.vue';

export default {
    name: "App",
    components: {
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
        unduh() {
            window.COMM.appOpenExternal('https://www.microsoft.com/en-us/edge?form=MA13FJ');
        },
        updateLoaderDialogue(event: Electron.IpcRenderer, ...data: any[]) {
            this.store.loadDialog = data[0][0];
        }
    },
    computed: {
    },
    mounted() {
        // window.COMM.authSuccess(this.toggleAuth);
        // window.COMM.appWaitDataOpt(this.setDataOpt);
        window.COMM.appUpdateDialog(this.updateLoaderDialogue);

        // this.isBrowserExist = window.COMM.appCheckBrowser();
        // this.store.isLogin = JSON.parse(window.localStorage.getItem('IS_LOGIN'));

        // if (!this.store.isLogin) window.COMM.authStart(true);

        // if(window.localStorage.getItem('UPLOAD_OPTION') === null && this.store.isLogin) {
        //     this.store.isLoading = true;
        //     window.COMM.botGetOption();
        // }
    }
};
</script>