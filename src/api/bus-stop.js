import api from './index';

export default {
  get(id) {
    return api({
      method: 'get',
      url: `https://api.xor.cl/red/bus-stop/${id}`,
    });
  },
};