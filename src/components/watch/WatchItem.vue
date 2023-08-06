<script setup lang="ts">
import Card from "@/components/common/Card.vue";
import Button from "@/components/form/Button.vue";
import { inject } from "vue";

interface WatchItemProps {
  isin: string;
  price: number;
  bid?: number;
  ask?: number;
}
const { isin, price } = defineProps<WatchItemProps>();

const { removeStockFromWatchList } = inject("watchList") as {
  removeStockFromWatchList: (isin: string) => void;
};
</script>
<template>
  <div class="watch-item-container">
    <Card class="watch-item">
      <div class="watch-item-header">
        <h3 class="watch-item-title">{{ isin }}</h3>
      </div>
      <div class="watch-item-info">
        <div class="info-item">
          <span class="label">Price:</span>
          <span class="value">{{ price }}</span>
        </div>
        <div class="info-item">
          <span class="label">Bid:</span>
          <span class="value">{{ bid }}</span>
        </div>
        <div class="info-item">
          <span class="label">Ask:</span>
          <span class="value">{{ ask }}</span>
        </div>
      </div>
      <div class="watch-item-actions">
        <Button @click="removeStockFromWatchList(isin)">Unsubscribe</Button>
      </div>
    </Card>
  </div>
</template>

<style lang="scss">
.watch-item-container {
  padding: 1rem;
  background-color: var(--color-background2);
  border-radius: 8px;

  @media (max-width: var(--max-width-mobile)) {
    padding: 0.5rem;
  }
}

.watch-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-regular);

  @media (max-width: var(--max-width-mobile)) {
    gap: 0.5rem;
  }
}

.watch-item-header {
  width: 100%;
  text-align: center;
  background-color: var(--color-background4);
  padding: 0.5rem;
  border-radius: 8px;
}

.watch-item-title {
  font-size: 1.5rem;
  font-family: var(--font-bold);
  color: var(--color-primary-blue3);
}

.watch-item-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--color-background3);
  padding: 0.5rem;
  border-radius: 8px;
  width: 200px;
  justify-content: space-between;

  .label {
    font-size: 1rem;
    font-family: var(--font-medium);
    color: var(--color-foreground2);
    margin-right: 0.5rem;
  }

  .value {
    font-size: 1rem;
    font-family: var(--font-regular);
    color: var(--color-foreground3);
  }
}

.watch-item-actions {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: var(--max-width-mobile)) {
  .watch-item-info {
    flex-direction: column;
  }

  .info-item {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
