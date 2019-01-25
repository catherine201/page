import React from 'react';
import Loadable from 'react-loadable';
import Router from 'react-concise-router';
// import NProgress from 'NProgress';
import AppLayout from '../components/AppLayout';
import store from '../store';

const Loading = () => <div>Loading...</div>;

const page = name =>
  Loadable({
    loader: () => import(`../views/${name}`),
    loading: Loading
  });

const router = new Router({
  mode: 'hash',
  routes: [
    { path: '/', component: page('home') },
    { path: '/login', component: page('login') },
    { path: '/register', component: page('register') },
    {
      path: '/article/notebooks',
      component: page('article')
    },
    {
      path: '/article/notebooks/:folder',
      component: page('article')
    },
    {
      path: '/article/notebooks/:folder/:notes',
      component: page('article')
    },
    {
      path: '/article/notebooks/:folder/:notes/:file',
      component: page('article')
    },
    {
      path: '/admin',
      component: AppLayout,
      name: 'admin-view',
      children: [
        { path: '/', component: page('main') },
        { path: '/publish', component: page('admin') },
        { path: '/publish/:id', component: page('admin') },
        { path: '/query', component: page('main') },
        { path: '/edit', component: page('article') },
        { name: 404, component: page('404') }
      ]
    },
    { name: 404, component: page('404') }
  ]
});

// const modulesContext = require.context('../views/', true, /route\.js$/);
// modulesContext.keys().forEach(element => {
//   console.log(element);
//   // console.log(modulesContext(element).default);
//   routes.push(...modulesContext(element).default);
// });

router.beforeEach = function(ctx, next) {
  // NProgress.start();
  store.dispatch.demo.setCountLoading([]);
  next();
  setTimeout(() => {
    // NProgress.done();
  }, 300);
};
export default router;
