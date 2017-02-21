// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import './style';
import { Provider } from 'preact-redux';

import configureStore from './configureStore';

import { loadGAPIClient } from './lib/drive/load_gapi';
import { requestIdle } from './lib/utils';
import { GAPI_LOGIN, APP_ONLINE, APP_OFFLINE} from './store/drive/reducers';
import conf from './conf';

import * as sync from './epics/driveSync';


let store = configureStore();

// idle work after boot
// try to swap it for a delayed execution
// setTimeout(() => requestIdle(() => {
//   const drive = loadGAPIClient(conf.GJS_CLIENT);
//   drive.then(() => {
//     store.dispatch({type: GAPI_LOGIN});
//   });
// }), 500);


// import generateData from './store/fixtures';

// generateData('1486664115333-1002', store);
if (navigator && navigator.onLine) {
  store.dispatch({type: APP_ONLINE});
} else {
  store.dispatch({type: APP_OFFLINE});
}

if (window) {
  window.addEventListener('online', () => {
    store.dispatch({type: APP_ONLINE});
  }, false);
  window.addEventListener('offline', () => {
    store.dispatch({type: APP_OFFLINE});
  }, false);
}


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


if (process.env.NODE_ENV==='production') {

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-90945525-1', 'auto');
  ga('send', 'pageview');


}
