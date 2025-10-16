<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 p-6">
    <div
      class="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center space-y-6">
      <h1 class="text-6xl font-extrabold text-red-600">404</h1>

      <p class="text-gray-600 text-xl">🚨 Oups ! Page non trouvée.</p>

      <p class="text-gray-500">
        Il semble que la page que vous cherchez n’existe pas.
      </p>

      <RouterLink
        to="/"
        class="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition">
        ⬅️ Retour à l’accueil
      </RouterLink>
    </div>
  </div>
</template>
