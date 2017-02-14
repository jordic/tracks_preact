
import {SYNC_STORE_OK} from './actions'


export function reducerSyncState(state, action) {

  switch (action.type) {

    case SYNC_STORE_OK: {
      let result = {}
      let {rstate, state} = action.payload;
      if(!rstate.logs) return state;
      let changed = diffLogs(state.logs, rstate.logs);
      let newLogs = getLogs(rstate.logsEntities, changed);

      console.log("state", action.payload, changed, newLogs);
      let {toDelete, toAdd} = getActions(changed, newLogs);
      let localDelete = getLocalDeletes(state.logsEntities);

      // console.log(localDelete, toDelete)
      // remove from add already deleted
      // toAdd = toAdd.filter(k => ![...toDelete, ...localDelete].includes(k));
      console.log('toADd', toAdd);
      localDelete = localDelete.concat(toDelete);
      console.log('local delete', localDelete);

      let tracks = state.tracks.concat(toAdd)
        .filter(t => !localDelete.includes(t));

      let logs = [...state.logs, ...changed]
      let logsEntities = Object.assign(state.logsEntities, newLogs);

      let tracksEntities = {}
      tracks.map(a => {
          tracksEntities[a] = (rstate.tracksEntities[a]) ?
            rstate.tracksEntities[a] : state.tracksEntities[a]
          tracksEntities[a].amount = recalc(logsEntities, tracksEntities[a])
        return a;
      });

      // @TODO recalculate


      result = Object.assign({}, state, {
        tracks,
        tracksEntities,
        logs,
        logsEntities
      })


      // console.log("New tracks", result);
      return result;
    }

  }

  return state;
}


const getLocalDeletes = (state) => {
  return Object.keys(state).filter(k => {
    return state[k].action === 'track_del'
  }).map(k => state[k].trackId);
}


const recalc = (logs, track) => {
  const validCalc = ['track', 'stopped'];
  let amount = 0;
  Object.keys(logs).map(id => {
    if(logs[id].trackId == track.id
      && validCalc.includes(logs[id].action)) {
        amount += logs[id].amount;
      }
  })
  return amount;
}



const getActions = (logs, entities) => {
  let toDelete = [], toAdd = [];
  console.log('actions', logs, entities);
  logs.forEach(v => {
    let log = entities[v];
    if(!log) return;
    switch(log.action) {
      case "track_del": {
        toDelete.push(log.trackId);
      }
      case "track_add": {
        toAdd.push(log.trackId);
      }
    }
  })
  return {toDelete, toAdd};
}


const diffLogs = (local, remote) => {
  if(!remote) return []
  return remote.filter(id => !local.includes(id))
}


const getLogs = (raw, allowed) => Object.keys(raw)
  .filter(key => allowed.includes(key))
  .reduce((obj, key) => {
    obj[key] = raw[key];
    return obj;
  }, {});


// const getDeleted = (state) => {
//   return Object.keys(state.logsEntities)
//     .filter(d => state.logsEntities[d].action === 'track_del')
//     .map(d => state.logsEntities[d].trackId)
// }


// const replayState = (state) => (rstate) => {
//   let actions = [];
//   let deleted = getDeleted(state)

//   rstate.logs && rstate.logs.map(lo => {
//     if(state.logs.indexOf(lo) === -1
//     && deleted.indexOf(rstate.logsEntities[lo].trackId) === -1) {
//       let log = rstate.logsEntities[lo];
//       // console.log("sync", log);
//       switch(log.action) {
//         case "track_add":
//           let kind = rstate.tracksEntities[log.trackId].kind
//           actions.push(action.addTrack({
//             kind: rstate.tracksEntities[log.trackId].kind,
//             desc: rstate.tracksEntities[log.trackId].desc,
//             id: log.trackId
//           }, log.time, lo));
//           break;
//         case "recording":
//           actions.push(action.trackStart(log.trackId, log.time));
//           break;
//         case "stop":
//           actions.push(action.trackStop(log.trackId, log.time));
//           break;
//         case "track":
//           actions.push(action.trackCount(log.trackId, log.time))
//           break;
//         case "track_del":
//           if( state.tracks.indexOf(log.trackId) !== -1 ) {
//             actions.push(action.trackDelete(log.trackId, log.time));
//           }
//           break;
//       }
//     }
//   })
//   console.log('actions', actions);
//   actions.push({type: action.SYNC_STORE_OK});
//   return actions;
//     // Observable.of({type: action.SYNC_STORE_OK}))
// }
