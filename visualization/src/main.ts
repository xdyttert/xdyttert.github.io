import './assets/main.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import { createApp } from 'vue'
import App from './App.vue'
import { makeEdgesLists } from './data/startingGraph'

const app = createApp(App)

app.use(ElementPlus)
app.use(VNetworkGraph)
app.mount("#app")
