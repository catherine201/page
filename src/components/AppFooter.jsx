import React from 'react';
import { Icon, Tag } from 'antd';

export default class AppFooter extends React.Component {
  render() {
    // const repository = this.$app.repository.url.replace(/git\+/, '');
    return (
      <div className="text-center">
        {/* <a href={repository} target="_blank" rel="noopener noreferrer">
          <Icon type="github" />
          &nbsp;{'this.$app.name'}
        </a>{' '} */}
        <Icon type="cloud" />
        Make by &nbsp;
        <span>
          <Tag color="blue">Leeker Labs</Tag>
        </span>
      </div>
    );
  }
}
