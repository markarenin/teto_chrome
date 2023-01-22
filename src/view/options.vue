<template>
  <h2 v-if="user">signed user: {{ user }}</h2>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'

export default {
  name: 'optionsView',
  data() {
    return {
      user: '',
    }
  },
  methods: {
    signInByGoogleAuth(response) {
      console.log(response)
    }
  },
}


</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Montserrat';
  src: url('~@/assets/Montserrat.ttf') format('truetype');
}

.main_app {
  font-family: 'Monsterrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
