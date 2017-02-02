

import { combineEpics } from 'redux-observable';

import gDriveAuth from './gdriveAuth';
import exportSheet from './exportSheet';

export default combineEpics(
  gDriveAuth,
  exportSheet
);
