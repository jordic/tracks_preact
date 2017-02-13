

import * as gdrive from './drive/reducers';

export const TRACK_ADD = 'TRACK_ADD';
export const TRACK_START = 'TRACK_START';
export const TRACK_STOP = 'TRACK_STOP';
export const TRACK_COUNT = 'TRACK_COUNT';
export const TRACK_DELETE = 'TRACK_DELETE';
export const LOAD_STORE = 'LOAD_STORE';


export const now = () => (new Date()).getTime();

export function addTrack(p, time = now()) {
  return {
    type: TRACK_ADD,
    payload: {
      kind: p,
      time: time
    }
  };
}

export function trackStart(id, time = now()) {
  return {
    type: TRACK_START,
    payload: {
      id: id,
      time: time
    }
  };
}

export function trackStop(id, time = now()) {
  return {
    type: TRACK_STOP,
    payload: {
      id: id,
      time: time
    }
  };
}


export function trackCount(id, time = now()) {
  return {
    type: TRACK_COUNT,
    payload: {
      id: id,
      time: time
    }
  };
}


export function trackDelete(id, time = now()) {
  return {
    type: TRACK_DELETE,
    payload: {
      id: id,
      time: time
    }
  };
}


export const mapDispatchToProps = (dispatch) => ({
  trackCount(id) {
    dispatch(trackCount(id));
  },
  trackStart(id) {
    dispatch(trackStart(id));
  },
  trackStop(id) {
    dispatch(trackStop(id));
  },
  trackDelete(id) {
    dispatch(trackDelete(id));
  },
  loginGapi(inmediate) {
    dispatch(gdrive.actionGapiLogin(inmediate));
  },
  exportSheet(track) {
    dispatch(gdrive.actionExportSheet(track));
  }
})
