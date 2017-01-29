import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { dataForTrack } from '../../store/selectors';
import * as actions from '../../store/actions';

import { TrackCounter } from '../ui/trackcounter.component';
import { TrackRecord } from '../ui/trackrecord.component';
import { timePipe } from '../ui/tracktime.component';

const mapStoreToProps = (state, props) => ({
  track: dataForTrack(props.trackId)(state)
})

@connect(mapStoreToProps, actions.mapDispatchToProps)
export default class TrackDetails extends Component {

  trackCount = (id) => (ev) => {
    //alert('click', id);
    this.props.trackCount(id);
    ev.stopPropagation();
  }

  trackStart = (id) => (ev) => {
    this.props.trackStart(id);
    ev.stopPropagation();

  }

  trackStop = (id) => (ev) => {
    this.props.trackStop(id);
    ev.stopPropagation();

  }

  render({track, style}, state) {
    return (
      <div className="wrap fb" style={style}>
        <div class="card interior">
          { track.kind == 'counter' &&
              <TrackCounter track={track} click={this.trackCount(track.id)} /> }
          { track.kind == 'timer' &&
            <TrackRecord track={track} start={this.trackStart(track.id)}
              stop={this.trackStop(track.id)} />
          }
        </div>

        {track.kind == 'counter' && <div className="stats card table">
          <p>TODAY <span>{ track.today }</span></p>
          <p>YESTERDAY <span>{ track.yesterday }</span></p>
          <p>WEEK <span>{ track.week }</span></p>
          </div>
        }

        {track.kind == 'timer' && <div className="stats card table">
          <p>TODAY <span>{ timePipe(track.today) }</span></p>
          <p>YESTERDAY <span>{ timePipe(track.yesterda) }</span></p>
          <p>WEEK <span>{ timePipe(track.week) }</span></p>
          </div>
        }

      </div>
    )
  }

}
