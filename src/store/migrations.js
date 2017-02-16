
/**
 * migratesStore, adding new log actions, to track
 * track creations.
 *
 * With this property, tracks can be syncronized
 */

export function migrateStore(state) {

  let i = 1;
  // look for missing track events
  let without = withoutAction(state);
  let time = firstTime(state) - 30000;

  let logs = [],
      entities = {};

  without.map(a => {
    let act = action(a, time, i++)
    logs.push(act);
    entities = {
      [act.id]: act
    }
  });

  return Object.assign({}, state, {
    logs: [...logs, ...state.logs],
    logsEntities: Object.assign({}, state.logsEntities, entities)
  })
}


export function withoutAction(state) {
  const tracks = state.tracks;
  let already = state.logs
    .map(l => state.logsEntities[l])
    .filter(l => l.action === 'track_add')
    .map(l => l.trackId);

  return tracks.filter(a => !already.includes(a))
}


const firstTime = (state) => {
  return state.logsEntities[state.logs[0]].time;
}


const action = (trackId, time, i) => ({
  id: '' + time + '-' + i,
  action: 'track_add',
  trackId,
  time,
  amount: 0
})
