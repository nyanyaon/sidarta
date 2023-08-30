<script lang="ts">
import { defineComponent } from 'vue';
import { mapWritableState } from 'pinia';
import { useAppStore } from '../store/app';

export default defineComponent({
    name: "Sawer",
    data() {
        return {
            title: "Donasi Seikhlasnya akan sangat membantu kami!!",
        }
    },
    computed: {
        ...mapWritableState(useAppStore, ['showSawer'])
    },
    methods: {
        close() {
            window.COMM.appOpenExternal('https://www.highcpmrevenuegate.com/qfmnuap5z?key=4c47fd32a3fe0a592119563c8f704443')
            this.showSawer = false
        }
    },
})
</script>

<template>
    <div class="modal">
        <div class="content">
            <h2>{{ title }}</h2>
            <img src="../img/barcode.png" alt="qrcode" />
            <div class="act">
                <button @click="close">
                    <Fa icon="fa-solid fa-xmark" class="icon" />
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal {
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
    max-width: 40vw;
    max-height: 60vh;
    align-items: center;
    border-radius: 1em;
}

h2 {
    color: #000000;
    text-align: center;
    font-size: .875em;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    font-variant: all-small-caps;
    letter-spacing: 0.81px;
    margin-top: 1em;
    margin-left: 1em;
    margin-right: 1em;
}

img {
    width: 30vw;
    height: auto;
}

button {
    font-weight: 700;
    color: #fff;
    background: #00B2FF;
    border: none;
    border-radius: 100%;
    padding: 4px 6px 4px 6px;
    margin-top: 0.5em;
    margin-bottom: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
}

button:hover {
    background: #d62626;
}
</style>