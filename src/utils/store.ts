import { dijkstra } from "@/algorithms/dijkstra";
import { reactive } from "vue";

export const showPertinent = reactive({
  in: false,
  out: false
});

export const animate = reactive({
  dijkstra: false,
  spira: false,
  zwick: false
})

export interface Animate {
  dijkstra: boolean,
  spira: boolean,
  zwick: boolean
}