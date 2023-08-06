<template>
  <div v-if="isVisible" class="alert">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const isVisible = ref(false);
const defaultMessage =
  "Websocket disconnected. Data might not be up-to-date and the current price might not be accurate.";
const message = ref(defaultMessage);

watch(
  () => props.status,
  (newStatus) => {
    isVisible.value =
      newStatus === "disconnected" || newStatus === "reconnecting";
  },
);
</script>

<style scoped lang="scss">
.alert {
  font-family: var(--font-bold);
  background-color: var(--color-primary-red2);
  color: var(--color-foreground3);
  padding: 15px;
  text-align: center;
  border-radius: 4px;
  margin: 20px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
