import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

// Setup store
import { reducer, initialState } from './store';
import { loadState, saveState } from './store/localStorage';
import rootEpic from './epics';


let istate = loadState();
// migrate state?
if(istate && !istate.version) {
  // add to log action create track
  // Object.keys(istate.logsEntities).()
  // istate.tracks = []
  // istate.tracksEntities = []
  // istate.logs = []
  // istate.logsEntities = {}
}

const epicMiddleware = createEpicMiddleware(rootEpic);


export default function configureStore() {

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  let store = createStore(
    reducer,
    (istate) ? istate : initialState,
    composeEnhancers(
      applyMiddleware(epicMiddleware)
    )
  )

  // console.log('store', store);
  window.store = store;

  store.subscribe(() => {
    let {tracks, tracksEntities, logs, logsEntities} = store.getState()
    saveState({
      tracks, tracksEntities, logs, logsEntities
    });
  });
  return store;
}
