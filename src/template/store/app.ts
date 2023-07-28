import { defineStore } from "pinia"

export const useAppStore = defineStore('app', {
    state: () => ({ showLogin: true, showSawer: true, showDisclaimer: false }),
})