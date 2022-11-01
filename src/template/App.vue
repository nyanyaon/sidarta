<template>
  <Home v-if="store.isLogin" />
  <Login v-else/>
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
    }
  },
  methods: {
    toggleAuth(event: Electron.IpcRenderer, ...data: any) {
      window.localStorage.setItem('IS_LOGIN', JSON.stringify(this.store.isLogin = true));
      window.localStorage.setItem('USER_NAME', data[0][0]);
    }
  },
  mounted() {
    window.COMM.authSuccess(this.toggleAuth);

    this.store.isLogin = JSON.parse(window.localStorage.getItem('IS_LOGIN'));

    if(!this.store.isLogin) window.COMM.authStart(true);
  }
};
</script>