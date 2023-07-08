<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "Sawer",
    data() {
        return {
            title: "Donasi Seikhlasnya akan sangat membantu kami!!",
        }
    },
    methods: {
        close() {
            const modal = document.querySelector(".modal");
            modal.remove();
        }
    },
})
</script>

<template>
    <div class="modal">
        <div class="content">
            <p>{{ title }}</p>
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
    max-width: 232px;
    max-height: 238px;
    align-items: center;
    border-radius: 1em;
}

p {
    color: #00B2FF;
    text-align: center;
    font-size: 9px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    font-variant: all-small-caps;
    letter-spacing: 0.81px;
}

img {
    width: 150px;
    height: 156px;
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
    background: #D67026;
}
</style>