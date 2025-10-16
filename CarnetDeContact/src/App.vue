<script setup>
import { RouterView, RouterLink } from "vue-router";
import { useContactStore } from "@/stores/contactStore";
import { onMounted } from "vue";
import { useStoreAuth } from "./stores/authStore";

const store = useContactStore();
const authStore = useStoreAuth();

onMounted(async () => {
  // 1. Restaure l'état d'authentification (si ce n'est pas fait ailleurs)
  // Si tu utilises pinia-plugin-persistedstate, ceci est fait automatiquement
  // authStore.hydrateFromStorage(); // Inutile avec le plugin

  // 2. Si l'utilisateur est "théoriquement" connecté (token présent), charge les contacts
  if (authStore.isAuthenticated) {
    // Attendre un peu que l'authStore soit vraiment prêt si nécessaire
    // ou appeler une fonction qui vérifie si currentUser est aussi là
    // await authStore.loadCurrentUserIfNeeded(); // Si tu veux forcer le chargement de currentUser aussi
    await store.getContacts(); // Charge les contacts
  }
});
</script>

<template>
  <div class="relative min-h-screen flex flex-col">
    <!-- Navbar glassmorphism -->
    <nav
      class="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-sm">
      <div
        class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Liens -->
        <div class="flex gap-6">
          <RouterLink
            to="/"
            class="text-gray-700 font-medium hover:text-indigo-600 transition">
            Home
          </RouterLink>
          <RouterLink
            to="/addcontact"
            class="text-gray-700 font-medium hover:text-indigo-600 transition">
            Add
          </RouterLink>
          <RouterLink
            to="/dashboard"
            class="text-gray-700 font-medium hover:text-indigo-600 transition">
            Dashboard
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-gray-700 font-medium hover:text-indigo-600 transition">
            About
          </RouterLink>
        </div>

        <!-- Logo / branding -->
        <div
          class="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-lg">
          Contact
        </div>
      </div>
    </nav>
    <!-- toastMessage -->
    <transition
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2">
      <div
        v-if="store.toastMessage"
        class="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all"
        :class="
          store.toastMessage.includes('❌')
            ? 'bg-red-500'
            : store.toastMessage.includes('✏️')
            ? 'bg-blue-500'
            : 'bg-green-500'
        ">
        {{ store.toastMessage }}
      </div>
    </transition>

    <!-- Zone dynamique où tes pages s’affichent -->
    <main
      class="flex-grow bg-gradient-to-br from-pink-50 via-white to-indigo-100 pt-8">
      <RouterView />
    </main>
  </div>
</template>
