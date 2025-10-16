<script setup>
import { computed, onMounted } from "vue";
import { useContactStore } from "@/stores/contactStore";
import ProgressBar from "@/components/ProgressBar.vue";
import StatsChart from "@/components/StatsChart.vue";
const store = useContactStore();

// Fonction appelée par le bouton
function exportContacts() {
  store.exportContactsAsJson();
}

const stats = computed(() => {
  onMounted(() => {
    if (store.contacts.length === 0) {
      store.getContacts();
    }
  });

  if (store.loading || store.contacts.length === 0) {
    // Retourne des stats par défaut si en cours de chargement ou vide
    return { total: 0, famille: 0, amis: 0, travail: 0, favoris: 0 };
  }
  return {
    total: store.contacts.length,
    famille: store.contacts.filter((c) => c.tag === "famille").length,
    amis: store.contacts.filter((c) => c.tag === "amis").length,
    travail: store.contacts.filter((c) => c.tag === "travail").length,
  };
});

const pourcentage = computed(() => {
  if (stats.value.total === 0) {
    return { famille: 0, amis: 0, travail: 0 };
  }
  return {
    famille: (stats.value.famille / stats.value.total) * 100,
    amis: (stats.value.amis / stats.value.total) * 100,
    travail: (stats.value.travail / stats.value.total) * 100,
  };
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-10">
    <div class="max-w-5xl mx-auto">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <!-- Titre -->
        <h1 class="text-3xl font-extrabold text-indigo-700">📊 Dashboard</h1>

        <!-- Bouton d'export -->
        <button
          @click="exportContacts"
          class="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400">
          📥 Exporter mes contacts (JSON)
        </button>
      </div>

      <!-- Chart principal -->
      <div
        class="bg-white rounded-xl p-6 shadow-md mb-10 flex flex-col items-center justify-center">
        <h2 class="text-2xl font-semibold mb-8">Répartition des contacts</h2>
        <StatsChart :stats="stats" />
      </div>

      <!-- Progress bars réutilisées -->
      <div class="bg-white rounded-xl p-6 shadow-md">
        <h2 class="text-xl font-semibold mb-4">En chiffres</h2>
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
    </div>
  </div>
</template>
