<template>
  <div style="">
  <div v-show="state === 'found'" id="pop" ref="pop" class="main size-found custom-font" role="tooltip">
    <div style="display: flex; justify-content: space-between">
      <div id="col1" style="">
        <p style="height: 30px">{{ wordObject?.lemma }}</p>
        <div
            style="max-height: 56px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
          {{ wordObject?.meanings.join('\n') }}
        </div>
      </div>
      <div id="col2" style="display: flex">
        <p>Y </p>
        <p @click="state='null'"> X</p>
      </div>
    </div>
    <div style="min-width: 300px; display: flex; justify-content: space-between">
      <button style="flex: 1" disabled>
        Sõnavormid
      </button>
      <button style="flex: 1" disabled>
        Näited
      </button>
      <button style="flex: 1"><a :href="`https://sonaveeb.ee/search/unif/dlall/dsall/${wordObject?.lemma}/1`"
                                 target="_blank">
        Sõnaveebis
      </a></button>
    </div>
  </div>
  <div v-show="state === 'loading'" id="pop" class="size-loading">
    <div class="progress-bar">
      <div class="progress-bar-value"></div>
    </div>
  </div>
  <div v-show="state === 'notfound'" id="pop" class="size-loading">
    <hr>
  </div>
</div>
</template>

<script>

import axios from 'axios'

export default {
  name: "content-component",
  data() {
    return {
      state: 'null',
      coordinates: {
        foundHeight: 140,
        foundWidth: 330,
        loadingHeight: 5,
        loadingWidth: 0,
        selectedWordHeight: {
          px: '0px',
          value: 0
        },
        selectedWordWidth: {
          px: '0px',
          value: 0
        }
      },
      timeout: null,
      top: 0,
      toppx: "0",
      left: 0,
      leftpx: "0",
      visible: false,
      selected: document.getSelection(),
      selected_value: null,
      wordObject: null
    }
  },
  methods: {
    new_selection(value) {
      console.log(value.toString())
      this.selected_value = value.toString().trim();
      if (!this.selected_value || this.selected_value.split(' ').length > 3) {
        this.selected = value;
        this.selected_value = null;
        return
      }
      this.selected = value
      const isEstonian = this.checkIsEstonian(value)
      this.state = 'loading'
      this.calculate_position(this.coordinates.selectedWordHeight.value, this.coordinates.selectedWordWidth.value)
      if (isEstonian) {
        this.request_data()
      }
    },
    request_data() {
      this.state = 'loading'
      axios.post(
          `https://api.teto.ee/api/selection_info/`,
          {"selection": this.selected_value}
      ).then((response) => {
        console.log("SUCCESS")
        if (response.data) {
          this.wordObject = response.data?.word_details
          this.state = 'found'
          this.calculate_position(this.coordinates.foundHeight, this.coordinates.foundWidth)
        }
      }).catch(() => {
        this.wordObject = null
        this.state = 'notfound'
      })
    },
    checkIsEstonian(value) {
      if (value.length < 2 || value.length > 30) {
        return false
      }
      const re = /[а-я]|[<>]|[,.0-9]/gmui
      const reg_result = re.exec(value)
      if (reg_result)
        this.state = 'notfound'
      return !reg_result;
    },
    calculate_position(height, width) {
      console.log(`CALCULATING ${height}, ${width}`)
      const selection = this.selected;
      const bounds = selection.getRangeAt(0).getBoundingClientRect()
      // const center = bounds.width / 2
      this.top = (bounds.top -  (this.state !== 'found' ? height-20 : height+15)) + window.top.scrollY
      let leftValue = bounds.width === width ? 0 : width / 2.5
      this.left = bounds.left - leftValue
      // this.left = bounds.left  + "px"
    },
  },
  mounted() {
    console.log("Atta Eesti Keel: EXTENSION MOUNTED")
    document.onselectionchange = () => {
      // console.log(document.getSelection().getRangeAt(0).getBoundingClientRect())
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.coordinates.selectedWordWidth.value = document.getSelection().getRangeAt(0).getBoundingClientRect().width
        this.coordinates.selectedWordWidth.px = this.coordinates.selectedWordWidth.value + "px"
        this.new_selection(document.getSelection())
      }, 700)
    }
  },
  watch: {
    top(newValue) {
      if (this.state === 'found')
        if (newValue <= 0)
        {
          newValue = this.selected.getRangeAt(0).getBoundingClientRect().bottom + 20
        }
      this.toppx = `${newValue}px`
    },
    left(newValue) {
      if (this.state === 'found')
        if (newValue + this.coordinates.foundWidth > window.innerWidth)
          newValue = window.innerWidth - (this.coordinates.foundWidth + 20)
        else if (newValue < 0)
          newValue = 20
      this.leftpx = `${newValue}px`
    },
  }
}

</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Montserrat';
  src: url('~@/assets/Montserrat.ttf') format('truetype');
}
.custom-font {
  font-family: 'Montserrat', sans-serif;
}
.main {
  padding: 10px;
  border-radius: 10px;
  //border: 0.5px solid #000;
  box-shadow: 0 0 15px 2px rgb(0 0 0 / 40%);
  -webkit-box-shadow: 0 0 15px 2px rgb(0 0 0 / 40%);
  -moz-box-shadow: 0 0 15px 2px rgb(0 0 0 / 40%);
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 9999;
}

.size-found {
  width: 330px;
  height: 140px;
}

.size-loading{
  width: v-bind('coordinates.selectedWordWidth.px');
  max-height: 1px;
}

#pop {
  position: absolute;
  left: v-bind(leftpx);
  top: v-bind(toppx);
}


p {
  margin: 0;
}

.progress-bar {
  height: 1px;
  background-color: rgb(180,255,255);
  width: 100%;
  overflow: hidden;
}

.progress-bar-value {
  width: 100%;
  height: 100%;
  background-color: rgb(5, 114, 206);
  animation: indeterminateAnimation .15s infinite linear;
  transform-origin: 0 50%;
}

@keyframes indeterminateAnimation {
  0% {
    transform:  translateX(0) scale(0, 500%);
  }
  40% {
    transform:  translateX(0) scale(0.5, 500%);
  }
  100% {
    transform:  translateX(100%) scale(0.5, 500%);
  }
}
hr {
  margin:0;
  border: none;
  border-top: 1px dashed #f26065;
  height: 1px;
}

button {
  font-size: 100%;
  background: none;
  border: none;
  border-radius: 0;
}
</style>

