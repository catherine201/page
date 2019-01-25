import React from 'react';
import { connect } from 'react-redux';
import styles from './login.less';
import LoginPassWord from './loginPassWord';
import createApi from '../../api/registerAndLogin';
import LoginGa from './loginGa';

const srcImg = require('../../assets/images/logo.png');

class Login extends React.Component {
  // static propTypes = {
  //   form: PropTypes.any.isRequired,
  //   history: PropTypes.any.isRequired
  // };

  constructor() {
    // super(props);
    super();
    this.state = {
      status: 0, // 0 账号密码 1 谷歌验证码
      loginInfo: {}
    };
    this.changeState = this.changeState.bind(this);
    this.successLogin = this.successLogin.bind(this);
  }

  state = {
    // isLoding: false
  };

  componentDidMount() {}

  changeState = obj => {
    // console.log(val);
    this.setState({
      loginInfo: obj.loginInfo,
      status: obj.status
    });
  };

  successLogin = async res => {
    // const userObj = res.data;
    const authObj = {
      access_token: res.data.access_token,
      appid: window.location.host.includes('localhost')
        ? '79ae03d05626dcc0c5c207e0cdc682b6'
        : '79ae03d05626dcc0c5c207e0cdc682b6'
    };
    const authResult = await createApi.authLogin(authObj);
    if (authResult) {
      const userObj = res.data;
      const info = {
        auth_code: authResult.data.auth_code,
        openid: res.data.openid
      };
      const result = await createApi.secondLogin(info);
      if (result) {
        // this.props.dispatch.menu.getOwnMenu();
        userObj.second_access_token = result.data.access_token;
        userObj._id = result.user_id;
        userObj.auth_code = authResult.data.auth_code;
        userObj.avatar_url = res.data.avatar_url;
        sessionStorage.setItem('user', JSON.stringify(userObj));
        // console.log(res.data);
        // this.props.dispatch.aside.getAvatar(res.data.avatar_url);
        // this.props.dispatch.aside.getNickName(res.data.nickname);
        // this.props.dispatch.aside.getBindStatus(res.data.ga_bind);
        this.props.history.push('/article/notebooks');
        // this.props.changeState(1);
        // this.props.history.push('/personalCenter/user');
      } else {
        this.$msg.error('登陆失败');
      }
    }
    // const userObj = res.data;
    // sessionStorage.setItem('user', JSON.stringify(userObj));
    // this.props.dispatch.aside.getAvatar(res.data.avatar_url);
    // this.props.dispatch.aside.getNickName(res.data.nickname);
    // this.props.dispatch.aside.getBindStatus(res.data.ga_verify);
    // this.props.history.push('/personalCenter/');
  };

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { status, loginInfo } = this.state;
    return (
      <div className="middle-box login-page">
        <div
          className={`m-box ${styles['login-form']} ${
            this.state.isLoding ? ' blur-2' : ' blur-0'
          }`}
        >
          <div className="login-form-wallpaper" />
          <div className="text-center">
            <img
              src={srcImg}
              width="100"
              height="100"
              alt="logo"
              className={styles.logo}
            />
          </div>
          <h1
            className="text-center"
            style={{ color: '#1890FF', fontSize: 'rgba(24, 144, 255, 0.91)' }}
          >
            Leeker Labs
          </h1>
          {status === 0 && (
            <LoginPassWord
              {...this.props}
              changeState={this.changeState}
              successLogin={this.successLogin}
            />
          )}
          {status === 1 && (
            <LoginGa
              {...this.props}
              changeState={this.changeState}
              successLogin={this.successLogin}
              loginInfo={loginInfo}
            />
          )}

          <div style={{ color: '#9fa8b1' }} className="text-center">
            Leeker Labs platform
          </div>
        </div>
      </div>
    );
  }
}

// export default Form.create()(Login);

const mapDispatchToProps = () => ({
  // getMenu: dispatch.menu.getMenu,
  // getGroup: dispatch.menu.getGroup,
  // getNickName: dispatch.aside.getNickName,
  // getOwnMenu: dispatch.menu.getOwnMenu,
  // getAvatar: dispatch.aside.getAvatar,
  // getBindStatus: dispatch.aside.getBindStatus
});
export default connect(
  // mapStateToProps,
  mapDispatchToProps
)(Login);
