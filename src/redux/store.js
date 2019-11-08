import { createStore, applyMiddleware, compose } from 'redux';
import { createHashHistory } from 'history';
import { createLogger } from 'redux-logger';
import { routerMiddleware, routerActions } from 'react-router-redux';

import rootReducer from './reducers';

const history = createHashHistory();

const configureStore = initialState => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });
  middleware.push(logger);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionCreators,
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer(history), initialState, enhancer);

  // if ((module as any).hot) {
  //   (module as any).hot.accept('../reducers', () =>
  //     store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
  //   );
  // }
  return store;
};
const store = { configureStore, history };

export default store;
