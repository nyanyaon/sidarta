<template>
  <div v-if="false" class="modal">
    <div class="lds-ripple">
      <div></div>
      <div></div>
    </div>
    <p class="dialogue"></p>
  </div>
</template>

<style scoped>
.dialogue {
  color: #fff;
  margin-top: 0.75em;
  font-weight: 500;
}
.modal {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99;
  background: #000000a3;
  width: 100vw;
  height: 100vh;
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "Loader",
})
</script>../../app