import { createApp } from 'vue'
import App from '../view/content.vue'

let inlineBlock = document.createElement("div");
inlineBlock.setAttribute('id', 'vueidatta')
inlineBlock.style.cssText += "all:initial"

const app = createApp(App)

window.onload = () => {
    document.body.append(inlineBlock)
    chrome.storage.local.get(["key"]).then((result) => {
        if (!result.key)
            app.mount("#vueidatta")
        else {
            let now = new Date()
            const dateValue = JSON.parse(result.key)
            if (dateValue.getTime() > now.getTime()) {
                chrome.storage.local.remove(["key"])
            }
        }
    });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'key'){
            if (newValue) {
                app.unmount()
                console.log("UMOUNTED")
            } else {
                // app.unmount()
                app.mount("#vueidatta")
                console.log("MOUNTED")
            }
        }
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
});

console.log("CONTENT JS LOADED")