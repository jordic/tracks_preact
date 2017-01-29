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
    console.log('called?')
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

  render(props, {showAdd, showTrack, trackId}) {
    return (
     <div id="app">
      <Header header={showTrack} back={this.gotoHome} />
      {!showTrack && <TrackList
          close={this.closeAdd}
          showAdd={showAdd}
          trackClick={this.trackDetails}  />
      }
      {showTrack &&
        <TrackDetails trackId={trackId} />
      }
      {!showAdd && <Fab click={this.showAdd} /> }
     </div>
    );
  }
}
