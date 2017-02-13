

import { combineEpics } from 'redux-observable';

import gDriveAuth from './gdriveAuth';
import exportSheet from './exportSheet';
import {syncStoreToDrive, syncStoreToDriveOk} from './driveSync';

export default combineEpics(
  gDriveAuth,
  exportSheet,
  syncStoreToDrive,
  syncStoreToDriveOk
);
