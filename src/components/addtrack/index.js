import {h, Component } from 'preact';

import style from './style';
import * as actions from '../../store/actions';

const dRaf = (fn) => requestAnimationFrame(
  () => requestAnimationFrame(fn));

export default class AddTrack extends Component {

  constructor(props) {
    super(props);
    this.state = {
      kind: 'counter',
      acss: '',
    }
  }

  setType(e) {
    this.setState({kind: e});
  }

  setTimer = () => this.setType('timer');
  setCounter = () => this.setType('counter');

  componentDidMount() {
    this.Input.focus();
    dRaf(() =>{
      this.setState({acss: 'in'})
    })
  }

  onKeyPress = (event) => {
    if(event.keyCode == 13) {
      this.addAction();
    }
  }

  close() {
    dRaf(() => {
      this.setState({acss: ''});
      setTimeout(this.props.close, 200);
    })
  }

  addAction() {
    // console.log('context', this.context, this);
    if (this.Input.value.length < 2) {
      this.Input.focus();
      return;
    }

    let store = this.context.store;
    store.dispatch(actions.addTrack({
      kind: this.state.kind,
      desc: this.Input.value
    }));
    // components are recycled... clean it..
    this.Input.value = '';
    // this.props.close();
    this.close();
  }

  render(props, {kind, acss}) {
    return (
      <div className={ 'card addTrack ' + (acss || '')}>
        <div class="close" onClick={this.close.bind(this)} >
          <img src="assets/close.svg" />
        </div>

      <h2>ADD A NEW TRACK</h2>

      <input name="desc" type="text"
        ref={(input) => this.Input = input }
        onKeyPress={this.onKeyPress}
        placeholder="Add your track title" />

      <div className="kind">
        <div
          className={'ele ' + (kind=='counter' ? 'enabled' : '')}
          onClick={ this.setCounter  }>
          <img src="./assets/counter.svg" />
          <label>Counter</label>
        </div>
        <div
          className={'ele ' + (kind=='timer' ? 'enabled' : '')}
          onClick={ this.setTimer }>
          <img src="./assets/timer.svg" />
          <label>Timer</label>
        </div>
      </div>
      <button onClick={this.addAction.bind(this)}>ADD</button>
    </div>
    )
  }
}
