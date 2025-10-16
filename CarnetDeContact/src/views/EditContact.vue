<script setup>
import { useContactStore } from "@/stores/contactStore";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { parsePhoneNumber } from "libphonenumber-js";
import { vMaska } from "maska/vue";

const store = useContactStore();
const route = useRoute();
const router = useRouter();
const idR = parseInt(route.params.id);

const contact = store.contacts.find((contact) => contact.id === idR);

if (!contact) {
  router.push("/");
}
const nameInput = ref(contact.name);
const emailInput = ref(contact.email);
const phoneInput = ref(contact.phone);
const tagInput = ref(contact.tag);

async function ModifyContact() {
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

  await store.updateContact(idR, {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneNumberToSave, // Numéro validé et formaté
    tag: tagInput.value,
  });

  router.push("/");
}
</script>
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 py-16 px-6">
    <div
      class="max-w-lg mx-auto bg-white/90 rounded-xl shadow-lg p-10 space-y-6 backdrop-blur-sm border border-indigo-100">
      <!-- Titre -->
      <h1
        class="text-2xl font-bold text-center flex items-center gap-2 justify-center text-indigo-700 tracking-tight">
        ✏️ Modifier un contact
      </h1>

      <!-- Nom -->
      <input
        v-model="nameInput"
        type="text"
        placeholder="Nom du contact"
        class="w-full border-2 border-indigo-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />

      <!-- Email -->
      <input
        v-model="emailInput"
        type="email"
        placeholder="Email"
        class="w-full border-2 border-indigo-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />

      <!-- Téléphone -->
      <input
        v-model="phoneInput"
        v-maska="'+############'"
        type="tel"
        placeholder="Téléphone"
        class="w-full border-2 border-indigo-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />

      <select
        v-model="tagInput"
        class="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition">
        <option value="famille">Famille</option>
        <option value="amis">Amis</option>
        <option value="travail">Travail</option>
      </select>
      <!-- Boutons -->
      <div class="flex gap-4">
        <button
          @click="ModifyContact"
          class="flex-1 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:scale-[1.02] hover:shadow-lg transition">
          💾 Sauvegarder
        </button>

        <button
          @click="router.push('/')"
          class="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">
          ❌ Annuler
        </button>
      </div>
    </div>
  </div>
</template>
