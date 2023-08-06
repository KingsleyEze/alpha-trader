<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="text-field"
    aria-label="text-field"
  />
</template>

<style lang="scss">
.text-field {
  width: 100%;
  max-width: var(--max-width);
  padding: 12px 16px;
  border: none;
  border-bottom: 2px solid var(--color-foreground1);
  background: transparent;
  color: var(--color-foreground3);
  font-family: inherit;
  transition: border-color 0.3s;

  &:hover {
    border-bottom-color: var(--color-primary-blue2);
  }

  &:focus {
    outline: none;
    border-bottom-color: var(--color-primary-blue3);
  }

  &:invalid {
    border-bottom-color: var(--color-primary-red2);
  }

  @media (max-width: var(--max-width-tablet)) {
    padding: 10px 14px;
  }

  @media (max-width: var(--max-width-mobile)) {
    padding: 8px 12px;
  }
}
</style>
