import { h, Component } from 'preact';
import Hammer from 'hammerjs';


export class Swipe extends Component {

  componentDidMount() {
    // console.log('ref', this.front)
    this.setupHammer();
  }

  componentDidUpdate() {
    this.setupHammer();
  }

  setupHammer() {
    let { width } = this.front.getBoundingClientRect();
    this.mc = new Hammer(this.front, {
      recognizers: [
        [Hammer.Pan,{ direction: Hammer.DIRECTION_RIGHT }],
      ]
    });

    this.mc.on('panright', (event) =>{
      let {deltaX} = event;
      this.front.style = `transform: translate3d(${deltaX}px, 0, 0)`
    });

    this.mc.on('panend', (event)=>{
      let {deltaX} = event;
      // Check if is valid
      if(deltaX > width/3) {
        this.success(width)
      } else {
        this.fail();
      }
      this.mc.stop();
    })
  }

  componentWillUnmount() {
		if (this.mc) {
			this.mc.stop();
			this.mc.destroy();
		}
		this.mc = null;
  }

  success(width) {
    this.front.style = `transform: translate3d(${width}px,0,0)`;
    this.setState({result:true});
    if(this.props.onSwipeRight) {
      this.props.onSwipeRight();
    }
  }

  fail() {
    this.front.style = 'transform: translate3d(0,0,0)';
    this.setState({result: false});
  }

  render(props, {result}) {
    let [Front, Back] = props.children
    Front.attributes.ref = (r) => this.front = r
    return (
      <div className={props.className}
        style={'transform: ' + (result) ? 'translate3d(100%,0,0)' : ''}>
        {Front}
        {Back}
      </div>
    )
  }

}
