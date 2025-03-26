import { reactive, ref } from "vue";

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

export const ZwickConstants = reactive({
  M: Infinity
})