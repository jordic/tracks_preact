import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';

import Header from './header';
import Fab from './ui/fab.component';
import AddTrack from './addtrack';
import TrackList from './tracklist';
import TrackDetails from './trackdetails';

export default class App extends Component {


  showAdd = e => {
    this.setState({showAdd: true})
  };

  closeAdd = e => {
    this.setState({showAdd: false})
  }

  trackDetails = (id) => {
    this.setState({
      showAdd: false,
      showTrack: true,
      trackId: id
    })
  }

  gotoHome = (ev) => {
    this.setState({
      showTrack: false,
      showAdd: false,
    })
  }

  getStyle = (el, track) => {
    if(el == 'list') {
      let pos = (track) ? '-100%' : '0';
      return `transform: translate3d(${pos},0,0);`;
    }
    let p = (track) ? '0' : '100%';
    return `transform: translate3d(${p},0,0);`;
  }

  render(props, {showAdd, showTrack, trackId}) {
    return (
     <div id="app">
      <Header header={showTrack} back={this.gotoHome} />
      <TrackList
          close={this.closeAdd}
          showAdd={showAdd}
          trackClick={this.trackDetails}
          style={this.getStyle('list', showTrack)} />

      <TrackDetails trackId={trackId}
          style={this.getStyle('detail', showTrack)} />

      {!showAdd && !showTrack && <Fab click={this.showAdd} /> }
     </div>
    );
  }
}
