import { createApp } from 'vue'
import App from '../view/content.vue'

let inlineBlock = document.createElement("div");
inlineBlock.setAttribute('id', 'vueidatta')
inlineBlock.style.cssText += "all:initial"

console.log("CONTENT JS LOADED")

window.onload = () => {
    document.body.append(inlineBlock)
    createApp(App).mount("#vueidatta")
}
