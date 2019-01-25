import React from 'react';
import { Button, Form, Input, Icon, Checkbox } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import styles from './login.less';
import createApi from '../../api/registerAndLogin';
import { regular } from '../../utils/validate';

// const srcImg = require('../../assets/images/logo.png');

class LoginPassWord extends React.Component {
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
      console.log(res);
      if (res.data.google_auth === undefined || res.data.google_auth) {
        this.props.successLogin(res);
      } else if (res.data.google_auth === false) {
        const sendObj = {
          status: 1,
          loginInfo: obj
        };
        this.props.changeState(sendObj);
      }
      // const authObj = {
      //   access_token: res.data.access_token,
      //   appid: 'd862b911825b21d72275420ae4456b80'
      // };
      // const authResult = await createApi.authLogin(authObj);
      // if (authResult) {
      //   const userObj = res.data;
      //   const info = {
      //     auth_code: authResult.data.auth_code,
      //     open_id: res.data.openid
      //   };
      //   const result = await createApi.secondLogin(info);
      //   if (result) {
      //     this.props.dispatch.menu.getOwnMenu();
      //     userObj.second_access_token = result.access_token;
      //     userObj._id = result.user_id;
      //     userObj.auth_code = authResult.data.auth_code;
      //     userObj.avatar_url = res.data.avatar_url;
      //     sessionStorage.setItem('user', JSON.stringify(userObj));
      //     console.log(res.data);
      //     this.props.dispatch.aside.getAvatar(res.data.avatar_url);
      //     this.props.dispatch.aside.getBindStatus(res.data.ga_verify);
      //     this.props.changeState(1);
      //     // this.props.history.push('/personalCenter/user');
      //   } else {
      //     this.$msg.error('登陆失败');
      //   }
      // }
    } else {
      res && this.$msg.error(res.message);
    }
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const obj = {
          name: values.username,
          password: values.password
        };
        this.login(obj);
      }
    });
  };

  validateToPassword = (rule, value, callback) => {
    // const reg = /((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？])|(?=.*\d)(?=.*[\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？]))[a-z\d\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？]{8,16}/i; // 密码至少为8位的字母,数字,字符任意两种的组合
    if (value && regular.passWord.test(value)) {
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
      <Form onSubmit={this.onSubmit}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }]
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
)(Form.create()(LoginPassWord));
