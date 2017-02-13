

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';


import {GAPI_LOGIN, actionAuthResult} from '../store/drive/reducers';
import conf from '../conf';



export function checkAuth(scopes, clientId, inmediate) {
  return gapi.auth.authorize({
    'client_id': clientId,
    'scope': scopes.join(' '),
    'immediate': inmediate
  }).then();
}

export function loadDriveClient(result) {
  return Observable.fromPromise(
    gapi.client.load('drive', 'v3')
  ).map(a => result);
}


export default function gdriveAuth(action$) {
  return action$.ofType(GAPI_LOGIN)
    .switchMap(a =>{
      let when = a.payload ? false : true;
      // console.log('when', when);
      return Observable
        .fromPromise(checkAuth(conf.SCOPES, conf.GAPI_UID, when))
        .catch(e => {
          return Observable.of({error: true});
        })
    })
    .switchMap(result =>
        (result && !result.error) ? loadDriveClient(result) : Observable.of(result))
    .map(result => {
      if (result && !result.error) {
        return actionAuthResult('success')
      }
      return actionAuthResult('failure');
    });
}

