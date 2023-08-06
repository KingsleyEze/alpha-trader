<script setup lang="ts">
import TextField from "../form/TextField.vue";
import Button from "../form/Button.vue";
import { ref, inject } from "vue";

const { addStockToWatchList, isIsinInWatchList } = inject("watchList") as {
  addStockToWatchList: (isin: string) => void;
  isIsinInWatchList: (isin: string) => boolean;
};

const isin = ref("");
const error = ref("");

const isValidISIN = (isin: string) => {
  const pattern = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/;
  return pattern.test(isin);
};

const onSubmit = () => {
  if (!isin.value) {
    error.value = "ISIN cannot be empty";
    return;
  }

  if (!isValidISIN(isin.value)) {
    error.value = "Invalid ISIN format";
    return;
  }

  if (isIsinInWatchList(isin.value)) {
    error.value = "ISIN already added to the watch list";
    return;
  }

  try {
    addStockToWatchList(isin.value);
    error.value = "";
    isin.value = "";
  } catch (e) {
    error.value = "Error adding ISIN to watch list";
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="watch-form">
    <TextField v-model="isin" placeholder="Enter ISIN" class="watch-input" />
    <div v-if="error" class="error-message">{{ error }}</div>
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
.error-message {
  color: var(--color-primary-red2);
  font-size: 0.9em;
  margin: 5px 0;
  width: 100%;
  text-align: center;
}
</style>
