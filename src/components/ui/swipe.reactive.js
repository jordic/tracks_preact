import { h, Component } from 'preact';

import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/takeUntil';



const coords = (ev) => {
  return {
    x: ev.touches[0].clientX,
    y: ev.touches[0].clientY
  };
};

const treshold = (x, y) => (e) => {
  return e.touches[0].clientX - x < 20 || x < 0;
};

const vtreshold = (y) => (e) => {
  return Math.abs(e.touches[0].clientY - y) < 50;
};

const stream$ = (el, effect) => {
  const start$ = fromEvent(el, 'touchstart');
  const move$ = fromEvent(el, 'touchmove');
  const end$ = fromEvent(el, 'touchend');

  return start$
    .map(coords)
    .mergeMap(({x, y}) => move$
      .skipWhile(treshold(x, y))
      .takeWhile(vtreshold(y))
      .takeUntil(end$)
      .map((e) => e.touches[0].clientX - x)
      .do(yy => effect(yy))
      .takeLast(1)
    );
};



export class Swipe extends Component {

  componentDidMount() {
    let { width } = this.front.getBoundingClientRect();
    const move = (x) => {
      this.front.style.left = x + 'px';
    }

    this.stream$ = stream$(this.front, move);
    this.subs = this.stream$.subscribe((x) => {
      if (x > (width/2)) {
        this.success(width);
      } else {
        this.fail();
      }
    });

  }

  componentWillUnmount() {
    this.front.setAttribute('style', '');
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  success(width) {

    this.front.style.left = `${width}px`;
    this.setState({success: true});
    this.forceUpdate();

    if(this.props.onSwipeRight) {
      setTimeout(() => {
        this.props.onSwipeRight();
        this.front.style = '';
      }, 310);
    }
  }

  fail() {
    this.front.setAttribute('style', '');
  }


  render(props, {success}) {
    let [Front, Back] = props.children
    Front.attributes.ref = (r) => this.front = r
    let css = (success) ? ' remove' : '';
    return (
      <div className={props.className + css}>
        {Front}
        {Back}
      </div>
    )
  }

}
