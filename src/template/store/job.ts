import { defineStore } from "pinia";

export const useJobStore = defineStore('job', {
    state: () =>  ({id: '', files: [], done: [], abort: []})
});