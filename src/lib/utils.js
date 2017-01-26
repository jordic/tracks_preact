


export const dRaf = (fn) => requestAnimationFrame(
  () => requestAnimationFrame(fn));
