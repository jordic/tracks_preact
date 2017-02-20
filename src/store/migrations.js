
/**
 * migratesStore, adding new log actions, to track
 * track creations.
 *
 * With this property, tracks can be replicated across
 * connected diveces on google drive
 */

export function migrateStore(state) {

  // console.log(state);

  let i = 1;
  // look for missing track events
  let without = withoutAction(state);
  let time = firstTime(state) - 30000;

  let logs = [],
    entities = {};

  without.map(a => {
    let act = action(a, time, i++);
    logs.push(act.id);
    entities[act.id] = act;
  });

  // console.log("logs", logs, entities);

  return Object.assign({}, state, {
    logs: [...logs, ...state.logs],
    logsEntities: Object.assign({}, state.logsEntities, entities),
    version: 1
  });
}


const debug = (l) => {
  console.log(l);
  return l;
};

export function withoutAction(state) {
  const tracks = state.tracks;
  let already = state.logs
    .map(l => state.logsEntities[l])
    .filter(l => l && l.action === 'track_add')
    .map(l => l.trackId);

  return tracks.filter(a => !already.includes(a));
}


const firstTime = (state) => {
  let i = 0;
  return state.logsEntities[state.logs[i]].time;
};


const action = (trackId, time, i) => ({
  id: '' + time + '-' + i,
  action: 'track_add',
  trackId,
  time,
  amount: 0
});
