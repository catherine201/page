import React from 'react';
import { Redirect } from 'react-router-dom';
import { Layout, BackTop } from 'antd';
import ArticleSider from './articleSider';
import NoteBooks from './notesBooks';
import Notes from './notes';

const NotAuth = () => (
  // message.warning('请登录后再操作');
  <Redirect to="/login" />
);

export default class PageDemo extends React.Component {
  state = {};

  render() {
    const user = sessionStorage.getItem('user');
    if (!user) {
      // message.warning('请登录后再操作')
      // return <Redirect to="/login" />
      return <NotAuth />;
    }
    return (
      <Layout className="app-layout">
        <BackTop />
        <ArticleSider {...this.props} />
        <NoteBooks {...this.props} />
        <Notes {...this.props} />
      </Layout>
    );
  }
}
