

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';

import {APP_ONLINE, GAPI_LOGIN} from '../store/drive/reducers';
import { loadGAPIClient } from '../lib/drive/load_gapi';
import conf from '../conf';


export default function loadGapi(action$) {

  return action$.ofType(APP_ONLINE)
    .switchMap(a =>
      Observable.fromPromise(loadGAPIClient(conf.GJS_CLIENT))
    ).map(a => ({type: GAPI_LOGIN}));


}
