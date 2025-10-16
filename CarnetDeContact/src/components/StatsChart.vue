<script setup>
import { PieChart } from "vue-chart-3";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  PieController,
  DoughnutController,
} from "chart.js";
import { computed } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  PieController,
  DoughnutController
);
const props = defineProps({
  stats: Object,
});

const chartData = computed(() => ({
  labels: ["Famille", "Amis", "Travail"],
  datasets: [
    {
      data: [props.stats.famille, props.stats.amis, props.stats.travail],
      backgroundColor: ["#3B82F6", "#EC4899", "#10B981"],
      cutout: "50%",
    },
  ],
}));
</script>

<template>
  <PieChart :chart-data="chartData" style="max-width: 400px; height: 400px" />
</template>
