<template>
    <div class="modal">
        <div class="content">
            <h2>DISCLAIMER</h2>
            <p>Aplikasi ini disediakan apa adanya, dan dengan menggunakannya, Anda menyetujui ketentuan berikut:</p>
            <ol>
                <li>Menggunakan dengan Risiko Anda Sendiri: Konten dan informasi yang disediakan dalam aplikasi ini hanya
                    untuk tujuan umum. Kami tidak menjamin keakuratan atau kelengkapan konten. Penggunaan aplikasi ini
                    adalah tanggung jawab Anda sendiri.</li>
                <li>Tidak Bertanggung Jawab atas Kerugian: Kami tidak bertanggung jawab atas kerugian atau kerusakan yang
                    timbul dari penggunaan atau ketidakmampuan menggunakan aplikasi ini.</li>
                <li>Bukan Nasehat Profesional: Konten dalam aplikasi ini bukanlah nasehat profesional. Silakan berkonsultasi
                    dengan ahli yang sesuai untuk nasehat spesifik.</li>
                <li>Tidak Ada Dukungan: Penyebutan produk, layanan, atau organisasi pihak ketiga tidak menandakan dukungan
                    dari kami.
                    Perubahan pada Aplikasi: Kami dapat mengubah atau menghentikan aplikasi tanpa pemberitahuan sebelumnya.
                </li>
                <li>Privasi Data: Kami menghargai privasi Anda, dan data yang dikumpulkan digunakan sesuai dengan kebijakan
                    privasi kami.</li>
            </ol>
            <p>Dengan menggunakan aplikasi ini, Anda menyetujui ketentuan di atas. Jika Anda tidak setuju, harap tidak
                menggunakan aplikasi ini.</p>
        </div>
        <button @click="doAgree">Saya Setuju (I Agree)</button>
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.content {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    font-size: 10px;
    font-weight: 500;
    max-width: 50vw;
    padding: 1em;
    box-sizing: border-box;
    color: #000;
    border: 1px solid #00B2FF;
    border-radius: 1em 1em 0 0;
}

.content ol {
    margin: 0;
    padding-inline-start: 1.2em;
}

h2 {
    color: #000;
    text-align: left;
    font-size: 16px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    margin-bottom: .85em;
}

p {
    margin-top: .5em;
    margin-bottom: .5em;
}

img {
    width: 30vw;
    height: auto;
}

button {
    width: 50vw;
    background: #00B2FF;
    border: 1px solid #00B2FF;
    border-radius: 0 0 1em 1em;
    padding-top: .5em;
    padding-bottom: .5em;
    font-size: .8em;
    font-weight: 700;
    color: #ffffff;
}

button:hover {
    cursor: pointer;
}
</style>

<script setup lang="ts">
import { useAppStore } from '../store/app'

const appStore = useAppStore()

function doAgree() {
    console.log("Agree")
    appStore.showDisclaimer = false
    window.localStorage.setItem('USER_AGREE', JSON.stringify(true))
}

</script>