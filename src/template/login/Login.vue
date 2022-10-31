<template>
  <div class="wrapper">
    <div class="header">
      <img src="../img/logo.png" class="logo" alt="logo sidarta">
      <h1>SIDARTA</h1>
      <p>Sistem Digitalisasi Arsip Pertanahan</p>
    </div>
    <div v-if="txtEmailTo === ''" class="login">
      <p class="info-error">Terjadi Kesalahan</p>
      <label for="username">Username</label>
      <input type="text" v-model="user" @change="saveUserToLocal">
      <label for="pass">Password</label>
      <input type="password" v-model="pass" @change="savePassToLocal">
      <button @click="save">Simpan</button>
    </div>
    <div v-else class="login">
      <p class="info-token">Telah dikirimkan kepada {{ txtEmailTo }}</p>
      <label for="token">OTP</label>
      <input type="text" name="token" v-model="token">
      <button @click="verify">Lanjut</button>
    </div>
  </div>
  <button @click="start">Mulai</button>
</template>

<style scoped>
.header {
  margin-top: 2em;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.header h1 {
  margin: 0;
  color: #FF9D56;
  font-size: 3em;
}

.header p {
  margin: 0;
}

.logo {
  height: 80px;
  width: auto;
  text-align: center;
}

.login {
  display: flex;
  width: 50vw;
  flex-direction: column;
  margin-top: 2em;
  margin-left: auto;
  margin-right: auto;
}

.login label {
  margin-bottom: 0.2rem;
}

.login input {
  margin-bottom: 0.2rem;
  font-size: 1em;
  padding: 0.4rem;
  border-radius: 0.5em;
}

button {
  font-size: 1em;
  font-weight: 600;
  color: #fff;
  background: #FF9D56;
  border: none;
  padding: 0.5em;
  margin-top: 1em;
  border-radius: 0.5em;
}

button:hover {
  background: #D67026;
}

.info-token {
  background: #aaffb5;
  margin: 0.5em 0;
  padding: 1em;
  font-size: 0.8em;
}

.info-error {
  background: #ffaaaa;
  margin: 0.5em 0;
  padding: 1em;
  font-size: 0.8em;
  display: none;
}

#otp {
  display: none;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "Login",
  data() {
    return {
      user: this.username as string,
      pass: this.password as string,
      token: "",
      txtEmailTo: "",
    }
  },
  props: {
    username: { type: String, required: false },
    password: { type: String, required: false },
  },
  methods: {
    saveUserToLocal(): Event {
      window.localStorage.setItem('AUTH_USER', this.user);
      return new Event('change');
    },
    savePassToLocal(): Event {
      window.localStorage.setItem('AUTH_PASS', this.pass);;
      return new Event('change');
    },
    save(evt: Event) {
      console.log(this.user, this.pass);
      window.COMM.authSave(this.user, this.pass);
    },
    start(): MouseEvent {
      console.log('start');
      window.COMM.authStart(false);
      return new MouseEvent('click');
    },
    verify() {
      window.COMM.authVerify(this.token);
    },
    renderTokenForm(event: Electron.IpcRendererEvent, ...data: any[]) {
      this.txtEmailTo = data[0][0].to;
    }
  },
  mounted() {
    this.user = window.localStorage.getItem('AUTH_USER');
    this.pass = window.localStorage.getItem('AUTH_PASS');

    window.COMM.authToken(this.renderTokenForm);
  }
})
</script>
