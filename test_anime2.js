import { createTimeline, stagger } from 'animejs';

let ticked = false;
const tl = createTimeline({
  defaults: {
    ease: "out(4)",
  },
  onUpdate: () => { ticked = true; }
});

const obj1 = { opacity: 0 };
const obj2 = { opacity: 0 };
const obj3 = { opacity: 0 };

tl.add(obj1, {
  opacity: [0, 1],
  duration: 1200,
})
.add(obj2, {
  opacity: [0, 1],
  duration: 800
}, "-=600")
.add(obj3, {
  opacity: [0, 1],
  duration: 800
}, "-=600");

setTimeout(() => {
  console.log("obj1:", obj1.opacity, "obj2:", obj2.opacity, "obj3:", obj3.opacity);
}, 2500);
