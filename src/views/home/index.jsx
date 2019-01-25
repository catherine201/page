import React from 'react';
import { Button } from 'antd';
import './home.less';

const imgSrc = require('../../assets/images/logo.png');

export default class Home extends React.Component {
  toAdmin() {
    console.log(this);
    this.props.history.push('/admin');
  }

  render() {
    return (
      <div className="middle-box">
        {/* <div className="m-box"></div> */}
        <div>
          <img src={imgSrc} alt="logo" className="home_logo" />
        </div>
        <div style={{ margin: '20px 0' }}>
          <h1>Leeker Labs 发布文章系统</h1>
        </div>
        <div>
          <Button
            className="btn-block btn-lg"
            onClick={() => {
              this.toAdmin();
            }}
          >
            进入系统...
          </Button>
        </div>
      </div>
    );
  }
}
