import './assets/main.css'

import { createApp } from 'vue'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import App from './App.vue'
import { makeEdgesLists } from './data/data'

const app = createApp(App)
makeEdgesLists()

app.use(VNetworkGraph)
app.mount("#app")
