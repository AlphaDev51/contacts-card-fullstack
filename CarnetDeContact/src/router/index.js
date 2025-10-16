// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import NotFound from "@/views/NotFound.vue";
import AddContact from "@/views/AddContact.vue";
import EditContact from "@/views/EditContact.vue";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";

// 👇 Importe ton store d'authentification
import { useStoreAuth } from "@/stores/authStore";
const routes = [
  // 👇 Routes publiques (accessibles sans être connecté)
  {
    name: "Login",
    path: "/login",
    component: Login,
  },
  {
    name: "About",
    path: "/about",
    component: About,
  },

  // 👇 Routes protégées (nécessitent d'être connecté)
  {
    name: "Home",
    path: "/",
    component: Home,
    beforeEnter: (to, from, next) => {
      const authStore = useStoreAuth();
      if (authStore.isAuthenticated) {
        next(); // ✅ Connecté, accès autorisé
      } else {
        next({ name: "Login" }); // ❌ Non connecté, redirection vers login
      }
    },
  },
  {
    name: "addcontact",
    path: "/addcontact",
    component: AddContact,
    beforeEnter: (to, from, next) => {
      const authStore = useStoreAuth();
      if (authStore.isAuthenticated) {
        next();
      } else {
        next({ name: "Login" });
      }
    },
  },
  {
    name: "dashboard",
    path: "/dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const authStore = useStoreAuth();
      if (authStore.isAuthenticated) {
        next();
      } else {
        next({ name: "Login" });
      }
    },
  },
  {
    name: "editcontact",
    path: "/edit/:id",
    component: EditContact,
    beforeEnter: (to, from, next) => {
      const authStore = useStoreAuth();
      if (authStore.isAuthenticated) {
        next();
      } else {
        next({ name: "Login" });
      }
    },
  },

  // 👇 Page 404 (toujours en dernier)
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
