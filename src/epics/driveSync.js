
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/do';

import 'rxjs/add/observable/never';
import 'rxjs/add/observable/fromPromise';


import * as action from '../store/actions';


const FILE = 'tracks.json';

const replayState = (state) => (rstate) => {
  let actions = [];
  // console.log(rstate, state);
  rstate.logs.map(lo => {
    if(state.logs.indexOf(lo) === -1) {
      let log = rstate.logsEntities[lo];
      // console.log("sync", log);
      switch(log.action) {
        case "track_add":
          // if(rstate.tracksEntities[lo]) {
            let kind = rstate.tracksEntities[log.trackId].kind
            actions.push(action.addTrack({
              kind: rstate.tracksEntities[log.trackId].kind,
              desc: rstate.tracksEntities[log.trackId].desc,
              id: log.trackId
            }, log.time, log.id));
          // }
          break;
        case "recording":
          actions.push(action.trackStart(log.trackId, log.time));
          break;
        case "stop":
          actions.push(action.trackStop(log.trackId, log.time));
          break;
        case "track":
          actions.push(action.trackCount(log.trackId, log.time))
          break;
        case "track_del":
          actions.push(action.trackDelete(log.trackId, log.time));
          break;
      }
    }
  })
  // console.log('actions', actions);
  actions.push({type: action.SYNC_STORE_OK});
  return actions;
    // Observable.of({type: action.SYNC_STORE_OK}))
}



export function syncStoreToDrive(action$, store) {
  return action$.ofType(action.SYNC_STORE)
    .switchMap(a => {
      return Observable.fromPromise(load())
        .switchMap(replayState(store.getState()))
    })
}


export function syncStoreToDriveOk(action$, store) {
  return action$.ofType(action.SYNC_STORE_OK)
    .switchMap(s =>
      Observable.fromPromise(upload(store.getState()))
        .do(a => console.log('sync store ok'))
        .switchMap(o => Observable.never())
    )
}


function delve(obj, key, def, p) {
  p = 0;
  key = key.split ? key.split('.') : key;
  while (obj && p<key.length) obj = obj[key[p++]];
  return obj===undefined ? def : obj;
}



const create = function () {
  return gapi.client.drive.files
    .create({
      fields: 'id',
      resource: { name: FILE, parents: ['appDataFolder'] }
    })
    .then(response => {
      return delve(response, 'result.id', null);
    });
};


const prepare = function() {
  return gapi.client.drive.files
    .list({
      q: `name="${FILE}"`,
      spaces: 'appDataFolder',
      fields: 'files(id,modifiedTime)'
    }).then(resp => {
      return delve(resp, 'result.files.0.id') || create();
    })
}

export const load = () => {
  return prepare().then(id => {
    return gapi.client.drive.files
      .get({fileId: id, alt: 'media'})
      .then(resp => {
        return delve(resp, 'result')
      })
  });
}


export const upload = (state) => {
  return prepare().then(id =>
    gapi.client.request({
      path: `/upload/drive/v3/files/${id}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      body: JSON.stringify(state)
    })
  );
}


window.prepare = prepare;
window.upload = upload;
window.load = load;
