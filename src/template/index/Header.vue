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
                <p><span v-html="getUsername"></span></p>
            </div>
            <div class="box">
                <Fa icon="fa-solid fa-power-off" class="icon" @click="logout" />
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
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
    padding: 0.3em;
    background: #00B2FF;
    color: #fcfbfb;
    border-radius: 0.2em;
    font-size: 1.2rem;
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
            store,
        }
    },
    computed: {
        getUsername() {
            const nama = this.store.user;
            if(nama === "none") {
                return "Tidak Login";
            }

            return nama.replace(",", ",<br />");
        }
    },
    methods: {
        goToHome() {
            this.$router.push('/');
        },
        logout() {
            window.COMM.authLogout();
            window.localStorage.removeItem('IS_LOGIN');
            window.localStorage.removeItem('USER_DATE');
            window.localStorage.removeItem('USER_NAME');
            window.localStorage.removeItem('USER_KANTOR');
            window.localStorage.removeItem('UPLOAD_OPTION');
            window.location.reload();
        }
    },
    mounted() {
        // this.store.user = window.localStorage.getItem('USER_NAME');
    }
})
</script>
