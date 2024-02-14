<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { Transaction, BlockNumberOrTag } from 'web3-types';
import { useWeb3Store } from 'src/stores/stores/web3Store';
import Web3 from 'web3';
import { useI18n } from 'vue-i18n';
import { ITableColumn } from 'src/utils/types/ITableColumn';
import { hashShortener } from 'src/utils/funcs/hashShortener';
import CopyToClipboardSpan from 'src/components/general/CopyToClipboardSpan.vue';
const { t } = useI18n();

const createWeb3Instance = async () => {
  const web3Store = useWeb3Store();
  web3Store.createWeb3Instance();
  state.web3 = web3Store.web3;

  if (web3Store.web3 === null) return;
  state.account = (await web3Store.web3.eth.getAccounts())[0];
};

const state = reactive({
  web3: null as Web3 | null,
  loading: true,
  account: '',
  totalPages: 0,
  rows: [] as Transaction[],
  latestBlock: BigInt(0) as BlockNumberOrTag,
});

const columns: ITableColumn[] = [
  {
    name: 'type',
    label: t('type'),
    align: 'left',
    field: '',
    format: (_, row) => getTxType(row),
  },
  {
    name: 'amount',
    label: t('amount'),
    align: 'left',
    field: 'value',
    format: (val) => `${val}wei`,
  },
  {
    name: 'interactionAddress',
    label: t('interactionAddress'),
    align: 'left',
    field: '',
    format: (_, row) => getInteractionHash(row),
  },
  {
    name: 'hash',
    label: t('hash'),
    align: 'left',
    field: 'hash',
    format: (val) => hashShortener(val, 45),
  },
  // { name: 'hash', label: t('type'), field: 'carbs' },
];

const getTxType = (tx: Transaction) => {
  if (!tx.from) return 'Unknown';
  if (tx.from.toLowerCase() === state.account.toLowerCase()) {
    return 'Sent';
  } else {
    return 'Received';
  }
};

const getInteractionHash = (tx: Transaction) => {
  if (tx.to?.toLowerCase() === state.account.toLowerCase()) {
    if (tx.from === undefined) return t('systemTransfer');
    return `${t('receivedFrom')} ${tx.from}`;
  } else {
    return `${t('senTo')} ${tx.to}`;
  }
};

const getData = async () => {
  if (!state.web3) return;

  state.latestBlock = await state.web3.eth.getBlockNumber();

  await loadMoreTx();
  state.loading = false;
};

const loadMoreTx = async () => {
  const transactions = await getBlockTx(state.latestBlock);

  state.latestBlock = BigInt(state.latestBlock) - BigInt(1);

  if (transactions.length === 0) await loadMoreTx();
  else {
    state.rows = state.rows.concat(transactions);
  }
};

const getBlockTx = async (i: BlockNumberOrTag): Promise<Transaction[]> => {
  const transactions = [] as Transaction[];
  if (!state.web3) return transactions;

  const block = await state.web3.eth.getBlock(i, true);

  if (block && block.transactions) {
    block.transactions.forEach((transaction) => {
      if (typeof transaction === 'string') return;

      if (
        transaction.from.toLowerCase() === state.account.toLowerCase() ||
        (transaction.to !== undefined &&
          transaction.to !== null &&
          transaction.to.toLowerCase() === state.account.toLowerCase())
      ) {
        transactions.push(transaction);
      }
    });
  }
  return transactions.reverse();
};

const onLoad = async (_: number, done: () => void) => {
  if (state.latestBlock !== BigInt(0)) await loadMoreTx();

  done();
};

onMounted(async () => {
  createWeb3Instance();
  await getData();
});
</script>

<template>
  <div>
    <q-infinite-scroll @load="onLoad" :offset="250" v-if="!state.loading">
      <!-- item start -->

      <q-table
        :rows="state.rows"
        :columns="columns"
        hide-bottom
        hide-pagination
        row-key="name"
        :rows-per-page-options="[0]"
        :flat="$q.screen.xl || $q.screen.lg || $q.screen.md"
        :grid="!($q.screen.xl || $q.screen.lg || $q.screen.md)"
      >
        <template v-slot:body-cell-hash="props">
          <q-td :props="props">
            <CopyToClipboardSpan
              :text="props.row.hash"
              :showText="hashShortener(props.row.hash, 15)"
            />
          </q-td>
        </template>

        <template v-slot:item="props">
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
            :style="props.selected ? 'transform: scale(0.95);' : ''"
          >
            <q-card bordered flat>
              <q-separator />
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>

                  <template
                    v-if="
                      col.name !== 'interactionAddress' && col.name !== 'hash'
                    "
                  >
                    <q-item-section side>
                      <q-item-label caption>{{ col.value }}</q-item-label>
                    </q-item-section>
                  </template>
                  <template v-else>
                    <q-item-section side>
                      <q-item-label caption
                        ><CopyToClipboardSpan
                          :text="col.value"
                          :showText="hashShortener(col.value, 15)"
                      /></q-item-label>
                    </q-item-section>
                  </template>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
      </q-table>
      <!-- item end -->

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<style lang="scss" scoped></style>
