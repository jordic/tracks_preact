import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { homeTracks } from '../../store/selectors';
import * as actions from '../../store/actions';
import { TrackCounter } from '../ui/trackcounter.component';
import { TrackRecord } from '../ui/trackrecord.component';
import SwipeToDelete from '../ui/swipedelete';


const mapStoreToProps = (state) => ({
  tracks: homeTracks(state)
})

const mapDispatchToProps = (dispatch) => ({
  trackClick(id) {
    dispatch(actions.trackCount(id));
  },
  trackStart(id) {
    dispatch(actions.trackStart(id));
  },
  trackStop(id) {
    dispatch(actions.trackStop(id));
  }
})

@connect(mapStoreToProps, mapDispatchToProps)
export default class TrackList extends Component {

  trackClick = (id) => (ev) => {
    //alert('click', id);
    this.props.trackClick(id);
  }

  trackStart = (id) => (ev) => {
    this.props.trackStart(id);
  }

  trackStop = (id) => (ev) => {
    this.props.trackStop(id);
  }



  render({tracks}, state) {
    return (
      <div class="track_list">
        { tracks.map(track => (
        <SwipeToDelete className="card_ct">
          <div className="card_main">
            { track.kind == 'counter' &&
              <TrackCounter track={track} click={this.trackClick(track.id)} /> }
            { track.kind == 'timer' &&
              <TrackRecord track={track} start={this.trackStart(track.id)}
                stop={this.trackStop(track.id)} />
            }
          </div>
          <div className="card_down delete">
            DELETE
          </div>
        </SwipeToDelete>
        ))}
      </div>
    )
  }

}
