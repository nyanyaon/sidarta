<template>
    <Modal v-if="!isBrowserExist" btn="Unduh" content="Maaf, edge tidak ditemukan silahkan mengunduh terlebih dahulu" :handler="unduh" />
    <Sawer v-if="isSawer"/>
    <Update v-if="update.isUpdate" :msg="update.updateMsg"/>
    <Loader />
    <Home />
    <Footer />
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
    background: #FFFFFF;
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
import Home from './index/Home.vue';
import Loader from './index/Loader.vue';
import Modal from './index/Modal.vue';
import Footer from './index/Footer.vue';
import Sawer from './index/Sawer.vue';
import Update from './index/Update.vue';

export default {
    name: "App",
    components: {
        Home,
        Loader,
        Modal,
        Footer,
        Sawer,
        Update,
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
            isSawer: false,
            update: {
                isUpdate: true,
                updateMsg: "Update...", 
            },
        }
    },
    methods: {
        unduh() {
            window.COMM.appOpenExternal('https://www.microsoft.com/en-us/edge?form=MA13FJ');
        },
        updateLoaderDialogue(event: Electron.IpcRenderer, ...data: any[]) {
            this.store.loadDialog = data[0][0];
        },
        changeToastUpdate(ev: Electron.IpcRendererEvent, data: any[]) {
            this.update.isUpdate = data[0].isUpdate;
            this.update.updateMsg = data[0].msg;
            if((data[0].msg as string).includes('updated')) setTimeout(() => this.removeToastUpdate(), 3000)
        },
        removeToastUpdate() {
            this.update.isUpdate = false
        }
    },
    computed: {
    },
    mounted() {
        // window.COMM.authSuccess(this.toggleAuth);
        // window.COMM.appWaitDataOpt(this.setDataOpt);
        window.COMM.appUpdateDialog(this.updateLoaderDialogue);
        window.COMM.appUpdateHandler(this.changeToastUpdate);

        this.isBrowserExist = window.COMM.appCheckBrowser();
        // this.store.isLogin = JSON.parse(window.localStorage.getItem('IS_LOGIN'));

        // if (!this.store.isLogin) window.COMM.authStart(true);

        // if(window.localStorage.getItem('UPLOAD_OPTION') === null && this.store.isLogin) {
        //     this.store.isLoading = true;
        //     window.COMM.botGetOption();
        // }
    }
};
</script>