<script setup lang="ts">
import Card from "@/components/common/Card.vue";
import Button from "@/components/form/Button.vue";
import { inject } from "vue";

interface WatchItemProps {
  isin: string;
  price: number;
}
const { isin, price } = defineProps<WatchItemProps>();

const { removeStockFromWatchList } = inject("watchList") as {
  removeStockFromWatchList: (isin: string) => void;
};
</script>
<template>
  <div>
    <Card>
      <h3>{{ isin }}</h3>
      <p>{{ price }}</p>
      <Button @click="removeStockFromWatchList(isin)">Unsubscribe</Button>
    </Card>
  </div>
</template>
