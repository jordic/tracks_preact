
import {now, today, yesterday, week, day} from './selectors';

import * as actions from './actions';

const randHour = () => Math.round(Math.random()*3600) * 1000;
const randHourDay = () => randHour()*24;

export default function generateData(trackId, store) {

  for(let i=0; i<500; i++) {

    let inc = Math.round(i/20);
    let start = now() - (inc * day) + randHourDay()
    store.dispatch(actions.trackStart(trackId, start))
    store.dispatch(actions.trackStop(trackId, (start + randHour())))

  }


}
