import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';


import * as gdrive from '../store/drive/reducers';

const PATH_CREATE = 'https://sheets.googleapis.com/v4/spreadsheets';


export default function exportSheet(action$) {
  return action$.ofType(gdrive.EXPORT_SHEET)
    .switchMap(a => {
      let track = a.payload;
      return Observable
        .fromPromise(requestCreateSheet(track))
        .map(a => a.result)
        .mergeMap(result =>
          Observable
            .fromPromise(requestAddDataToSheet(result, track))
            .map(res => ({
              url: result.spreadsheetUrl,
              trackId:track.id,
              exported: new Date()
            }))
        )
        // .do(result => console.log('result 2', result))
    })
    .map(a => gdrive.actionExportSheetComplete(a))

}

/**
 * request for adding rows to a new created sheet
 */
function requestAddDataToSheet(response, track) {
  return gapi.client.request({
    path: `https://sheets.googleapis.com/v4/spreadsheets/${response.spreadsheetId}/values/Logs!A1:D1:append?valueInputOption=USER_ENTERED`,
    method: 'POST',
    body: addDataSheetRequest(track)
  });
}

/**
 * Request for creating a new google sheet
 */
function requestCreateSheet(track) {
  return gapi.client.request({
    path: PATH_CREATE,
    method: 'POST',
    body: createSheet(track)
  });
}


/**
 *  Aggregates data on logEntites for a given track
 */
function trackValues(track) {
  let result = [];
  // push headers
  result.push(["Date", "Action", "Value"])
  track.logs
    .reverse().forEach((item, ind) => {
      result.push([
        formatDate(item.time),
        item.action,
        item.amount
      ]);
  })
  return result;
}

function formatDate(d) {
  let m = new Date(d);
  return `${m.getMonth()+1}/${m.getDate()}/${m.getFullYear()} ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}`
}


function addDataSheetRequest(track) {
  return {
    "range": "Logs!A1:D1",
    "majorDimension": "ROWS",
    "values": trackValues(track)
  };
}


function createSheet(track) {
  let p = new Date();
  return {
     properties: {
        title: `Tracks ${track.desc} - ${p.toLocaleDateString()}`,
        locale: 'en'
      },
      sheets: [
        {
          properties: {
            title: 'Logs',
            gridProperties: {
              columnCount: 4,
              frozenRowCount: 1
            }
          }
        },
      ]
    }
}


