<script setup>
const props = defineProps({
  label: String,
  icon: String,
  color: String, // ex : "bg-blue-500"
  value: Number, // nombre brut
  percent: Number, // pourcentage
});
</script>

<template>
  <div class="flex items-center gap-3 mb-2">
    <!-- Label -->
    <span class="w-28 font-semibold text-gray-700">{{ icon }} {{ label }}</span>

    <!-- Barre -->
    <div class="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
      <div
        :class="[color, 'h-4 transition-all']"
        :style="{ width: percent + '%' }" />
    </div>

    <!-- % et valeur -->
    <span class="w-24 text-sm text-gray-600 text-right">
      {{ Math.round(percent) }}% ({{ value }})
    </span>
  </div>
</template>
