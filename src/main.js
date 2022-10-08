import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Router from "./Router.vue";
import Elbil from "./Elbil.vue";
import Elpriser from "./Elpriser.vue"
import page3 from "./pages/page3.vue"
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
    },
    {
      path: "/3",
      component: page3
    }
  ],
});

const app = createApp(Router);
app.use(newrouter);
app.mount("#app");
