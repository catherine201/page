import React from 'react';
import { Button, Form, Input, Icon, Checkbox } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './login.less';
import createApi from '../../api/registerAndLogin';

const srcImg = require('../../assets/images/logo.png');

class Login extends React.Component {
  static propTypes = {
    form: PropTypes.any.isRequired,
    history: PropTypes.any.isRequired
  };

  state = {
    username: '',
    password: ''
    // isLoding: false
  };

  componentDidMount() {
    this.props.form.setFieldsValue({
      username: this.state.username,
      password: this.state.password
    });
  }

  login = async obj => {
    const res = await createApi.login(obj);
    if (res && res.error_code === 1) {
      const authObj = {
        access_token: res.data.access_token,
        appid: window.location.host.includes('localhost')
          ? 'd862b911825b21d72275420ae4456b80'
          : '703fc6949ad96cd3fe08f5ac16e3adc3'
        // appid: 'd862b911825b21d72275420ae4456b80'
      };
      const authResult = await createApi.authLogin(authObj);
      if (authResult) {
        const userObj = res.data;
        const info = {
          auth_code: authResult.data.auth_code,
          open_id: res.data.openid
        };
        const result = await createApi.secondLogin(info);
        if (result) {
          userObj.second_access_token = result.access_token;
          userObj._id = result.user_id;
          sessionStorage.setItem('user', JSON.stringify(userObj));
          this.props.history.push('/admin');
        } else {
          this.$msg.error('登陆失败');
        }
      }
    } else {
      this.$msg.error(res.message);
    }
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        sessionStorage.setItem('user', JSON.stringify(values));
        console.log(values);
        const obj = {
          name: values.username,
          password: values.password
        };
        this.props.history.push('/admin');
        this.login(obj);
      }
    });
  };

  validateToPassword = (rule, value, callback) => {
    const reg = /((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？])|(?=.*\d)(?=.*[\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？]))[a-z\d\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？]{8,16}/i; // 密码至少为8位的字母,数字,字符任意两种的组合
    if (value && reg.test(value)) {
      callback();
    } else {
      callback('密码至少为8位的字母,数字,字符任意两种的组合!');
    }
  };

  toRegister = e => {
    e.preventDefault();
    this.props.history.push('/register');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
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
          <Form onSubmit={this.onSubmit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名!' }]
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="账号"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入密码!' },
                  {
                    validator: this.validateToPassword
                  }
                ]
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true
              })(<Checkbox>Remember me</Checkbox>)}
              {/* <a className="login-form-forgot" href="">
                Forgot password
              </a> */}
              <Button
                className="btn-block btn-lg"
                type="primary"
                htmlType="submit"
                disabled={this.state.isLoding}
              >
                Log in
              </Button>
              <a href="#" onClick={this.toRegister}>
                没有账号？点击注册
              </a>
            </Form.Item>
          </Form>

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
  // getOwnMenu: dispatch.menu.getOwnMenu
});
export default connect(
  // mapStateToProps,
  mapDispatchToProps
)(Form.create()(Login));
