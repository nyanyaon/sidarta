<template>
    <div id="logon" class="wrapper">
        <div class="header">
            <img class="logo" alt="logo sidarta">
            <h1>SIDARTA</h1>
            <p>Sistem Digitalisasi Arsip Pertanahan</p>
        </div>
        <!-- login -->
        <div id="login" class="login">
            <p id="info" class="info-error">Terjadi Kesalahan</p>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="">
            <label for="pass">Password</label>
            <input type="password" id="pass" name="pass" value="">
            <button id="saveBtn">Simpan</button>
        </div>
        <!-- verify -->
        <div id="otp" class="login">
            <p id="token" class="info-token">Telah dikirimkan kepada ***@asdasd.com</p>
            <label for="token-input">OTP</label>
            <input type="text" id="token-input" name="token-text" value="">
            <button id="otpBtn">Lanjut</button>
        </div>
        <!-- success -->
        <div id="login-success" class="login">
        </div>
        <button id="startBtn">Mulai</button>
    </div>
</template>