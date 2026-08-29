import { createTimeline, stagger } from 'animejs';

let ticked = false;
const tl = createTimeline({
  defaults: {
    ease: "out(4)",
  },
  onUpdate: () => { ticked = true; }
});

tl.add({}, {
  opacity: [0, 1],
  duration: 100,
});

setTimeout(() => {
  console.log("Timeline ticked:", ticked);
}, 200);
