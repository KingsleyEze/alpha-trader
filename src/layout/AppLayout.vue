<template>
  <div class="main">
    <slot name="header" />
    <slot name="content" />
  </div>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding: 20vh 2%;
  max-width: var(--max-width);
  width: 80%;
  margin: 0 auto;

  @media (max-width: var(--max-width-tablet)) {
    padding-top: 15vh;
    padding-left: 10px;
    padding-right: 10px;
  }

  @media (max-width: var(--max-width-mobile)) {
    padding-top: 10vh;
    padding-left: 5px;
    padding-right: 5px;
    width: 95%;
  }
}
</style>
