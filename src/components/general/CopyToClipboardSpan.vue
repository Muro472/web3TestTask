<script setup lang="ts">
import copy from 'copy-text-to-clipboard';
import { defineProps, ref } from 'vue';

const props = defineProps<{
  text: string;
  showText?: string;
}>();

let tooltip = ref('Copy to clipboard');

const copyClick = async () => {
  copy(props.text);
  tooltip.value = 'Copied!';
  setTimeout(() => {
    tooltip.value = 'Copy to clipboard';
  }, 5000);
};
</script>

<template>
  <span @click="copyClick" style="cursor: pointer">
    {{ showText ? showText : text }}

    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
      {{ tooltip }}
    </q-tooltip>
  </span>
</template>
