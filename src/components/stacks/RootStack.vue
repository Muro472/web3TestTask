<script setup lang="ts">
import RootLayout from 'src/layouts/RootLayout.vue';
import { useWeb3Store } from 'src/stores/stores/web3Store';
import { onMounted, reactive } from 'vue';
import { RouterNames } from 'src/utils/enums/RouterNames';

const state = reactive({
  tabs: [
    {
      name: 'home',
      label: 'home',
      icon: 'home',
      routerName: RouterNames.HOME_PAGE,
    },
    {
      name: 'alarms',
      label: 'transactions',
      icon: 'list',
      routerName: RouterNames.TRANSACTIONS_PAGE,
    },
  ],
});

const createWeb3Instance = () => {
  const web3Store = useWeb3Store();
  web3Store.createWeb3Instance();
};

onMounted(() => {
  createWeb3Instance();
});
</script>

<template>
  <RootLayout>
    <template #header>
      <q-tabs dense class="text-white">
        <q-route-tab
          v-for="tab in state.tabs"
          :key="tab.name"
          class="_root-tab-style"
          :name="tab.name"
          :icon="tab.icon"
          :label="$t(tab.label)"
          :to="{ name: tab.routerName }"
        />
      </q-tabs>
    </template>

    <template #page>
      <router-view />
    </template>
  </RootLayout>
</template>

<style scoped lang="scss"></style>
