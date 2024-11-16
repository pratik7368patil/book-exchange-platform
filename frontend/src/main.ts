import { createApp } from "vue";
import { createPinia } from 'pinia'
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { initAxios, initServices } from "./services";

initServices();
initAxios();

const app = createApp(App);
const pinia = createPinia()

app.use(pinia)
app.use(router);
app.mount("#app");
