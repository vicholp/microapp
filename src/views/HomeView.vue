<template>
  <nav class="w-full flex justify-center items-end  py-5 border-b-2 border-[#A61124]">
    <h1>
      MicroApp 
    </h1>
    <v-icon
      icon="tabler:bus-stop"
      class="text-2xl"
    />
  </nav>
  <div class="w-full flex flex-col gap-8 p-3 container">
    <div class="flex flex-col items-center gap-3">
      <div class="flex gap-2 w-full h-10">
        <input
          v-model="busStopId"
          class="border px-2 w-full"
          placeholder="PJ1692"
          @keydown.enter="updateBusStopBuses(busStopId)"
        >
        <button
          :class="`h-full bg-[#A61124] flex gap-1 font-medium items-center text-white px-3 
        ${loadingBuses ? 'bg-opacity-50 disabled' : ''} `"
          @click="loadingBuses ? () => {} : updateBusStopBuses(busStopId)"
        >
          <v-icon
            v-if="loadingBuses"
            icon="mdi:bus"
            class="animate-bounce"
          />
          <v-icon
            v-else
            icon="mdi:search"
          />
          <p>
            buscar
          </p>
        </button>
      </div>
      <div
        v-if="!loadingBuses && services.length > 0"
        class="flex flex-col gap-3 w-full"
      >
        <div
          v-for="service in services"
          :key="service.id"
          class="border border-[#A61124] border-opacity-20 w-full flex flex-col gap-3"
        >
          <div class="flex flex-col gap-3 p-3">
            <div class="flex gap-2 items-center">
              <h3 class="font-medium ">
                {{ service.id }}
              </h3>
              <span v-if="shouldShowBusStopId">
                {{ service.busStopId }}
              </span>
              <div class="ml-auto">
                <div @click="showAddToFavorites = service.id">
                  <v-icon icon="mdi:favorite-add-outline" />
                </div>
              </div>
            </div>
            <div v-if="service.buses.length > 0">
              <div
                v-for="(bus, id) in service.buses"
                :key="bus.id"
                class="flex gap-2 items-center"
              >
                <v-icon
                  icon="mdi:bus"
                  :class="`text-black ${id > 0 ? 'text-opacity-30' : 'text-opacity-100'}`"
                />
                <div>
                  {{ bus.metersDistance }} m,
                  de {{ bus.minArrivalTime }} min a
                  {{ bus.maxArrivalTime }} min
                </div>
              </div>
            </div>
            <div v-else>
              No hay buses que se dirijan al paradero
            </div>
          </div>
          <div
            v-if="showAddToFavorites == service.id"
            class="flex flex-col gap-2 p-3 bg-gray-200"
          >
            <h4>
              Agregar a favoritos:
            </h4>
            <div
              v-for="fav in favoritesStore.favorites"
              :key="fav.id"
              class="flex gap-2 items-center"
              @click="addToFavorites(fav.id, busStop.id, busStop.name, service.id)"
            >
              <v-icon
                v-if="favoritesStore.isBusInFavorite(fav.id, busStop.id ?? service.busStopId, service.id)"
                icon="mdi:star"
              />
              <v-icon
                v-else
                icon="mdi:star-outline"
              />
              {{ fav.name }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="loadingBuses"
        class="flex flex-col gap-3 w-full"
      >
        <div
          v-for="service in [...Array(3).keys()]"
          :key="service.id"
          class="bg-gray-50 w-full flex flex-col p-2 gap-3 animate-pulse"
        >
          <span class="h-20" />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 w-full">
      <h2 class="font-medium px-2">
        Favoritos
      </h2>
      <div class="flex flex-col gap-1">
        <div
          v-for="fav in favoritesStore.favorites"
          :key="fav"
          class="border border-gray-100 flex flex-col"
          @click="showFavorites(fav.id)"
        >
          <div class="flex justify-between p-2">
            <p class="text-black text-opacity-90">
              {{ fav.name }}
            </p>  
            <div class="flex items-center gap-2 text-black text-opacity-70">
              <p>
                {{ favoritesStore.getBusesCount(fav.id) }} buses
              </p>
              <v-icon
                icon="mdi:delete"
                @click="removeFavoriteId = fav.id"
              />
            </div>
          </div>
          <div
            v-if="removeFavoriteId == fav.id"
            class="flex"
          >
            <div
              class="bg-gray-200 p-2"
            >
              Confirmar
            </div>
            <div
              class="bg-gray-200 p-2"
              @click="removeFavoriteId = null"
            >
              Cancelar
            </div>
          </div>
        </div>
      </div>
      <div 
        v-if="!showCreateFavorite"
        class="bg-gray-50 p-2 text-black text-opacity-90"
        @click="showCreateFavorite = true"
      >
        Crear grupo de favoritos
      </div>
      <div
        v-else
        class="flex gap-3 h-10"
      >
        <input
          v-model="newFavName"
          type="text"
          class="border w-full h-full px-2"
          @keydown.enter="createFavorite(newFavName)"
        >
        <button
          class="bg-[#A61124] h-full text-white px-5"
          @click="createFavorite(newFavName)"
        >
          agregar
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-2 w-full">
      <h2 class="font-medium px-2">
        Recientes
      </h2>
      <div class="flex flex-col gap-1">
        <div
          v-for="recentBusStop in getRecents()"
          :key="recentBusStop.id"
          class="border border-gray-100 flex flex-col"
          @click="busStopId = recentBusStop.id ; updateBusStopBuses(recentBusStop.id)"
        >
          <div class="flex justify-between p-2">
            <p class="text-black text-opacity-90">
              {{ recentBusStop.id }}
            </p>  
            <!-- <div class="flex items-center gap-2 text-black text-opacity-70">
              <p>
                {{ favoritesStore.getBusesCount(fav.id) }} buses
              </p>
              <v-icon
                icon="mdi:delete"
                @click="removeFavoriteId = fav.id"
              />
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import busStopApi from '../api/bus-stop.js';
import { mapStores } from 'pinia';
import { useFavoritesStore } from '../stores/favorites.js';
import { useRecentsStore } from '../stores/recents.js';

export default {
  data() {
    return {
      loadingBuses: false,
      busStopId: null,
      services: [],
      busStop: null,
      newFavName: null,
      showAddToFavorites: null,
      shouldShowBusStopId: false,
      showCreateFavorite: false,
      removeFavoriteId: null,
    };
  },
  computed: {
    ...mapStores(useFavoritesStore, useRecentsStore),
  },
  watch: {
    busStopId() {
      this.busStopId = this.busStopId.toUpperCase();
    },
  },
  methods: {
    async updateBusStopBuses(id) {
      this.loadingBuses = true;
      const response = await busStopApi.get(id);
      this.services = response.data.services;
      this.busStop = response.data;
      this.shouldShowBusStopId = false;
      this.loadingBuses = false;
      this.recentsStore.add(id, this.busStop.name);
      this.recentsStore.setServicesCount(id, this.services.length);
    },
    createFavorite(name) {
      this.favoritesStore.create(name);
      this.showCreateFavorite = false;
      this.newFavName = null;
    },
    getRecents() {
      return this.recentsStore.getRecent();
    },
    addToFavorites(favId, busStopId, busStopName, serviceId) {
      this.favoritesStore.add(favId, busStopId, busStopName, serviceId);
    },
    getFavorites(favId) {
      this.favoritesStore.get(favId);
    },
    removeFromFavorites(favId, busStopId, serviceId) {
      this.favoritesStore.removeBus(favId, busStopId, serviceId);
    },

    async showFavorites(favId) {
      this.loadingBuses = true;

      window.scrollTo({ top: 0, behavior: 'smooth' });

      const fav = this.favoritesStore.get(favId);

      const services = [];

      const wait = Object.values(fav.busStops).map(busStop => {
        return busStopApi.get(busStop.id).then(response => {
          services.push(...response.data.services.filter(service =>
            busStop.buses.includes(service.id),
          ).map(service => ({
            ...service,
            busStopId: busStop.id,
            busStopName: busStop.name,
          })));
        });
      });

      await Promise.allSettled(wait);

      this.shouldShowBusStopId = true;
      this.services = services;

      this.loadingBuses = false;
    },
  },
};

</script>
