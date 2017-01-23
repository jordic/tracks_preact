import { h, Component } from 'preact';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/timer';


const leadZero = str => (str.length === 1) ? '0' + str : str;

export function timePipe(v) {
	let seconds = leadZero('' + (Math.floor(v / 1000) % 60));
	let minutes = leadZero('' + Math.floor(((v / (60000)) % 60)) );
	let hours = leadZero('' + Math.floor((v / (3600000))));
	return `${hours}:${minutes}:${seconds}`;
}


const current = () => (new Date).getTime();

export class ClockItem extends Component {

  constructor(props) {
    super(props)
    // this.setState({status: props.status})
    // this.start();
  }

  componentWillMount() {
    this.start(this.props);
  }

  start(props) {
    if (props.status === 'stopped') {
      let current = props.time
      this.setState({current});
      if (this.subs) {
        this.subs.unsubscribe();
      }
      return;
    }
    this.subs = Observable
      .timer(0, 1000)
      .startWith(1)
      .map(m => (props.time + (current()) - props.last))
      .subscribe(current =>{
        this.setState({current});
        this.forceUpdate();
    });
  }

  componentWillReceiveProps(props) {
    // console.log('received props:', props);
    // this.setState({status: props.status})
    if (props.status != this.props.status) {
      this.start(props);
    }
  }

  componentDidUnmount() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  render(props, state) {
    return (
        <span>{timePipe(state.current)}</span>
    )
  }


}
