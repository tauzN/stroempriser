import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Router from "./Router.vue";
import App from "./App.vue";
import Elbil from "./Elbil.vue";
import Elpriser from "./Elpriser.vue"
import "./index.css";

const newrouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: App,
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
