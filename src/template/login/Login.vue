<template>
  <div class="wrapper">
    <div class="header">
      <h1>SIAP VALID</h1>
      <p>Validasi Persil Bidang</p>
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
      <p v-if="!isOTPHide" class="info-token">Telah dikirimkan kepada {{ txtEmailTo }}</p>
      <label v-if="!isOTPHide" for="token">OTP</label>
      <input v-if="!isOTPHide" type="text" name="token" v-model="token">
      <label for="kantor">Kantor</label>
      <select name="kantor" v-model="selectedKantor">
        <option v-for="item in kantor" v-bind:value="{ id: item.kantorid }">{{ item.kantorname }}</option>
      </select>
      <button @click="verify">Lanjut</button>
    </div>
  </div>
</template>

<style scoped>
.header {
  margin-top: 6em;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 2em;
}

.header h1 {
  margin: 0;
  color: #00B2FF;
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
  border: 1px solid #00B2FF;
  background: none;
  border-radius: 0.8em;
  font-weight: 500;
}

.login select {
  margin-bottom: 0.5rem;
  font-size: 0.75em;
  padding: 0.5em;
  border: 1px solid #00B2FF;
  background: none;
  border-radius: 0.8em;
  font-weight: 500;
}

button {
  font-size: 0.75em;
  font-weight: 600;
  color: #fff;
  background: #00B2FF;
  border: none;
  padding: 0.75em 0.5em;
  margin-top: 3em;
  border-radius: 0.8em;
}

button:hover {
  background: #1193ca;
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
      isOTPHide: false,
      kantor: [],
      selectedKantor: {},
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
      window.localStorage.setItem('AUTH_PASS', this.pass);
    },
    saveKantorToLocal() {
      window.localStorage.setItem('USER_KANTOR', JSON.stringify(this.selectedKantor))
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
      console.log(this.token);
      await window.COMM.authVerify(this.token, this.selectedKantor.id);
      this.saveKantorToLocal();
    },
    renderTokenForm(event: Electron.IpcRendererEvent, ...data: any[]) {
      this.txtEmailTo = data[0][0].to;
      this.kantor = data[0][0].kantor;
    },
    authError(event: Electron.IpcRendererEvent, ...data: any[]) {
      this.error = "Username atau Password salah!"
    },
    hide(event: Electron.IpcRendererEvent, ...data:any[]) {
      this.isOTPHide = data[0][0];
    }
  },
  mounted() {
    this.user = window.localStorage.getItem('AUTH_USER');
    this.pass = window.localStorage.getItem('AUTH_PASS');

    window.COMM.authToken(this.renderTokenForm);
    window.COMM.authError(this.authError);
    window.COMM.authHideOTP(this.hide);
  }
})
</script>
