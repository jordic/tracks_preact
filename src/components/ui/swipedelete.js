
import {h, Component} from 'preact';
import Hammer from 'hammerjs';


export default class SwipeToDelete extends Component {

  displayName = 'SwipeToDelete'

  constructor(props) {
    super(props);
    console.log('props:', props);
  }

  componentDidMount() {
    console.log("Element ref", this.baseElement);
  }

  render(props, state) {
    let Main = props.children[0];
    let Back = props.children[1];

    Main.attributes.ref = (r) => {
      console.log(r);
      this.baseElement = r
    }

    return (
      <div className={props.className}>
        { Main }
        { Back }
      </div>
    )
  }


}
