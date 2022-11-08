<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "Loader",
    props: {
        content: String,
        btn: String,
        handler: Function,
    },
    data() {
        return {
            contentText: this.content,
            btnText: this.btn,
        }
    },
    methods: {
        eventHandler() {
            this.handler();
        }
    },
})
</script>

<template>
    <div class="modal">
        <div class="content">
            <p>{{ contentText }}</p>
            <button @click="eventHandler">{{ btnText }}</button>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.158);
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content {
    background: #ffffff;
    padding: 1em 2em;
    font-weight: 700;
    font-size: 0.75rem;
    color: #393939;
    border: 1px solid #FF9D56;
    max-width: 30vw;
}

button {
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    background: #FF9D56;
    border: none;
    padding: 0.75em 0.5em;
    border-radius: 0.23rem;
}

button:hover {
    background: #D67026;
}
</style>