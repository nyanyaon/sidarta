import { defineStore } from "pinia"

export const useAppStore = defineStore('app', {
    state: () => ({ showLogin: false, showSawer: true, showDisclaimer: false }),
})