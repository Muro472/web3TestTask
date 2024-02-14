<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="rootStack-header">
      <slot name="header" />
    </q-header>

    <q-page-container>
      <q-page>
        <slot name="page" />

        <q-page-scroller
          position="bottom-right"
          :scroll-offset="150"
          :offset="[18, 18]"
        >
          <q-btn fab icon="keyboard_arrow_up" color="accent" />
        </q-page-scroller>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss"></style>
