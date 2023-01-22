<template>
  <div class="container p-3" style="width: 380px">
    <nav class="navbar p-0">
      <div class="container-fluid p-0">
        <a class="navbar-brand p-0">
          <b>Teto</b> - settings
        </a>
      </div>
    </nav>
    <hr>
    <p>Reload pages after enable/disable extension</p>
    <div class="row gap-2">
      <div v-if="!extensionDisabled" class="btn-group-vertical" role="group">
        <button class="btn btn-outline-secondary" @click="disableExtension(0)">Disable</button>
        <button class="btn btn-outline-secondary" @click="disableExtension(1)">Disable for one hour</button>
        <button class="btn btn-outline-secondary" @click="disableExtension(2)">Disable for one day</button>
        <button class="btn btn-outline-secondary" @click="disableExtension(3)">Disable for a week</button>
      </div>
      <div v-else class="btn-group-vertical" role="group">
        <button class="btn btn-primary" @click="enableExtension">Enable</button>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'

export default {
  name: 'popupView',
  data() {
    return {
      msg: 'popup',
      extensionDisabled: false
    }
  },
  methods: {
    disableExtension(unit) {
      let now = new Date();
      let futureTime;
      switch (unit) {
        case 1:
          futureTime = new Date(now.getTime() + (60 * 60 * 1000));
          break;
        case 2:
          futureTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 3:
          futureTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
          break;
        default:
          futureTime = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      }
      chrome.storage.local.set({ key: JSON.stringify(futureTime) }).then(() => {
        this.extensionDisabled = true
        console.log("Value is set to " + JSON.stringify(futureTime));
      });
    },
    enableExtension() {
      chrome.storage.local.remove(["key"])
      this.extensionDisabled = false
    },
    isDisabled() {
      chrome.storage.local.get(["key"]).then((result) => {
        if (result.key)
          this.extensionDisabled = JSON.parse(result.key)
        console.log(result.key);
      });
    }
  },
  mounted() {
    this.isDisabled()
  }
}

</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Montserrat';
  src: url('~@/assets/Montserrat.ttf') format('truetype');
}

.container {
  font-family: 'Monsterrat', sans-serif;
}

//.main_app {
//  font-family: 'Monsterrat', sans-serif;
//  -webkit-font-smoothing: antialiased;
//  -moz-osx-font-smoothing: grayscale;
//  text-align: center;
//  color: #2c3e50;
//  margin-top: 60px;
//}
</style>
