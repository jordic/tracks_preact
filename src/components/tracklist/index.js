import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { homeTracks } from '../../store/selectors';
import * as actions from '../../store/actions';
import AddTrack from '../addtrack';
import Intro from '../intro';
import { TrackCounter } from '../ui/trackcounter.component';
import { TrackRecord } from '../ui/trackrecord.component';
import { Swipe } from '../ui/swipe.reactive';


const mapStoreToProps = (state) => ({
  tracks: homeTracks(state)
})

@connect(mapStoreToProps, actions.mapDispatchToProps)
export default class TrackList extends Component {

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

  delete = (id) => (ev) => {
    this.props.trackDelete(id);
  }

  trackClick = (id) => (ev) => {
    // console.log(e);
    this.props.trackClick(id);
  }

  render({tracks, showAdd, close, style}, state) {
    return (
    <div class="wrap fb" style={style} >
      {showAdd && <AddTrack close={close} /> }
      <div class="track_list">
        { tracks.map(track => (
        <Swipe className="card_ct" onSwipeRight={this.delete(track.id)} key={track.id}>
          <div class="card_main" onclick={ this.trackClick(track.id) }>
            { track.kind == 'counter' &&
              <TrackCounter track={track} click={this.trackCount(track.id)} /> }
            { track.kind == 'timer' &&
              <TrackRecord track={track} start={this.trackStart(track.id)}
                stop={this.trackStop(track.id)} />
            }
          </div>
          <div className="card_down delete">
            <img src="./assets/trash.svg"
              width="24" /> DELETE
          </div>
        </Swipe>
        ))}
      </div>
      { tracks.length==0 && <Intro /> }
    </div>
    )
  }

}
