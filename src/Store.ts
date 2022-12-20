import { reactive } from "vue";
import { FileInterface } from './app/Fileman'

export const store = reactive({
    user: "none",
    isLogin: false,
    stateId: "ALA",
    files: [] as FileInterface[],
    loggedTime: 0,
    isLoading: false,
    loadDialog: "Menyiapkan Aplikasi..."
});