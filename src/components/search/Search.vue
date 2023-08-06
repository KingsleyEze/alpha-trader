<script setup lang="ts">
import TextField from "@/components/form/TextField.vue";
import Button from "@/components/form/Button.vue";
import { ref, inject } from "vue";

const { addStockToWatchList } = inject("watchList") as {
  addStockToWatchList: (isin: string) => void;
};

const isin = ref("");

const onSubmit = () => {
  addStockToWatchList(isin.value);
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="watch-form">
    <TextField v-model="isin" placeholder="Enter ISIN" class="watch-input" />
    <div class="button-wrapper">
      <Button class="watch-button">Watch</Button>
    </div>
  </form>
</template>

<style lang="scss">
.watch-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  max-width: 600px;
  width: 100%;
}

.watch-input {
  width: 100%;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.watch-button {
  cursor: pointer;
}
</style>
