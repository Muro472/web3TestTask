import { defineStore } from 'pinia';
import Web3 from 'web3';

export const useWeb3Store = defineStore({
  id: 'web3',
  state: () => ({
    web3: null as Web3 | null,
  }),
  getters: {
    getWeb3instance: (state) => state.web3,
  },
  actions: {
    createWeb3Instance() {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(
          process.env.VUE_APP_HTTP_PROVIDER as string
        )
      );
    },
  },
});
