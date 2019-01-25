import React from 'react';
// import router from '../routes';
import Loadable from 'react-loadable';
import { HashRouter, Route } from 'react-keeper';

const Loading = () => <div>Loading...</div>;

const page = name =>
  Loadable({
    loader: () => import(`../views/${name}`),
    loading: Loading
  });
// routes: [
//   { path: '/', component: page('home') },
//   { path: '/login', component: page('login') },
//   { path: '/register', component: page('register') },
//   {
//     path: '/article/notebooks',
//     component: page('article')
//   },
//   {
//     path: '/article/notebooks/:folder',
//     component: page('article')
//   },
//   {
//     path: '/article/notebooks/:folder/:notes',
//     component: page('article')
//   },
//   {
//     path: '/article/notebooks/:folder/:notes/:file',
//     component: page('article')
//   },
//   {
//     path: '/admin',
//     component: AppLayout,
//     name: 'admin-view',
//     children: [
//       { path: '/', component: page('main') },
//       { path: '/publish', component: page('admin') },
//       { path: '/publish/:id', component: page('admin') },
//       { path: '/query', component: page('main') },
//       { path: '/edit', component: page('article') },
//       { name: 404, component: page('404') }
//     ]
//   },
//   { name: 404, component: page('404') }
// ]
class View extends React.Component {
  render() {
    console.log('zhe;');
    return (
      <HashRouter>
        <div>
          <Route cache component={Home} path="/" />

          {/* <Route
            component={Products}
            path="/products"
            enterFilter={loginFilter}
          >
            <Route index component={Enterprise} path="/ep" />
            <Route miss component={page('404')} />
            <Route
              component={page('article')}
              path="/article/notebooks/:folder/:notes/:file"
            />
          </Route> */}

          <Route
            cache
            component={page('article')}
            path="/article/notebooks/:folder/:notes/:file"
          />
          <Route component={page('login')} path="/login" />
          <Route component={page('home')} path="/" />
        </div>
      </HashRouter>
    );
  }
}

export default View;
