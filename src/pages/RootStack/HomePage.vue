<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import Web3 from 'web3';
import { useWeb3Store } from 'src/stores/stores/web3Store';
import { removeNonDigit } from 'src/utils/funcs/removeNonDigit';

const selectOptions = ['Eth', 'Wei'] as const;

const state = reactive({
  web3: null as Web3 | null,
  account: '',
  balance: '',
  amount: 0,
  accountTo: '',
  selectedOption: 'Eth' as (typeof selectOptions)[number],
  selectOptions: selectOptions,
  transactionSending: false,
});

const createWeb3Instance = () => {
  const web3Store = useWeb3Store();
  web3Store.createWeb3Instance();
  state.web3 = web3Store.web3;
};

const getBalance = async () => {
  if (!state.web3) return '0';

  const accounts = await state.web3.eth.getAccounts();
  const balance = await state.web3.eth.getBalance(accounts[0]);
  return await state.web3.utils.fromWei(balance, 'ether');
};

const sendTransaction = async () => {
  if (!state.web3) return;

  if (isNaN(+state.amount) && state.amount <= 0 && String(state.amount) === '')
    return;

  state.transactionSending = true;

  const accounts = await state.web3.eth.getAccounts();

  const amount =
    state.selectedOption === selectOptions[0]
      ? state.web3.utils.toWei(state.amount.toString(), 'ether')
      : state.amount;

  await state.web3.eth.sendTransaction({
    from: accounts[0],
    to: state.accountTo,
    value: amount,
  });

  state.balance = await getBalance();
  state.transactionSending = false;
};

onMounted(async () => {
  createWeb3Instance();

  state.balance = await getBalance();
});
</script>

<template>
  <div class="home_page">
    <q-card square class="home_page-main">
      <!-- top -->
      <q-card bordered class="home_page-main-container home_page-balance">
        <div class="home_page-main-container-text">
          {{ `${$t('balance')}: ${state.balance}Eth` }}
        </div>
      </q-card>

      <!-- inputs -->
      <div>
        <!-- amount -->
        <div class="home_page-input home_page-line">
          <q-input
            class="home_page-amount_input"
            v-model="state.amount"
            :label="$t('amount')"
            outlined
            bg-color="white"
            :rules="[
              (val) =>
                val === removeNonDigit(val) || $t('onlyPositiveNumbersRule'),
            ]"
          />

          <!-- type -->
          <q-select
            class="home_page-type_select"
            v-model="state.selectedOption"
            :options="state.selectOptions"
            :label="$t('type')"
            outlined
            bg-color="white"
          />
        </div>
      </div>

      <!-- account to -->
      <q-input
        class="home_page-input"
        v-model="state.accountTo"
        :label="$t('receiverAddress')"
        outlined
        bg-color="white"
      />

      <!-- submit button -->
      <q-btn
        class="home_page-submit_button"
        text-color="black"
        :disabled="state.transactionSending"
        color="white"
        @click="sendTransaction"
        :label="$t('send')"
      />
    </q-card>
  </div>
</template>

<style scoped lang="scss">
@import 'src/css/components/home.page.scss';
</style>
