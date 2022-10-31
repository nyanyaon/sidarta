import { reactive } from "vue";

export const store = reactive({
    user: "none",
    isLogin: false,
    stateId: "ALA",
    files: [],
});