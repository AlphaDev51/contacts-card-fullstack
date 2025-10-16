import { defineStore } from "pinia";
import { ref } from "vue";
import { useStoreAuth } from "./authStore";

export const useContactStore = defineStore("contact", () => {
  const contacts = ref([]);
  const toastMessage = ref(null);
  const loading = ref(false); // Pour gérer l'état de chargement

  // actions
  async function getContacts() {
    loading.value = true;
    const authStore = useStoreAuth();

    if (!authStore.token) {
      console.error("Aucun token, connexion requise");
      // Optionnel : afficher un toast
      // showToast("Veuillez vous connecter pour accéder à vos contacts.");
      return; // Ne fait rien si pas connecté
    }

    loading.value = true;
    try {
      const response = await fetch("http://localhost:8000/contacts", {
        headers: {
          Authorization: `Bearer ${authStore.token}`, // ✅ Envoie le token
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        contacts.value = await response.json();
        // showToast("✅ Contacts chargés !");
      } else {
        console.error(
          "Erreur lors de la récupération des contacts:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Détails erreur /contacts:", errorText);
        // showToast("Erreur lors du chargement des contacts.");
      }
    } catch (e) {
      console.error("Erreur réseau :", e);
      // showToast("Erreur de connexion au serveur.");
    } finally {
      loading.value = false;
    }
  }

  async function addContact(name, email, phone, tag) {
    const authStore = useStoreAuth();
    if (!authStore.token) {
      console.error("Aucun token, connexion requise");
      showToast("Veuillez vous connecter pour ajouter un contact.");
      return;
    }

    const response = await fetch("http://localhost:8000/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, tag, is_favorite: false }),
    });

    if (response.ok) {
      const newContact = await response.json();
      contacts.value.push(newContact); // ✅ Ajoute à la liste locale
      showToast("✅ Contact ajouté !");
    } else {
      console.error("Erreur lors de l'ajout du contact");
      showToast("Erreur lors de l'ajout du contact.");
    }
  }

  async function deleteContact(id) {
    const authStore = useStoreAuth();
    if (!authStore.token) {
      console.error("Aucun token, connexion requise");
      showToast("Veuillez vous connecter pour supprimer un contact.");
      return;
    }

    const response = await fetch(`http://localhost:8000/contacts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      contacts.value = contacts.value.filter((contact) => contact.id !== id);
      showToast("❌ Contact supprimé !");
      await getContacts();
    } else {
      console.error("Erreur lors de la suppression du contact");
      showToast("Erreur lors de la suppression du contact.");
    }
  }

  async function updateContact(id, newData) {
    const authStore = useStoreAuth();
    if (!authStore.token) {
      console.error("Aucun token, connexion requise");
      showToast("Veuillez vous connecter pour modifier un contact.");
      return;
    }

    const response = await fetch(`http://localhost:8000/contacts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (response.ok) {
      const updatedContact = await response.json();
      const index = contacts.value.findIndex((contact) => contact.id === id);
      if (index !== -1) {
        contacts.value[index] = updatedContact;
      }
      showToast("✏️ Contact modifié !");
      await getContacts();
    } else {
      console.error("Erreur lors de la mise à jour du contact");
      showToast("Erreur lors de la modification du contact.");
    }
  }

  async function toggleFavorite(id) {
    const authStore = useStoreAuth();
    if (!authStore.token) {
      console.error("Aucun token, connexion requise");
      showToast("Veuillez vous connecter pour modifier le statut du contact.");
      return;
    }

    const index = contacts.value.findIndex((contact) => contact.id === id);
    if (index === -1) {
      console.error("Contact non trouvé dans le store local");
      return;
    }

    // Inverser la valeur locale *avant* la requête (optimistic update)
    const newFavoriteStatus = !contacts.value[index].is_favorite;
    contacts.value[index].is_favorite = newFavoriteStatus;

    const contactToUpdate = { ...contacts.value[index] };
    // contactToUpdate.is_favorite = newFavoriteStatus;
    try {
      const response = await fetch(`http://localhost:8000/contacts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactToUpdate),
      });

      if (response.ok) {
        const updatedContact = await response.json();
        contacts.value[index] = updatedContact;

        showToast(
          updatedContact.is_favorite // Utilise la valeur retournée par le backend
            ? "⭐ Ajouté aux favoris"
            : "❌ Retiré des favoris"
        );
        await getContacts();
      } else {
        contacts.value[index].is_favorite = !newFavoriteStatus;
      }
    } catch (e) {
      contacts.value[index].is_favorite = !newFavoriteStatus;
    }
  }

  function exportContactsAsJson() {
    // 1. Crée un objet contenant les données à exporter
    // Ici, on exporte la liste complète des contacts
    const dataToExport = {
      // Optionnel : Ajouter des métadonnées
      exportedAt: new Date().toISOString(),
      format: "carnet-de-contacts-v1",
      contacts: contacts.value, // Utilise la liste actuelle des contacts du store
    };

    // 2. Convertir l'objet JavaScript en chaîne JSON
    const jsonString = JSON.stringify(dataToExport, null, 2); // null et 2 pour un format lisible

    // 3. Créer un objet Blob à partir de la chaîne JSON
    const blob = new Blob([jsonString], { type: "application/json" });

    // 4. Créer une URL pour ce Blob
    const url = URL.createObjectURL(blob);

    // 5. Créer un élément <a> temporaire
    const link = document.createElement("a");
    link.href = url;
    // 6. Définir le nom du fichier à télécharger
    link.download = `contacts_export_${new Date()
      .toISOString()
      .slice(0, 19)}.json`; // Ex: contacts_export_2023-10-27T15-30-00.json

    // 7. Simuler un clic sur le lien pour déclencher le téléchargement
    document.body.appendChild(link); // Ajoute le lien temporairement au DOM
    link.click(); // Clique sur le lien
    document.body.removeChild(link); // Supprime le lien du DOM

    // 8. Libérer l'URL objet pour éviter les fuites de mémoire
    URL.revokeObjectURL(url);

    // Optionnel : Afficher un toast de confirmation
    showToast("📥 Contacts exportés avec succès !");
  }

  const showToast = (message) => {
    toastMessage.value = message;
    setTimeout(() => {
      toastMessage.value = null;
    }, 2000);
  };

  return {
    contacts,
    toastMessage,
    loading,
    getContacts,
    addContact,
    deleteContact,
    updateContact,
    showToast,
    toggleFavorite,
    exportContactsAsJson,
  };
});

// export const useContactStore = defineStore("contact", () => {
//   // state
//   const contacts = ref([]);
//   const toastMessage = ref(null);

//   const saved = localStorage.getItem("contacts");
//   if (saved) {
//     contacts.value = JSON.parse(saved);
//   }

//   //action
//   const showToast = (message) => {
//     toastMessage.value = message;
//     setTimeout(() => {
//       toastMessage.value = null;
//     }, 1000);
//   };

//   const addContact = (name, email, phone, tag) => {
//     contacts.value.push({
//       id: Date.now(),
//       name: name,
//       email: email,
//       phone: phone,
//       tag: tag,
//       isFavorite: false,
//     });
//     showToast("✅ Contact ajouté !");
//   };

//   const toggleFavorite = (id) => {
//     const index = contacts.value.findIndex((contact) => contact.id === id);
//     if (index !== -1) {
//       contacts.value[index].isFavorite = !contacts.value[index].isFavorite;
//       showToast(
//         contacts.value[index].isFavorite
//           ? "⭐ Ajouté aux favoris"
//           : "⭐ Retiré des favoris"
//       );
//     }
//   };

//   const deleteContact = (id) => {
//     contacts.value = contacts.value.filter((contact) => contact.id !== id);
//     showToast("❌ Contact supprimé !");
//   };
//   const updateContact = (id, newData) => {
//     const index = contacts.value.findIndex((contact) => contact.id === id);
//     if (index !== -1) {
//       contacts.value[index] = { ...contacts.value[index], ...newData };
//     }
//     showToast("✏️ Contact modifié !");
//   };
//   watch(
//     contacts,
//     (val) => {
//       localStorage.setItem("contacts", JSON.stringify(val));
//     },
//     { deep: true }
//   );

//   return {
//     contacts,
//     addContact,
//     deleteContact,
//     updateContact,
//     showToast,
//     toastMessage,
//     toggleFavorite,
//   };
// });
