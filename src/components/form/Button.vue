<template>
  <button class="button" @click="$emit('buttonClick')" aria-label="button">
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<style lang="scss">
.button {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background: var(--color-primary-blue2);
  color: var(--color-foreground3);
  font-family: inherit;
  transition:
    background 0.3s,
    box-shadow 0.3s,
    transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: var(--color-primary-blue3);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: var(--color-primary-blue1);
    transform: scale(0.97);
  }

  &:disabled {
    background: rgba(0, 0, 0, 0.1);
    color: var(--color-foreground2);
    cursor: not-allowed;

    .button-content {
      color: inherit;
    }
  }
}
</style>
