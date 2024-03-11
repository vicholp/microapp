import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({ 
        favorites: {},
        lastId: 0,
    }),
    persist: true,
    actions: {
        create(name){
            this.favorites[this.lastId] = {
                id: this.lastId,
                name,
                busStops: {},
                views: 0,
            };

            this.lastId++;
        },
        add(id, busStopId, busStopName, bus) {
            if (!(busStopId in this.favorites[id].busStops)) {
                this.favorites[id].busStops[busStopId] = {
                    id: busStopId,
                    name: busStopName,
                    buses: [],
                };
            }
            if (!(this.favorites[id].busStops[busStopId].buses.includes(bus))){
                this.favorites[id].busStops[busStopId].buses.push(bus);
            } 
        },
        removeBus(id, busStopId, bus) {
            this.favorites[id].busStops[busStopId].buses.filter(b => b != bus);
        },
        get(id) {
            this.favorites[id].views++;

            return this.favorites[id];
        },
        getBusesCount(id) {
            return Object.values(this.favorites[id].busStops).reduce((acc, curr) => acc + curr.buses.length, 0);
        },
        delete(id) {
            delete this.favorites[id];
        },
        isBusInFavorite(id, busStopId, bus) {
            return this.favorites[id]?.busStops[busStopId]?.buses.includes(bus) ?? false;
        },
    },
});