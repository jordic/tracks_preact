import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';

import Header from './header';
import Home from './home';
import Fab from './ui/fab.component';
import AddTrack from './addtrack';
import TrackList from './tracklist';

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  clickMenu = e => {
    this.setState({showAdd: true})
  };

  closeMenu = e => {
    this.setState({showAdd: false})
  }

  render(props, {showAdd}) {
    return (
     <div id="app">
      <Header />
      <div class="wrap fb">
        {showAdd && <AddTrack close={this.closeMenu} /> }
        <TrackList />
      </div>
        {!showAdd && <Fab click={this.clickMenu} /> }
     </div>
    );
  }
}
