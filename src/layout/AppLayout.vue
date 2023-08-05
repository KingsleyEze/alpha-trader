<template>
  <div class="app-layout">
    <slot name="header" />
    <slot name="content" />
  </div>
</template>
<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
