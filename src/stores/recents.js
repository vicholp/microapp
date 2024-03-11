import { defineStore } from 'pinia';

export const useRecentsStore = defineStore('recents', {
    state: () => ({ 
        recent: {},
    }),
    persist: true,
    actions: {
        add(busStopId, busStopName){
            if (!(busStopId in this.recent)) {
                this.recent[busStopId] = {
                    id: busStopId,
                    name: busStopName,
                    last: null,
                    times: 0,
                    servicesCount: null,
                };
            }

            this.recent[busStopId].times++;
        },
        setServicesCount(busStopId, servicesCount){
            this.recent[busStopId].servicesCount = servicesCount;
        },   
        getRecent(){
            return this.recent;
        },
    },
});