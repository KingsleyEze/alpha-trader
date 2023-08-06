<script setup lang="ts">
import { defineProps } from "vue";
import Card from "@/components/common/Card.vue";
interface WatchItemProps {
  isin: string;
  price: number;
}
const { isin, price } = defineProps<WatchItemProps>();
</script>
<template>
  <div>
    <Card>
      <h3>{{ isin }}</h3>
      <p>{{ price }}</p>
    </Card>
  </div>
</template>
