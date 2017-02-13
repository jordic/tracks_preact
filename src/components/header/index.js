import { h, Component } from 'preact';

import { connect } from 'preact-redux';
import { mapDispatchToProps } from '../../store/actions'

import Sync from '../ui/Sync';


const stateToProps = (state) =>
  ({
    drive: state.drive
  })

@connect(stateToProps, mapDispatchToProps)
export default class Header extends Component {

  render(props) {

    let back = ""
    if(props.header) {
      back = (
        <div className="back" onclick={props.back}>
          <img src="assets/arrow.svg" alt="Left arrow" />
        </div>
      )
    }
    let cl = '';
    if(props.drive.syncing) {
      cl = 'header__reload_anim';
    }

    return (
      <header>
        <h1>Tracks</h1>
        {back}
        {props.drive.authState === 'success' &&
          <button className="header__reload" onclick={props.syncStore}>
              <Sync className={cl} />
          </button>
        }
      </header>
    );
  }
}


