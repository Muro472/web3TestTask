import { RouteRecordRaw } from 'vue-router';
import { RouterLinks } from 'src/utils/enums/RouterLinks';
import { RouterNames } from 'src/utils/enums/RouterNames';

const routes: RouteRecordRaw[] = [
  {
    path: RouterLinks.HOME_PAGE,
    name: RouterNames.HOME_PAGE,
    component: () => import('src/pages/RootStack/HomePage.vue'),
  },
  {
    path: RouterLinks.TRANSACTIONS_PAGE,
    name: RouterNames.TRANSACTIONS_PAGE,
    component: () => import('src/pages/RootStack/TransactionsPage.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
