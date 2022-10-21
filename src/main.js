import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Router from "./Router.vue";
import Elbil from "./pages//Elbil/Elbil.vue";
import Elpriser from "./pages/Elpriser/Elpriser.vue"
import "./index.css";

const newrouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Elpriser
    },
    {
      path: "/elbil",
      component: Elbil
    }
  ],
});

const app = createApp(Router);
app.use(newrouter);
app.mount("#app");
