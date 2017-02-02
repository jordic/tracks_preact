


export const GAPI_LOGIN = 'GAPI_LOGIN';
export const GAPI_RESULT = 'GAPI_RESULT';
export const EXPORT_SHEET = 'EXPORT_SHEET';
export const EXPORT_SHEET_OK = 'EXPORT_SHEET_OK';


export function actionExportSheet(track) {
  return {
    type: EXPORT_SHEET,
    payload: track
  }
}

export function actionExportSheetComplete(result) {
  return {
    type: EXPORT_SHEET_OK,
    payload: result
  }
}

export function actionAuthResult(result) {
  return {
    type: GAPI_RESULT,
    payload: result
  }
}

export function actionGapiLogin(inmediate=false) {
  return {
    type: GAPI_LOGIN,
    payload: inmediate
  }
}


// exportStatus = 'working' | 'fail' | 'success'
const initial = {
  authState: 'pending',
  logging: false,
  exporting: false,
  trackId: '',
  exportStatus: ''
};



export function driveReducer(state = initial, action) {

  switch (action.type) {
    case GAPI_RESULT: {
      return Object.assign({}, state, {
        authState: action.payload,
        logging: false
      });
    }
    case GAPI_LOGIN: {
      return Object.assign({}, state, {
        logging: true,
        authState: 'pending'
      });
    }
    case EXPORT_SHEET: {
      return Object.assign({}, state, {
        exporting: true,
        trackId: action.payload.id,
        exportStatus: 'working'
      });
    }

    case EXPORT_SHEET_OK: {
      return Object.assign({}, state, {
        exporting: false,
        exportStatus: 'success'
      });
    }

  }
  return state;
}
