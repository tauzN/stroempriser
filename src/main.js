import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Router from "./Router.vue";
import Elbil from "./Elbil.vue";
import Elpriser from "./Elpriser.vue"
import "./index.css";

const newrouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Elpriser,
    },
    {
      path: "/elbil",
      component: Elbil
    },
    {
      path: "/elpriser",
      component: Elpriser
    }
  ],
});

const app = createApp(Router);
app.use(newrouter);
app.mount("#app");
