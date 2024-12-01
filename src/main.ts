import './assets/main.css'

import { createApp } from 'vue'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import App from './App.vue'
import data, { makeEdgesLists } from './data/data'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

const app = createApp(App)
makeEdgesLists()

app.use(ElementPlus)
app.use(VNetworkGraph)
app.mount("#app")
