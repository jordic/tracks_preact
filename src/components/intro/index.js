import { h, Component} from 'preact';



export default function Intro(props, state) {

  return (
    <div class="card intro" style="padding-top: 40px;">
      <img src="assets/logo.svg" height="80" />
      <h2>START TRACKING</h2>
      <hr />
      <div class="item">
        <img src="assets/timer.svg" width="50"  alt="Timer icon" />
        <p>Track time spent doing things</p>
      </div>
      <div class="item">
        <img src="assets/counter.svg" width="50"  alt="Counter Icon" />
        <p>Count events</p>
      </div>
      <div class="item">
        <img src="assets/drive.svg" width="50" alt="Gdrive icon" />
        <p>Sync and Export to Google Drive</p>
      </div>
    </div>
  );

}
