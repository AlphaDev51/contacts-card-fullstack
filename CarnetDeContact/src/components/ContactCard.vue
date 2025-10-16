<script setup>
import { useContactStore } from "@/stores/contactStore";
import { RouterLink } from "vue-router";
const store = useContactStore();

const props = defineProps({
  name: String,
  email: String,
  phone: String,
  id: Number,
  tag: String,
  is_favorite: Boolean,
});
</script>
<template>
  <div
    class="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col">
    <!-- Avatar -->
      <!-- Étoile de favoris -->
      <button @click="store.toggleFavorite(id)" class="absolute left-2 top-2">
        <span v-if="is_favorite" class="text-yellow-400 text-lg">⭐</span>
        <span v-else class="text-gray-400 text-lg hover:text-yellow-400"
          >☆</span
        >
      </button>
    <div class="absolute right-2 mt-2">
      <span
        v-if="tag === 'famille'"
        class="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
        👨‍👩‍👧 Famille
      </span>

      <span
        v-else-if="tag === 'amis'"
        class="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
        🤝 Amis
      </span>

      <span
        v-else-if="tag === 'travail'"
        class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
        💼 Travail
      </span>
    </div>
    <img
      :src="`https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&bold=true&size=200`"
      :alt="name"
      class="w-full h-40 object-cover" />

    <!-- Infos -->
    <div class="p-5 text-center bg-gradient-to-b from-gray-50 to-white flex-1">
      <h1 class="text-lg font-bold text-gray-800 mb-1">{{ name }}</h1>
      <h2 class="text-sm text-gray-600">{{ email }}</h2>
      <p class="text-sm text-gray-500">{{ phone }}</p>
    </div>

    <!-- Footer avec actions -->

    <div
      class="flex justify-around items-center p-3 bg-white/40 backdrop-blur-md border-t border-white/30">
      <!-- Modifier -->
      <RouterLink
        :to="`/edit/${id}`"
        class="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow hover:scale-[1.05] transition">
        ✏️ Modifier
      </RouterLink>

      <!-- Supprimer -->
      <button
        @click="store.deleteContact(id)"
        class="px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold shadow hover:scale-[1.05] transition"
        title="Supprimer ce contact">
        ❌ Supprimer
      </button>
    </div>
  </div>
</template>
