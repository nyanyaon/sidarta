<template>
    <div class="header">
        <div class="brand" @click="goToHome">
            <div class="brand-info">
                <h1>SIDARTA</h1>
                <p>Menuju Kota/Kab Lengkap</p>
            </div>
        </div>

        <div class="user">
            <div class="info">
                <p>{{ getUsername }}</p>
            </div>
            <div class="box">
                <Fa icon="fa-solid fa-gear" class="icon" @click="openSetting" />
            </div>
        </div>
    </div>
    <div v-if="showSetting" class="modal-setting">
        <div class="content">
            <h2>Setting</h2>
            <button @click="doLogin" class="setting-btn">Login</button>
            <button @click="doUpdate" class="setting-btn">Update</button>
            <button @click="closeSetting" class="setting-btn">Close</button>
        </div>
    </div>
</template>

<style lang="css" scoped>
.modal-setting {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    font-weight: 700;
    color: #393939;
    border: 1px solid #00B2FF;
    border-radius: 1em;
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 1em;
}

.modal-setting h2 {
    color: #000;
    text-align: center;
    font-size: 1em;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    font-variant: all-small-caps;
    letter-spacing: 0.81px;
    margin-top: 1em;
    margin-left: 1em;
    margin-right: 1em;
}

.setting-btn {
    background: #00B2FF;
    border: 1px;
    border-radius: 0.4em;
    font-size: 1em;
    color: #fcfbfb;
    padding: 0.2em 0.8em;
    margin-bottom: 0.5em;
}

.setting-btn:hover {
    cursor: pointer;
}

.header {
    display: flex;
    margin-top: 0.5em;
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
    color: #00B2FF;
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
    color: #000000;
    background: #fcfbfb;
    border-radius: 0.2em;
    font-size: 1.2rem;
    text-align: center;
}

.user .icon:hover {
    color: #00B2FF;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAppStore } from '../store/app';
import { mapWritableState } from 'pinia';

export default defineComponent({
    name: "Header",
    data() {
        return {
            showSetting: false,
        }
    },
    computed: {
        getUsername() {
            const nama = window.localStorage.getItem("USER");
            if (nama === "none") {
                return "Tidak Login";
            }

            return nama;
        },
        ...mapWritableState(useAppStore, ['showLogin']),
    },
    methods: {
        goToHome() {
            this.$router.push('/');
        },
        openSetting() {
            this.showSetting = true;
        },
        closeSetting() {
            this.showSetting = false;
        },
        doUpdate() {
            console.log("update...");
            window.COMM.appUpdate();
        },
        doLogin() {
            this.showLogin = true;
            this.showSetting = false;
        }
    }
})
</script>
../../app