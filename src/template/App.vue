<template>
    <Modal v-if="!isBrowserExist" btn="Unduh" content="Maaf, edge tidak ditemukan silahkan mengunduh terlebih dahulu"
        :handler="unduh" />
    <Sawer v-if="showSawer" />
    <Update v-if="update.isUpdate" :msg="update.updateMsg" />
    <Loader />
    <DisclaimerModal v-if="showDisclaimer" />
    <LoginModal v-if="showLogin" />
    <Header />
    <router-view />
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
import Loader from './index/Loader.vue';
import Modal from './index/Modal.vue';
import Footer from './index/Footer.vue';
import Sawer from './index/Sawer.vue';
import Update from './index/Update.vue';
import Header from './index/Header.vue';
import LoginModal from './index/LoginModal.vue';
import DisclaimerModal from './index/DisclaimerModal.vue';
import { useAppStore } from './store/app';
import { mapWritableState } from 'pinia'
import { provide } from 'vue';

export default {
    name: "App",
    components: {
        Loader,
        Modal,
        Footer,
        Sawer,
        Update,
        Header,
        LoginModal,
        DisclaimerModal,
    },
    setup() {
        provide('page_view', () => {
            fetch("https://www.google-analytics.com/mp/collect?measurement_id=G-MYPD4WZ4PJ&api_secret=ZFBVYNP8TEWtQKJKL7v7hg", {
                method: "POST",
                body: JSON.stringify({
                    "client_id": "sidarta." + localStorage.getItem('CLIENTID'),
                    "user_id": localStorage.getItem('USERID'),
                    "user_properties": {
                        "Country": localStorage.getItem('COUNTRY'),
                        "City": localStorage.getItem('CITY')
                    },
                    "events": [
                        {
                            "name": "page_view",
                            "params": {
                                "page_title": document.title,
                                "page_location": document.location.pathname,
                                "session_id": "das_" + localStorage.getItem('SESSIONID'),
                                "engagement_time_msec": "100"
                            }
                        }
                    ]
                })
            }).then(val => {
                console.log("okay");
            });
        })
    },
    data() {
        return {
            isBrowserExist: true,
            isDenied: false,
            update: {
                isUpdate: false,
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
            if ((data[0].msg as string).includes('updated')) setTimeout(() => this.removeToastUpdate(), 3000)
        },
        removeToastUpdate() {
            this.update.isUpdate = false;
        }
    },
    computed: {
        ...mapWritableState(useAppStore, ['showLogin', 'showSawer', 'showDisclaimer']),
    },
    mounted: function () {
        // const hasVisit = localStorage.getItem('USER_AGREE');
        // if(hasVisit === null) {
        //     this.showDisclaimer = true;
        // }
        // window.COMM.authSuccess(this.toggleAuth);
        // window.COMM.appWaitDataOpt(this.setDataOpt);
        const FIRST_OPEN = localStorage.getItem('FIRST_OPEN');
        if (FIRST_OPEN === null) {
            this.showDisclaimer = true;
        }
        window.COMM.appUpdateDialog(this.updateLoaderDialogue);
        window.COMM.appUpdateHandler(this.changeToastUpdate);

        const clientId = localStorage.getItem('CLIENTID');
        const sessionId = localStorage.getItem('SESSIONID');

        if (crypto && clientId === null && sessionId === null) {
            console.log('Crypto available');
            const array = new Uint32Array(3);
            crypto.getRandomValues(array);

            const clientId = `${array[0]}.${array[1]}`;
            const sessionId = `${array[2]}`;

            localStorage.setItem('CLIENTID', clientId);
            localStorage.setItem('SESSIONID', sessionId);
        }

        if ("geolocation" in navigator) {
            console.log('Location services available');
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position)
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                console.log(location);
                fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=AIzaSyAuwWs0PK3xt9qr6KXuyjMuVZeo959dONE&result_type=administrative_area_level_1`).then((res) => res.json()).then(json => {
                    const city = json.results[0].address_components[0].long_name;
                    const country = json.results[0].address_components[1].long_name;

                    localStorage.setItem('COUNTRY', country);
                    localStorage.setItem('CITY', city);

                    console.log(`City ${city}, country ${country}`);
                });
            }, function (err) {
                console.log(err);
            }, {
                enableHighAccuracy: true
            });
        }

        this.isBrowserExist = window.COMM.appCheckBrowser();

        fetch("https://www.google-analytics.com/mp/collect?measurement_id=G-MYPD4WZ4PJ&api_secret=ZFBVYNP8TEWtQKJKL7v7hg", {
            method: "POST",
            body: JSON.stringify({
                "client_id": "sidarta." + localStorage.getItem('CLIENTID'),
                "user_id": localStorage.getItem('USERID'),
                "user_properties": {
                    "Country": localStorage.getItem('COUNTRY'),
                    "City": localStorage.getItem('CITY')
                },
                "events": [
                    {
                        "name": "open_app",
                        "params": {
                            "page_title": document.title,
                            "session_id": "das_" + localStorage.getItem('SESSIONID'),
                            "engagement_time_msec": "100",
                            "user_country": localStorage.getItem('COUNTRY')
                        }
                    }
                ]
            })
        }).then(val => {
            console.log("Session Start");
        });
        // this.store.isLogin = JSON.parse(window.localStorage.getItem('IS_LOGIN'));

        // if (!this.store.isLogin) window.COMM.authStart(true);

        // if(window.localStorage.getItem('UPLOAD_OPTION') === null && this.store.isLogin) {
        //     this.store.isLoading = true;
        //     window.COMM.botGetOption();
        // }
    }
};
</script>