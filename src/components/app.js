import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { connect } from 'preact-redux';


import * as actions from '../store/actions';


import Header from './header';
import Fab from './ui/fab.component';
import AddTrack from './addtrack';
import TrackList from './tracklist';
import TrackDetails from './trackdetails';
import NewsModal from './ui/NewsModal';

const win = window || undefined;

// take current url

const mapStoreToProps = (state, props) => ({
  app: state.app,
  drive: state.drive
});


@connect(mapStoreToProps, actions.mapDispatchToProps)
export default class App extends Component {

  constructor(props) {
    super(props);
    if (win) {
      this.navigate(win);
      win.addEventListener('popstate', () => {
        this.navigate(win);
      });
    }

  }

  state = {
    showAdd: false,
    showTrack: false,
    showModal: true,
    trackId: ''
  }

  navigate(win) {
    if (win.location.pathname.indexOf('/tracks/') === 0) {
      let id = win.location.pathname.replace("/tracks/", "");
      if (id) {
        this.trackDetails(id);
        return;
      }
    }
    this.gotoHome();
  }

  componentDidMount() {
    // console.log(this.context);
    this.store = this.context.store;
    // let st = this.store.getState().select()
  }

  setUrl = (url, title='Tracks') => {
    if (win && url !== win.location.pathname){
      history.pushState({}, title, url);
    }
  }

  showAdd = e => {
    this.setState({showAdd: true});
  };

  closeAdd = e => {
    this.setState({showAdd: false});
  }

  trackDetails = (id) => {
    this.setUrl('/tracks/'+id);
    this.setState({
      showAdd: false,
      showTrack: true,
      trackId: id
    });
  }

  gotoHome = (ev) => {
    this.setUrl('/');
    this.setState({
      showTrack: false,
      showAdd: false
    });
  }

  getStyle = (el, track) => {
    if (el === 'list') {
      let pos = (track) ? '-100%' : '0';
      return `transform: translate3d(${pos},0,0);`;
    }
    let p = (track) ? '0' : '100%';
    return `transform: translate3d(${p},0,0);`;
  }

  render({drive, app, hideNews}, {showAdd, showTrack, trackId, showModal}) {
    return (
     <div id="app">
      {app.notifyNews &&  <NewsModal onClose={hideNews} /> }
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
