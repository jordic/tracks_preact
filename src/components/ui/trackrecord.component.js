import { h, Component } from 'preact';

import { ClockItem } from './tracktime.component';
import conf from '../../conf';

export const TrackRecord = ({track, start, stop, remove}) => {
  return (
   <app-track-time>
    <span className="card_icon">
      <img src="assets/timer.svg" />
    </span>
    <h3 className="card_title">
      { track.desc }
      {!conf.IsTouch && <button onclick={remove} className="btn-small">DELETE</button>}
    </h3>
    <app-track-clock class="amount">
      <ClockItem time={track.amount}
        last={track.lastRecord} status={track.state} />
    </app-track-clock>
    <div className="record">
      <app-record-button className="btn">
        {track.state == 'stopped' &&
          <div style="border-radius:50%; transform:scale(1,1)"
            onClick={start}> </div>}
        {track.state == 'recording' &&
          <div style="border-radius:0; transform:scale(0.8,0.8) "
            onClick={stop}> </div>}
      </app-record-button>
    </div>
    <p className="record-start">
      <span>{ track.state=='stopped' ? 'Start' : 'Stop'}</span>
    </p>
    <app-track-clock class="amount today">
      <span>TODAY:&nbsp;
      <ClockItem time={track.today}
        last={track.lastRecord} status={track.state} />
      </span>
    </app-track-clock>
   </app-track-time>
  )
}
