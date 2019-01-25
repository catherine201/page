import React, { Component } from 'react';
import { message, Modal, notification } from 'antd';
import { init } from './utils';
import store from './store';
import router from './routes';
import center from './utils/center';

React.Component.prototype.$center = center;
React.Component.prototype.$msg = message;
React.Component.prototype.$modal = Modal;
React.Component.prototype.$notification = notification;
init();

class App extends Component {
  componentDidMount() {
    window.onbeforeunload = function() {
      sessionStorage.setItem('store', JSON.stringify(store.getState()));
    };
  }

  render() {
    return (
      <div>
        <router.view />
      </div>
      // <Provider store={store}>
      //   <PersistGate persistor={persistor}>
      //   <div>
      //     <router.view />
      //   </div>
      //    </PersistGate>
      // </Provider>
    );
  }
}
export default App;
