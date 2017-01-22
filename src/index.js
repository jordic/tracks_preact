// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import './style';

import { Provider } from 'preact-redux';

// Setup store
import { createStore } from 'redux';
import { reducerTracks, initialState } from './store';
import { loadState, saveState } from './store/localStorage';

let istate = loadState();

let store;
store = createStore(
	reducerTracks,
  (istate) ? istate : initialState,
	window.devToolsExtension && window.devToolsExtension()
);


store.subscribe(() => {
  saveState(store.getState());
});

// Bootstrap app
let root;
function init() {
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
