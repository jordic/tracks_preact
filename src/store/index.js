
import * as actions from './actions';
import {deleteKeys} from './utils';
import {driveReducer, EXPORT_SHEET_OK} from './drive/reducers';

let id = 1;

function getId() {
  return (new Date()).getTime() + '-' + ++id;
}

// Tech Dept: That comes from angular. Need tests.
// Soon or later we need to change the shape of this state,
// to something like:
// tracks: { byId: {}, all: [] }
// logs: { byId: {}, all: [] }
// this way we can simplify a lot the reducers. (doing only things)
// related to their state and not working on all the shape at the same time

export const initialState = {
  counter: 1,
  tracks: [],
  tracksEntities: {},
  logs: [],
  logsEntities: {},
};


const defaultTrack = (counter) => ({
  id: getId(),
  kind: 'time',
  desc: 'Track ' + counter,
  state: 'stopped',
  amount: 0,
  lastRecord: 0,
});


const cl = (obj, props) => Object.assign({}, obj, props);


export function reducerTracks(state = initialState, action) {

  switch (action.type) {
    case actions.LOAD_STORE: {
      return loadStore();
    }
    case actions.TRACK_ADD: {
      let track = cl(
        defaultTrack(state.counter), action.payload.kind
      );
      let addLog = logTrack(action.payload.time, track.id, 'track_add', 0);
      return cl(state, {
        tracks: [...state.tracks, track.id],
        tracksEntities: cl(state.tracksEntities, {
          [track.id]: track
        }),
        logs: [...state.logs, addLog.id],
        logsEntities: cl(state.logsEntities, {
          [addLog.id]: addLog
        }),
        counter: state.counter++
      });
    }

    case actions.TRACK_START: {
      let lastRecord = action.payload.time;
      let track = state.tracksEntities[action.payload.id];
      return newState(
        state,
        cl(track, { lastRecord, state: 'recording' }),
        logTrack(lastRecord, track.id, 'recording')
      );
    }

    case actions.TRACK_STOP: {
      let lastRecord = action.payload.time;
      let track = state.tracksEntities[action.payload.id];
      let amount = track.amount + (lastRecord - track.lastRecord);
      return newState(
        state,
        cl(track, { state: 'stopped', amount, lastRecord }),
        logTrack(lastRecord, track.id, 'stop', (lastRecord - track.lastRecord))
      );
    }

    case actions.TRACK_COUNT: {
      let lastRecord = action.payload.time;
      let track = state.tracksEntities[action.payload.id];
      let amount = track.amount + 1;
      return newState(
        state,
        cl(track, { lastRecord, amount }),
        logTrack(lastRecord, track.id, 'track', 1)
      );
    }

    case actions.TRACK_DELETE: {
      let logIds = logsForTrack(state.logsEntities, action.payload.id);
      let delLog = logTrack(action.payload.time, action.payload.id, 'track_del', 0);
      // console.log('ids', logIds);
      let rstate = cl(state, {
        tracks: state.tracks.filter(i => i !== action.payload.id),
        tracksEntities: deleteKeys(state.tracksEntities, [].concat(action.payload.id)),
        logs: state.logs.filter(i => logIds.indexOf(i) === -1),
        logsEntities: deleteKeys(state.logsEntities, logIds)
      });

      return Object.assign({}, rstate, {
        logs: [...rstate.logs, delLog.id],
        logsEntities: cl(rstate.logsEntities, {
          [delLog.id]: delLog
        }),
      })

    }
  }
  return state;
}


function reducerTrackEntities(state, action) {
  switch (action.type) {
    case EXPORT_SHEET_OK: {
      // let track = state.filter(t => t.id===action.payload.trackId)
      let id = action.payload.trackId;
      return Object.assign({}, state, {
        [id]: Object.assign({}, state[id], {
          sheetUrl: action.payload.url,
          sheetExported: action.payload.exported
        })
      });
    }
  }
  return state;
}




export function reducer(state = initialState, action) {
  const r = reducerTracks(state, action);
  let drive = driveReducer(r.drive, action);
  let tracksEntities = reducerTrackEntities(r.tracksEntities, action)
  // console.log(state.tracksEntities);
  return Object.assign({}, r, {drive, tracksEntities});
}


export function logsForTrack(entities, trackId) {
  return Object.keys(entities)
    .map(k => entities[k])
    .filter(el => el.trackId === trackId)
    .map(el => el.id);
}


function logTrack(time, trackId, action, amount = 0) {
  return {
    id: getId(),
    action,
    trackId,
    time,
    amount
  };
}


// Computes a new state
function newState(state, track, log) {
  return Object.assign({}, state, {
    tracksEntities: Object.assign({}, state.tracksEntities, {
      [track.id]: track
    }),
    logs: [...state.logs, log.id],
    logsEntities: Object.assign({}, state.logsEntities, {
      [log.id]: log
    }),
  });
}
