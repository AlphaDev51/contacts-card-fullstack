<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useContactStore } from "@/stores/contactStore";
import { parsePhoneNumber } from "libphonenumber-js";
import { vMaska } from "maska/vue";

const store = useContactStore();
const router = useRouter();

const nameInput = ref("");
const emailInput = ref("");
const phoneInput = ref("");
const tagInput = ref("");

async function saveContact() {
  // 1. Valider l'email (comme avant)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value && !emailRegex.test(emailInput.value)) {
    alert("Adresse email invalide !");
    return;
  }

  // 2. Valider le numéro
  // Maska a déjà formaté le numéro, donc il ne devrait contenir que +, chiffres et espaces
  let phoneNumberToSave = phoneInput.value.trim();

  if (phoneNumberToSave) {
    try {
      // parsePhoneNumber essaie de comprendre le numéro saisi
      const phoneNumber = parsePhoneNumber(phoneNumberToSave);

      if (!phoneNumber.isValid()) {
        alert(
          "Numéro de téléphone invalide ! Veuillez saisir un numéro valide (ex: +33601020304)."
        );
        return; // Arrête la sauvegarde
      }

      // 3. Formatter le numéro au format international
      phoneNumberToSave = phoneNumber.formatInternational();
    } catch (error) {
      // Si le numéro est trop mal formé pour être parsé
      alert("Format de numéro invalide !");
      return;
    }
  }

  // 4. Appeler le store
  await store.addContact(
    nameInput.value,
    emailInput.value,
    phoneNumberToSave,
    tagInput.value
  );

  // 5. Réinitialiser
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  tagInput.value = "famille";
}
</script>
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-100 py-16 px-6">
    <div
      class="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
      <h1
        class="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        ➕ Ajouter un contact
      </h1>

      <!-- Nom -->
      <input
        v-model="nameInput"
        type="text"
        placeholder="Nom du contact"
        class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition" />

      <!-- Email -->
      <input
        v-model="emailInput"
        type="email"
        placeholder="Email"
        class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />

      <!-- Phone -->
      <input
        v-model="phoneInput"
        v-maska="'+############'"
        type="tel"
        placeholder="Téléphone"
        class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition" />
      <select
        v-model="tagInput"
        class="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition">
        <option value="famille">Famille</option>
        <option value="amis">Amis</option>
        <option value="travail">Travail</option>
      </select>
      <!-- Bouton -->
      <button
        @click="saveContact"
        class="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-600 text-white font-bold shadow-md hover:scale-[1.03] hover:shadow-lg transition">
        💾 Sauvegarder
      </button>
    </div>
  </div>
</template>
