import { h, Component} from 'preact';



export default function Intro(props, state) {


  return (
    <div class="card intro">
      <img src="assets/logo.svg" height="80" />
      <h2>START TRACKING</h2>
      <hr />
      <div class="item">
        <img src="assets/timer.svg" width="50" />
        <p>Track time spent doing things</p>
      </div>
      <div class="item">
        <img src="assets/counter.svg" width="50" />
        <p>Count events</p>
      </div>
    </div>
  )

}
