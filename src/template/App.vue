<script>
import Login from './login/Login.vue'

export default {
    name: "App",
    components: {
        Login
    }
};
</script>
<template>
    <!-- <div id="main-entry" class="wrapper" style="display: none;">
        <div class="header">
            <img class="logo" alt="logo sidarta">
            <h1>SIDARTA</h1>
            <p>Sistem Digitalisasi Arsip Pertanahan</p>
        </div>
    </div> -->
    <Login :username="'199003062014021002'" :password="'@1234rio'"/>
</template>
