<script setup lang="ts">
import TextField from "@/components/form/TextField.vue";
import Button from "@/components/form/Button.vue";
import { ref, inject } from "vue";

const { updateWatchList } = inject("watchList") as {
  updateWatchList: (isin: string) => void;
};

const isin = ref("");

const onSubmit = () => {
  console.log(isin.value);
  updateWatchList(isin.value);
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <TextField v-model="isin" placeholder="Placeholder" />
    <Button>Watch</Button>
  </form>
</template>
