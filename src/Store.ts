import { reactive } from "vue";
import { FileInterface } from './app/Fileman'

export const store = reactive({
    user: "none",
    stateId: "ALA",
    files: [] as FileInterface[],
    loggedTime: 0,
    isLoading: false,
    loadDialog: "Menyiapkan Aplikasi..."
});