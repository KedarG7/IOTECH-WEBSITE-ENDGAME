import { animate } from 'animejs';

// Test 1: animate a plain object property
const obj = { val: 0 };
animate(obj, {
  val: 25,
  duration: 500,
  ease: 'out(4)',
  onUpdate: () => {
    process.stdout.write(`\rval = ${Math.round(obj.val)}`);
  }
});

setTimeout(() => {
  console.log(`\nFinal val = ${obj.val}`);
}, 800);
