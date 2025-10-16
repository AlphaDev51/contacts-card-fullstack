<script setup>
import { useStoreAuth } from "@/stores/authStore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useContactStore } from "@/stores/contactStore";
const contactStore = useContactStore();
const storeAuth = useStoreAuth();
const router = useRouter();

// États pour le login
const emailInputLogin = ref("");
const passwordInputLogin = ref("");

// États pour le register
const nameInputRegister = ref("");
const emailInputRegister = ref("");
const passwordInputRegister = ref("");

// Onglet actif
const activeTab = ref("login"); // "login" ou "register"

async function loginUser() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex basique
  if (!emailRegex.test(emailInputLogin.value)) {
    contactStore.showToast(" ❌ Adresse email invalide !");
    return; // Arrête la fonction si l'email est invalide
  }

  await storeAuth.login(emailInputLogin.value, passwordInputLogin.value);
  if (storeAuth.token) {
    // Si le token est présent après login
    router.push("/");
  }
}

async function registerUser() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex basique
  if (emailInputRegister.value && !emailRegex.test(emailInputRegister.value)) {
    // alert("Adresse email invalide !");
    contactStore.showToast(" ❌ Adresse email invalide !");
    return; // Arrête la fonction si l'email est invalide
  }
  await storeAuth.register(
    nameInputRegister.value,
    emailInputRegister.value,
    passwordInputRegister.value
  );
  // Optionnel : basculer automatiquement sur l'onglet login après inscription
  // activeTab.value = "login";
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-100 py-16 px-6">
    <div
      class="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
      <!-- Onglets -->
      <div class="flex border-b border-gray-200">
        <button
          @click="activeTab = 'login'"
          :class="[
            'flex-1 py-2 font-medium text-center',
            activeTab === 'login'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700',
          ]">
          Connexion
        </button>
        <button
          @click="activeTab = 'register'"
          :class="[
            'flex-1 py-2 font-medium text-center',
            activeTab === 'register'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700',
          ]">
          Inscription
        </button>
      </div>

      <!-- Formulaire de Connexion -->
      <div v-if="activeTab === 'login'">
        <h1
          class="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
          Connectez-vous
        </h1>

        <input
          v-model="emailInputLogin"
          type="email"
          placeholder="Email"
          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition mb-4" />

        <input
          v-model="passwordInputLogin"
          type="password"
          placeholder="Mot de passe"
          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-4" />

        <button
          @click="loginUser"
          class="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-600 text-white font-bold shadow-md hover:scale-[1.03] hover:shadow-lg transition">
          Se connecter
        </button>
      </div>

      <!-- Formulaire d'Inscription -->
      <div v-if="activeTab === 'register'">
        <h1
          class="text-3xl font-extrabold text-center bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent mb-6">
          Créez votre compte
        </h1>

        <input
          v-model="nameInputRegister"
          type="text"
          placeholder="Nom"
          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition mb-4" />

        <input
          v-model="emailInputRegister"
          type="email"
          placeholder="Email"
          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition mb-4" />

        <input
          v-model="passwordInputRegister"
          type="password"
          placeholder="Mot de passe"
          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-4" />

        <button
          @click="registerUser"
          class="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white font-bold shadow-md hover:scale-[1.03] hover:shadow-lg transition">
          S'inscrire
        </button>
      </div>
    </div>
  </div>
</template>
