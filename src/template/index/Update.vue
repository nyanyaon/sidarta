<template>
    <div class="toast-update show">
        <p>{{ msg }}</p>
    </div>
</template>

<style lang="css" scoped>
@keyframes slide-in {
    0% {
        bottom: 0;
        opacity: 0;
    }

    30% {
        opacity: 1;
    }

    80% {
        bottom: 3.3em;
    }

    100% {
        bottom: 3em;
    }
}

.toast-update {
    position: absolute;
    width: 170px;
    height: 42px;
    border-bottom: 5px solid #00B2FF;
    border-top: 1px solid #00B2FF;
    border-left: 1px solid #00B2FF;
    border-right: 1px solid #00B2FF;
    background: #ffffff;
    box-shadow: 0px 6px 18px -3px rgba(0, 0, 0, 0.25);
}

.show {
    animation: 0.4s slide-in ease-in;
    bottom: 3em;
    left: 2em;
}

.hide {
    opacity: 0;
}

.toast-update p {
    color: #000;
    text-align: center;
    font-size: 0.7em;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
}
</style>

<script lang="ts">
import { defineComponent, toDisplayString } from 'vue';

export default defineComponent({
    name: "Update",
    props: {
        msg: String,
    },
    data() {
        return {
            msg: this.msg,
        }
    },
    methods: {
        hide() {
            const time = 500;
            const toast = document.querySelector('.toast-update');
            toast.animate([
                {
                    opacity: 1,
                    bottom: "3em",
                    offset: 0,
                },
                {
                    bottom: "0",
                    opacity: 0,
                    offset: 1
                }
            ], time);
            setTimeout(() => {
                toast.classList.replace('show', 'hide');
            }, time-20);
        }
    },
    mounted() {
        setTimeout(() => {
            this.hide();
        }, 3000);
    }
})
</script>
