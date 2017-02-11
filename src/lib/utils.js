


export const dRaf = (fn) => requestAnimationFrame(
  () => requestAnimationFrame(fn));


export const requestIdle = window.requestIdleCallback || setTimeout;


