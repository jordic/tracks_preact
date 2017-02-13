import { h, Component } from 'preact';

import { connect } from 'preact-redux';
import { mapDispatchToProps } from '../../store/actions'

const stateToProps = (state) =>
  ({
    drive: state.drive
  })



@connect(stateToProps, mapDispatchToProps)
export default class Header extends Component {

  render(props) {

    console.log(props)

    let back = ""
    if(props.header) {
      back = (
        <div className="back" onclick={props.back}>
          <img src="assets/arrow.svg" alt="Left arrow" />
        </div>
      )
    }

    return (
      <header>
        <h1>Tracks</h1>
        {back}
        {props.drive.authState === 'success' &&
          <button className="reload" onclick={props.syncStore}>
            sync
          </button>
        }
      </header>
    );
  }
}


