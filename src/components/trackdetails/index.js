import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { dataForTrack } from '../../store/selectors';
import * as actions from '../../store/actions';

import { TrackCounter } from '../ui/trackcounter.component';
import { TrackRecord } from '../ui/trackrecord.component';
import { timePipe } from '../ui/tracktime.component';
import Preload from '../ui/Preload';

const mapStoreToProps = (state, props) => {
  return ({
    track: dataForTrack(props.trackId)(state),
    drive: state.drive
  })
}

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

  render({track, style, drive, loginGapi, exportSheet}, state) {
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
          <p>YESTERDAY <span>{ timePipe(track.yesterday) }</span></p>
          <p>WEEK <span>{ timePipe(track.week) }</span></p>
          </div>
        }

        {drive.authState == 'failure' &&
          <div class="stats card" style="text-align:center">
          <p style="border:0px;">Log-in to Gdrive to export your data</p>
          <button onclick={()=>loginGapi(true) }>Log-in</button>
        </div>
        }

        {drive.authState == 'success' &&
          <div class="stats card" style="text-align:center">
          <h3>Export to Google sheets</h3>
          <button onclick={()=>exportSheet(track) } className="btn-preload">
            {drive.exporting && <Preload /> }
            Export Sheet
          </button>
        </div>
        }

        {track.sheetExported &&
          <div class="stats card" style="text-align:center">
            <h3 style="margin-bottom: 10px;">Latest export:
            {(new Date(track.sheetExported).toLocaleString())}
            </h3>
            <a href={track.sheetUrl} target="_blank"
              style="color:#225378">Open sheet</a>
            <br />

          </div>
        }

      </div>
    )
  }

}
