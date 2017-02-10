// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import './style';
import { Provider } from 'preact-redux';

import configureStore from './configureStore'

import { loadGAPIClient } from './lib/drive/load_gapi';
import { requestIdle } from './lib/utils';
import { GAPI_LOGIN } from './store/drive/reducers';
import conf from './conf';


let store = configureStore();

// idle work after boot
// try to swap it for a delayed execution
setTimeout(() => requestIdle(() => {
  const drive = loadGAPIClient(conf.GJS_CLIENT);
  drive.then(() => {
    store.dispatch({type: GAPI_LOGIN});
  });
}), 5000);


// import generateData from './store/fixtures';

// generateData('1486664115333-1002', store);


// Bootstrap app
let root;
function init() {
  document.body.innerHTML = '';
  let App = require('./components/app').default;
  root = render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.body, root);
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV==='production') {
  require('./pwa');
}

// in development, set up HMR:
if (module.hot) {
  require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('./components/app', () => requestAnimationFrame(init) );
}

init();
