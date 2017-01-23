import { h, Component } from 'preact';


export const TrackCounter = ({track, click}) => {

  return (
  <app-track-counter>
    <span className="card_icon">
      <img src="assets/counter.svg" />
    </span>
    <h3 className="card_title">{ track.desc }</h3>
    <span className="amount">{ track.amount }</span>

    <div class="record">
      <div className="btn_small" onClick={click}>
        <img src="assets/plus.svg" />
      </div>
    </div>
    <p class="record-start">
      <span>Track</span>
    </p>
    <div class="amount today">
      <span>TODAY: { track.today }</span>
    </div>
  </app-track-counter>
  );
}
