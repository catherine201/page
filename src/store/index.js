import { init } from '@rematch/core';
import { reducer as reduxAsyncConnect } from 'redux-connect';
// import createLoadingPlugin from '@rematch/loading';
// import createRematchPersist from '@rematch/persist';
import models from './modules';

function createStore() {
  // const options = {
  //   whitelist: ['demo', 'demo1', 'Fivechess'],
  //   model: {
  //     selectors: {
  //       login(state) {
  //         return state.effects.demo.getTest;
  //       }
  //     }
  //   }
  // };
  // const loading = createLoadingPlugin(options);
  // const persistPlugin = createRematchPersist({
  //   // whitelist: ['menu', 'query'],
  //   throttle: 50,
  //   version: 1
  // });
  // const initialState = JSON.parse(localStorage.getItem('persist:root') || '{}');
  // for (const key in initialState) {
  //   if (key !== '_persist') {
  //     initialState[key] = JSON.parse(initialState[key]);
  //   } else {
  //     delete initialState[key];
  //   }
  // }
  const store = init({
    models,
    redux: {
      reducers: {
        reduxAsyncConnect
      }
      // initialState
      // middlewares: [...middlewares]
    }
    // plugins: [loading, persistPlugin]
    // plugins: [persistPlugin]
  });

  return store;
}

const store = createStore();

// console.log(store);
// console.log(models);

export default store;
