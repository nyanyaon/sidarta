<template>
    <div class="login-modal-bg">
        <div class="content">
            <h2>Login dulu ya...</h2>
            <div class="login-form">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input v-model="username" type="text" name="username" id="username">
                </div>
                <div class="input-group">
                    <label for="pass">Password</label>
                    <input v-model="password" type="password" name="pass" id="pass">
                </div>
                <div class="input-group">
                    <button @click="save" class="primary">Save</button>
                    <button v-if="isAgree !== null" @click="close" class="secondary">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.login-modal-bg {
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
    background: #ffffff;
    font-weight: 700;
    color: #393939;
    border: 1px solid #00B2FF;
    border-radius: 1em;
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 1em;
}

.login-modal-bg h2 {
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

.input-group {
    font-size: .825em;
    display: flex;
    flex-direction: column;
}

.input-group label {
    margin-bottom: .3em;
}

.input-group input {
    border: 1px solid #00B2FF;
    padding: 0.2em 0.8em;
    ;
    border-radius: 0.3em;
    margin-bottom: .5em;
}

.input-group .primary {
    background: #00B2FF;
    color: #fcfbfb;
}

.input-group .secondary {
    background: #ffffff;
    color: #000;
}

.input-group button {
    border: 1px;
    border-radius: 0.4em;
    font-size: 1em;
    padding: 0.2em 0.8em;
    border: 1px solid #00B2FF;
    margin-bottom: 0.5em;
}

.input-group button:hover {
    cursor: pointer;
}
</style>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '../store/app'

const appStore = useAppStore()
const username = ref('')
const password = ref('')
const isAgree = localStorage.getItem('USER_AGREE')

function save() {
    window.localStorage.setItem('USER', username.value)
    window.localStorage.setItem('PASS', password.value)
    appStore.showLogin = false
    appStore.showDisclaimer = true
}

function close() {
    appStore.showLogin = false
}

onMounted(() => {
    const user = window.localStorage.getItem('USER')
    const pass = window.localStorage.getItem('PASS')
    username.value = user !== null ? user : ''
    password.value = pass !== null ? pass : ''
})
</script>