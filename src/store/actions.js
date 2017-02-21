

import * as gdrive from './drive/reducers';

export const TRACK_ADD = 'TRACK_ADD';
export const TRACK_START = 'TRACK_START';
export const TRACK_STOP = 'TRACK_STOP';
export const TRACK_COUNT = 'TRACK_COUNT';
export const TRACK_DELETE = 'TRACK_DELETE';
export const LOAD_STORE = 'LOAD_STORE';
export const SYNC_STORE = 'SYNC_STORE';
export const SYNC_STORE_OK = 'SYNC_STORE_OK';
export const SHOW_NEWS = 'SHOW_NEWS';
export const HIDE_NEWS = 'HIDE_NEWS';

export const now = () => (new Date()).getTime();

export function addTrack(p, time = now(), logId=undefined) {
  // console.log("track add", p, time, logId);
  return {
    type: TRACK_ADD,
    payload: {
      kind: p,
      time,
      logId
    }
  };
}


export function syncStore(time = now()) {
  return {
    type: SYNC_STORE,
    payload: {
      time
    }
  }
}

export function trackStart(id, time = now(), logId=undefined) {
  return {
    type: TRACK_START,
    payload: {
      id,
      time,
      logId
    }
  };
}

export function trackStop(id, time = now(), logId=undefined) {
  return {
    type: TRACK_STOP,
    payload: {
      id,
      time,
      logId
    }
  };
}


export function trackCount(id, time = now(), logId=undefined) {
  return {
    type: TRACK_COUNT,
    payload: {
      id,
      time,
      logId
    }
  };
}


export function trackDelete(id, time = now(), logId=undefined) {
  return {
    type: TRACK_DELETE,
    payload: {
      id,
      time,
      logId
    }
  };
}


export function showNews() {
  return {
    type: SHOW_NEWS
  };
}

export function hideNews() {
  return {
    type: HIDE_NEWS
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
  },
  syncStore() {
    dispatch(syncStore());
  },
  showNews() {
    dispatch(showNews());
  },
  hideNews() {
    dispatch(hideNews());
  }

});
