import { createTimeline, stagger } from 'animejs';

const tl = createTimeline({ defaults: { ease: 'out(4)' } });

const obj1 = { opacity: 0 };
const obj2 = { opacity: 0 };

tl.add(obj1, {
  opacity: [0, 1],
  duration: 500,
  onBegin: () => console.log("onBegin fired for obj1"),
  onComplete: () => console.log("onComplete fired for obj1"),
})
.add(obj2, {
  opacity: [0, 1],
  duration: 500,
  onBegin: () => console.log("onBegin fired for obj2"),
}, "-=200");

setTimeout(() => {
  console.log("obj1:", obj1.opacity, "obj2:", obj2.opacity);
}, 1500);
