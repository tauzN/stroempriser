import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Router from "./Router.vue";
import Elbil from "./pages/Elbil.vue";
import page3 from "./pages/page3.vue"
import "./index.css";

const newrouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: page3
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
