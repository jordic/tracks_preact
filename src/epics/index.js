

import { combineEpics } from 'redux-observable';

import gDriveAuth from './gdriveAuth';
import exportSheet from './exportSheet';
import {syncStoreToDrive, syncStoreToDriveOk} from './driveSync';

import loadGapi from './loadGapi';

export default combineEpics(
  loadGapi,
  gDriveAuth,
  exportSheet,
  syncStoreToDrive,
  syncStoreToDriveOk
);
