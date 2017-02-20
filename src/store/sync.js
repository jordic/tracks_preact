import { SYNC_STORE_OK } from "./actions";

export function reducerSyncState(state, action) {
  switch (action.type) {

    case SYNC_STORE_OK: {
      let result = {};
      let { rstate, state } = action.payload;
      if (!rstate.logs) return state;
      let changed = diffLogs(state.logs, rstate.logs);
      let newLogs = getLogs(rstate.logsEntities, changed);

      // console.log("state", action.payload, changed, newLogs);
      let { toDelete, toAdd } = getActions(changed, newLogs);
      let localDelete = getLocalDeletes(state.logsEntities);

      // already deleted
      localDelete = localDelete.concat(toDelete);
      let tracks = state.tracks
        .concat(toAdd)
        .filter(t => !localDelete.includes(t));

      let logs = [...state.logs, ...changed];
      let logsEntities = Object.assign(state.logsEntities, newLogs);

      logs = logs.sort((a, b) => logsEntities[a].time - logsEntities[b].time);

      let tracksEntities = selectTracks(
        tracks,
        state.tracksEntities,
        rstate.tracksEntities
      );

      Object.keys(tracksEntities).map(a =>
        tracksEntities[a].amount = recalc(logsEntities, tracksEntities[a])
      );

      result = Object.assign({}, state, {
        tracks,
        tracksEntities,
        logs,
        logsEntities
      });
      return result;
    }

  }
  return state;
}

export const selectTracks = (tracks, state, rstate) => {

  let ent = {}
  tracks.map(el => {
    if(!state[el] || !rstate[el]) {
      ent[el] = (rstate[el]) ? rstate[el] : state[el];
    } else {
      if(rstate[el].lastRecord >= state[el].lastRecord) {
        ent[el] = rstate[el];
      } else {
        ent[el] = state[el];
      }
    }
    return el;
  });
  return ent;
};

const getLocalDeletes = state => {
  return Object.keys(state)
    .filter(k => {
      return state[k].action === "track_del";
    })
    .map(k => state[k].trackId);
};

const recalc = (logs, track) => {
  const validCalc = ["track", "stop"];
  let amount = 0;
  Object.keys(logs).map(id => {
    if (logs[id].trackId == track.id && validCalc.includes(logs[id].action)) {
      amount += logs[id].amount;
    }
  });
  return amount;
};

const getActions = (logs, entities) => {
  let toDelete = [], toAdd = [];
  console.log("actions", logs, entities);
  logs.forEach(v => {
    let log = entities[v];
    if (!log) return;
    switch (log.action) {
      case "track_del": {
        toDelete.push(log.trackId);
      }
      case "track_add": {
        toAdd.push(log.trackId);
      }
    }
  });
  return { toDelete, toAdd };
};


const diffLogs = (local, remote) => {
  if (!remote) return [];
  return remote.filter(id => !local.includes(id));
};


const getLogs = (raw, allowed) =>
  Object.keys(raw).filter(key => allowed.includes(key)).reduce((obj, key) => {
    obj[key] = raw[key];
    return obj;
  }, {});
