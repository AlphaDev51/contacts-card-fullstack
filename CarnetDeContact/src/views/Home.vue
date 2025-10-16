<script setup>
import { useContactStore } from "@/stores/contactStore";
import { useStoreAuth } from "@/stores/authStore";
import ContactCard from "@/components/ContactCard.vue";
import ProgressBar from "@/components/ProgressBar.vue";

import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const store = useContactStore();
const authStore = useStoreAuth();
const search = ref("");
const sortOrder = ref("asc");
const selectedTag = ref("all");
const router = useRouter();
const contactsLoaded = ref(false);

onMounted(() => {
  store.getContacts();
  contactsLoaded.value = true;
});

const filteredContacts = computed(() => {
  if (!contactsLoaded.value) return [];
  let result = store.contacts;

  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    result = store.contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }

  if (selectedTag.value !== "all") {
    if (selectedTag.value === "favoris") {
      result = result.filter((c) => c.is_favorite === true); // 👈 Corrigé: Utilise 'c.isFavorite' et non 'c.isFavorite === true' si isFavorite est un booléen
    } else {
      result = result.filter((c) => c.tag === selectedTag.value);
    }
  }

  return [...result].sort((a, b) => {
    if (sortOrder.value === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
});

const stats = computed(() => {
  if (!contactsLoaded.value) {
    // ✅ Retourne des stats par défaut tant que les contacts ne sont pas chargés
    return { total: 0, famille: 0, amis: 0, travail: 0, favoris: 0 };
  }

  return {
    total: store.contacts.length,
    famille: store.contacts.filter((c) => c.tag === "famille").length,
    amis: store.contacts.filter((c) => c.tag === "amis").length,
    travail: store.contacts.filter((c) => c.tag === "travail").length,
    favoris: store.contacts.filter((c) => c.is_favorite === true).length,
  };
});

const pourcentage = computed(() => {
  if (!contactsLoaded.value) return { famille: 0, amis: 0, travail: 0 };
  return {
    famille: stats.value.total
      ? (stats.value.famille / stats.value.total) * 100
      : 0,
    amis: stats.value.total ? (stats.value.amis / stats.value.total) * 100 : 0,
    travail: stats.value.total
      ? (stats.value.travail / stats.value.total) * 100
      : 0,
  };
});

// Fonction pour se déconnecter
function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-100 via-white to-indigo-100 p-10">
    <div class="max-w-6xl mx-auto">
      <!-- 👇 Affichage conditionnel de l'utilisateur et du bouton de déconnexion -->
      <div
        v-if="authStore.isAuthenticated"
        class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg max-w-full sm:max-w-md md:max-w-2xl lg:max-w-6xl mx-auto border border-white/30">
        <!-- Informations utilisateur -->
        <div class="flex items-center justify-start w-full sm:w-auto">
          <!-- Icône utilisateur (optionnelle mais visuelle) -->
          <div class="mr-3 text-indigo-600 text-lg">👤</div>
          <div class="text-gray-700 text-sm sm:text-base">
            Connecté en tant que:
            <strong class="font-semibold text-indigo-700">{{
              authStore.currentUser.name
            }}</strong>
          </div>
        </div>

        <!-- Bouton de déconnexion -->
        <button
          @click="handleLogout"
          class="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400">
          🔐 Déconnexion
        </button>
      </div>
      <!-- Titre -->
      <h1
        class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 mb-12 text-center drop-shadow">
        📇 Carnet de Contacts
      </h1>

      <!-- 🔍 Barre recherche + tri -->
      <div
        class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/70 backdrop-blur-md border border-white/40 rounded-xl p-4 shadow-md">
        <!-- Input recherche -->
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Rechercher un contact..."
          class="flex-1 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />

        <!-- Select tri -->
        <select
          v-model="sortOrder"
          class="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition">
          <option value="asc">Trier A → Z</option>
          <option value="desc">Trier Z → A</option>
        </select>
      </div>

      <!-- Boutons de filtre -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <button
          v-for="t in ['all', 'famille', 'amis', 'travail', 'favoris']"
          :key="t"
          @click="selectedTag = t"
          :class="[
            'px-4 py-2 rounded-full text-sm font-semibold shadow transition',
            selectedTag === t
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'bg-white/70 text-gray-700 hover:bg-indigo-100',
          ]">
          {{ t === "all" ? "Tous" : t }}
          ({{
            t === "all"
              ? stats.total
              : t === "famille"
              ? store.contacts.filter((c) => c.tag === "famille").length
              : t === "amis"
              ? store.contacts.filter((c) => c.tag === "amis").length
              : t === "travail"
              ? store.contacts.filter((c) => c.tag === "travail").length
              : store.contacts.filter((c) => c.is_favorite === true).length
          }})
        </button>
      </div>

      <!-- Statistiques -->
      <div class="flex flex-col gap-2 mb-8">
        <ProgressBar
          label="Famille"
          icon="👨‍👩‍👧"
          color="bg-blue-500"
          :value="stats.famille"
          :percent="pourcentage.famille" />
        <ProgressBar
          label="Amis"
          icon="🤝"
          color="bg-pink-500"
          :value="stats.amis"
          :percent="pourcentage.amis" />
        <ProgressBar
          label="Travail"
          icon="💼"
          color="bg-green-500"
          :value="stats.travail"
          :percent="pourcentage.travail" />
      </div>

      <!-- <div>
        <StatsChart :stats="stats" />
      </div> -->

      <!-- Message aucun résultat -->
      <p
        v-if="!filteredContacts.length && store.contacts.length"
        class="text-gray-400 italic text-center mt-6">
        Aucun contact trouvé...
      </p>

      <!-- Liste des contacts -->
      <TransitionGroup
        tag="div"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-5"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-500 ease-in absolute"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-5">
        <ContactCard
          v-for="(contact, index) in filteredContacts"
          :key="contact.id"
          v-bind="contact"
          :style="{ transitionDelay: index * 100 + 'ms' }" />
      </TransitionGroup>

      <!-- Aucun contact enregistré -->
      <p
        v-if="!store.contacts.length"
        class="text-gray-400 italic text-center mt-20">
        Aucun contact enregistré pour l’instant...
      </p>
    </div>
  </div>
</template>
