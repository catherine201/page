import React from 'react';
import { Form, Input, Button, Icon } from 'antd';
import createApi from '../../api/registerAndLogin';
import styles from './register.less';

const FormItem = Form.Item;

const srcImg = require('../../assets/images/logo.png');

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false
  };

  register = async obj => {
    const res = await createApi.register(obj);
    if (res && res.error_code === 1) {
      this.$msg.success('注册成功');
      this.props.history.push('/login');
    } else {
      this.$msg.success('注册失败');
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const obj = {
          name: values.user,
          password: values.password,
          confirm_pwd: values.confirm
        };
        this.register(obj);
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    const reg = /((?=.*[a-z])(?=.*\d)|(?=[a-z])(?=.*[\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？])|(?=.*\d)(?=.*[\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？]))[a-z\d\\+`~!@#%$^&*()=\-_|{}':;',\[\].<>\/?~！@#￥……&*（）——【】‘；：”“'。，、？]{8,16}/i; // 密码至少为8位的字母,数字,字符任意两种的组合
    if (value && !reg.test(value)) {
      callback('密码至少为8位的字母,数字,字符任意两种的组合!');
    } else {
      callback();
    }
  };

  toLogin = e => {
    e.preventDefault();
    this.props.history.push('/login');
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 8 }
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 16 }
    //   }
    // };
    // const tailFormItemLayout = {
    //   wrapperCol: {
    //     xs: {
    //       span: 24,
    //       offset: 0
    //     },
    //     sm: {
    //       span: 16,
    //       offset: 8
    //     }
    //   }
    // };
    return (
      <div className="middle-box">
        <div
          className={`m-box  register-form ${styles['register-form']}${
            this.state.isLoding ? ' blur-2' : ' blur-0'
          }`}
        >
          <div className={styles['register-form-wallpaper']} />
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
          <Form onSubmit={this.handleSubmit} className={styles['ant-form']}>
            {/* label="用户名"  {...formItemLayout} */}
            <FormItem>
              {getFieldDecorator('user', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名!'
                  }
                ]
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="账号"
                />
              )}
            </FormItem>
            {/* {...formItemLayout} label="密码" */}
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码!'
                  },
                  {
                    validator: this.validateToNextPassword
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
            </FormItem>
            {/* {...formItemLayout} label="密码确认" */}
            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请再次输入密码!'
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="密码确认"
                  onBlur={this.handleConfirmBlur}
                />
              )}
            </FormItem>
            {/* {...tailFormItemLayout} */}
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="btn-block btn-lg"
                // className={styles['login-form-button']}
                disabled={this.state.isLoding}
              >
                Register
              </Button>
              <br />
              <a href="#" onClick={this.toLogin}>
                已有账号，点击登陆!
              </a>
            </FormItem>
          </Form>

          <div style={{ color: '#9fa8b1' }} className="text-center">
            Leeker Labs platform
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(RegistrationForm);
