<template>
  <router-view />
</template>



<style lang="scss">
html {
  width: 100%;
  height: 100%;
}

body {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Lato', sans-serif;
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #8dd0ba;
    }
  }
}
</style>
