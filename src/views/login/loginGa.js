import React from 'react';
import { Button, Form, Input, Icon } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import styles from './login.less';
import createApi from '../../api/registerAndLogin';

// const srcImg = require('../../assets/images/logo.png');

class LoginGa extends React.Component {
  static propTypes = {
    form: PropTypes.any.isRequired
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
      this.props.successLogin(res);
    } else {
      res && this.$msg.error(res.message);
    }
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const obj = {
          ...this.props.loginInfo,
          google_code: values.gaCheckCode
        };
        this.login(obj);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Item>
          {getFieldDecorator('gaCheckCode', {
            rules: [
              { required: true, message: '请输入谷歌验证码!' },
              {
                min: 6,
                max: 6,
                message: '验证码为6位!'
              }
            ]
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入谷歌验证码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button className="btn-block btn-lg" type="primary" htmlType="submit">
            Log in
          </Button>
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
)(Form.create()(LoginGa));
