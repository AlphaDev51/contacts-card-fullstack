import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStoreAuth = defineStore(
  "auth",
  () => {
    const currentUser = ref(null);
    const token = ref("");
    const toastMessage = ref(null);

    const isAuthenticated = computed(() => {
      return !!currentUser.value || !!token.value;
    });

    const showToast = (message) => {
      toastMessage.value = message;
      setTimeout(() => {
        toastMessage.value = null;
      }, 2000);
    };
    // actions
    async function register(name, email, password) {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }), // Maintenant, cela fonctionne
      });

      if (response.ok) {
        showToast("Inscription réussie !");
      } else {
        const error = await response.json();
        // alert(error.detail || "Erreur lors de l'inscription.");
        console.log(error);
        showToast("❌ Echec inscription !");
      }
    }

    async function login(email, password) {
      console.log("Tentative de login pour:", email);

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Stocke le token
        token.value = data.access_token;
        localStorage.setItem("token", data.access_token);

        // Appelle /auth/me pour récupérer les infos complètes de l'utilisateur
        const userResponse = await fetch("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token.value}`, // Envoie le token reçu
            "Content-Type": "application/json",
          },
        });

        console.log("Réponse de /auth/me:", userResponse);

        if (userResponse.ok) {
          const user = await userResponse.json();
          console.log("Données utilisateur reçues de /auth/me:", user);
          // Mets à jour currentUser avec les infos complètes
          currentUser.value = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
          console.log("currentUser mis à jour:", currentUser.value);
        } else {
          console.error(
            "Erreur lors de la récupération des infos utilisateur après login:",
            userResponse.status,
            userResponse.statusText
          );
          const errorText = await userResponse.text();
          console.error("Détails erreur /auth/me:", errorText);
          // On peut quand même considérer comme connecté, mais avec des infos partielles
          currentUser.value = { email }; // On garde au moins l'email
        }
      } else {
        const error = await response.json();
        showToast("❌ Erreur de connexion  !");
        console.log(" Erreur de connexion : ", error.detail);
        // alert(error.detail || "Erreur de connexion");
      }
    }

    function logout() {
      console.log("Déconnexion appelée"); // 🔥 Log
      token.value = "";
      currentUser.value = null;
      localStorage.removeItem("token");
    }

    return {
      currentUser,
      token,
      isAuthenticated,
      login,
      logout,
      register,
      showToast,
    };
  },
  {
    // ✅ Ajoute cette configuration
    persist: {
      key: "token", // Nom de la clé dans localStorage
      storage: localStorage, // Où le stocker
      // paths: ['token', 'currentUser'] // Optionnel : ne sauvegarder que ces champs
    },
  }
);
