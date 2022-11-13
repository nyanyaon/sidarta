<template>
  <div class="wrapper">
    <div class="header">
      <img src="../img/logo.png" class="logo" alt="logo sidarta">
      <h1>SIDARTA</h1>
      <p>Sistem Digitalisasi Arsip Pertanahan</p>
    </div>
    <div v-if="txtEmailTo === ''" class="login">
      <p v-if="error !== ''" class="info-error">{{ error }}</p>
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
</template>

<style scoped>
.header {
  margin-top: 2em;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 2em;
}

.header h1 {
  margin: 0;
  color: #FF9D56;
  font-size: 2.4em;
}

.header p {
  margin: 0;
  font-size: 0.75em;
  font-weight: 700;
  color: #7B7B7B;
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
  margin-bottom: 0.5em;
  font-weight: 700;
  font-size: 0.75em;
  color: #393939;
}

.login input {
  margin-bottom: 0.5rem;
  font-size: 0.75em;
  padding: 0.5em;
  border: 1px solid #FF9D56;
  background: none;
  border-radius: 0.8em;
  font-weight: 500;
}

button {
  font-size: 0.75em;
  font-weight: 600;
  color: #fff;
  background: #FF9D56;
  border: none;
  padding: 0.75em 0.5em;
  margin-top: 3em;
  border-radius: 0.8em;
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
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { store } from '../../Store';

export default defineComponent({
  name: "Login",
  data() {
    return {
      user: this.username as string,
      pass: this.password as string,
      token: "",
      txtEmailTo: "",
      error: "",
      store,
    }
  },
  props: {
    username: { type: String, required: false },
    password: { type: String, required: false },
  },
  methods: {
    saveUserToLocal() {
      window.localStorage.setItem('AUTH_USER', this.user);
    },
    savePassToLocal() {
      window.localStorage.setItem('AUTH_PASS', this.pass);;
    },
    async save(evt: Event) {
      this.store.isLoading = true;
      this.store.isLoading = await window.COMM.authSave(this.user, this.pass);
    },
    start() {
      window.COMM.authStart(false);
    },
    async verify() {
      this.store.isLoading = true;
      await window.COMM.authVerify(this.token);
    },
    renderTokenForm(event: Electron.IpcRendererEvent, ...data: any[]) {
      this.txtEmailTo = data[0][0].to;
    },
    authError(event: Electron.IpcRendererEvent, ...data: any[]) {
      this.error = "Username atau Password salah!"
    },
  },
  mounted() {
    this.user = window.localStorage.getItem('AUTH_USER');
    this.pass = window.localStorage.getItem('AUTH_PASS');

    window.COMM.authToken(this.renderTokenForm);
    window.COMM.authError(this.authError);
  }
})
</script>
