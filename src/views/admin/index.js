import React from 'react';
import {
  Form,
  Input,
  Upload,
  Button,
  Icon,
  Select,
  DatePicker,
  Row,
  Col
} from 'antd';
// import reqwest from 'reqwest';
import moment from 'moment';
import styles from './index.less';
import {
  numToArr,
  handleData,
  escapeEmpty,
  handleObj,
  timestampToTime
} from '../../utils';
import createApi from '../../api/version';

const reqwest = require('reqwest');

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
let id = 0; // 一开始的个数
let deviceId = 0;
let versionId = 0;
let areaId = 0;
const nextKeysObj = {
  keysFilter(keys) {
    return keys.concat(++id);
  },
  deviceFilter(keys) {
    return keys.concat(++deviceId);
  },
  versionFilter(keys) {
    return keys.concat(++versionId);
  },
  areaFilter(keys) {
    return keys.concat(++areaId);
  }
};

const idObj = {
  keysFilter: 'filter_os_version',
  deviceFilter: 'filter_device',
  versionFilter: 'filter_version',
  areaFilter: 'areaId'
};
class Device extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      showApp: false,
      download_url: '',
      isRevise: this.props.match.params.id,
      initData: {},
      // fileList: [],
      disabled: false,
      uploadUrl: ''
      // filter_os_version: ['1', '2', '3']
    };
  }

  componentWillMount() {
    console.log(this.props.match.params.id);
    if (this.props.match.params.id) {
      const obj = {
        id: this.props.match.params.id
      };
      this.queryPublish(obj);
    }
    // console.log(form.getFieldValue('filter_os_version'));
    // this.props.form.getFieldsValue('filter_os_version');
  }

  queryPublish = async obj => {
    const { form } = this.props;
    const res = await createApi.getVersionById(obj);
    if (res) {
      console.log(res);
      this.setState(
        {
          initData: {
            name: res.name,
            type: res.type,
            download_url: res.download_url,
            description: res.description,
            version: res.version,
            filter_os_name: res.filter_system.name,
            filter_os_version: res.filter_system.version,
            filter_device: res.filter_device,
            filter_version: res.filter_version,
            filter_account: res.filter_account,
            begin_time: res.begin_time,
            end_time: res.end_time
          }
        },
        () => {
          const { initData } = this.state;
          id = initData.filter_os_version.length;
          deviceId = initData.filter_device.length;
          versionId = initData.filter_version.length;
          this.setState({
            showApp: Boolean(initData.download_url)
          });
          // areaId = initData
          form.setFieldsValue({
            name: initData.name,
            upload: [
              {
                uid: '22'
              }
            ],
            type: initData.type,
            description: initData.description,
            version: initData.version,
            filter_os_name: initData.filter_os_name,
            filter_os_version: initData.filter_os_version,
            filter_account: initData.filter_account,
            filter_device: initData.filter_device,
            filter_version: initData.filter_version
          });
        }
      );
    }
  };

  publish = async obj => {
    const res = await createApi.publish(obj);
    if (res) {
      console.log(this.publish);
      this.$msg.success('新增成功');
    }
  };

  revisePublish = async obj => {
    const res = await createApi.reviseVersionById(obj);
    if (res) {
      this.$msg.success('修改成功');
    }
  };

  remove = (k, keyName) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(keyName);
    // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }

    // can use data-binding to set
    form.setFieldsValue({
      [keyName]: keys.filter(key => key !== k)
    });
  };

  add = keyName => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue(keyName);
    // const nextKeys = keys.concat(++id);
    console.dir(keyName);
    const nextKeys = nextKeysObj[keyName](keys);
    console.log(nextKeys);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      [keyName]: nextKeys
    });
  };

  handleSubmit = e => {
    console.log('点击了');
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const deviceData = {
          vendor: values.vendor,
          model: values.model
        };
        const versionData = {
          opcode: values.opcode,
          num: values.num,
          force: values.force || false
        };
        // console.log(handleData(deviceData));
        // console.log(handleData(versionData));
        console.log(
          new Date(values.updateTime[0].format('YYYY-MM-DD')).getTime()
        );
        const filterVersion =
          values.opcode && escapeEmpty(handleData(versionData));
        console.log(filterVersion);
        filterVersion &&
          filterVersion.map(item => {
            if (item.force === undefined) {
              item.force = false;
            }
          });
        const obj = {
          name: values.name,
          type: values.type,
          download_url:
            this.state.download_url || this.state.initData.download_url,
          description: values.description,
          version: values.version,
          filter_os_name: values.filter_os_name,
          filter_os_version: values.osVersion && escapeEmpty(values.osVersion),
          filter_device: values.vendor && escapeEmpty(handleData(deviceData)),
          filter_version: filterVersion,
          filter_account: values.filter_account,
          begin_time: new Date(
            values.updateTime[0].format('YYYY-MM-DD')
          ).getTime(),
          end_time: new Date(
            values.updateTime[0].format('YYYY-MM-DD')
          ).getTime()
        };
        if (!this.state.isRevise) {
          this.publish(handleObj(obj));
        } else {
          const reviseObj = {
            ...obj,
            id: this.props.match.params.id
          };
          this.revisePublish(handleObj(reviseObj));
        }
      }
    });
  };

  normFile = e => {
    console.log('Upload event:', e);
    // this.setState({
    //   fileList: e.fileList
    // });
    if (e.fileList.length) {
      this.setState({
        disabled: true
      });
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  handleUpload = file => {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    console.log(this.state.uploadUrl);
    // You can use any AJAX library you like
    reqwest({
      url: window.location.host.includes('localhost')
        ? this.state.uploadUrl.replace(
            'http://wwwblockchain.oss-cn-shenzhen.aliyuncs.com',
            '/oss'
          )
        : this.state.uploadUrl,
      method: 'put',
      // contentType: 'application/x-www-form-urlencoded',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      processData: false,
      data: formData,
      success: () => {
        // this.setState({
        //   fileList: []
        // });
        this.setState({
          download_url: this.state.uploadUrl.split('?')[0],
          showApp: true
        });
        this.$msg.success('upload successfully.');
      },
      error: () => {
        this.$msg.error('upload failed.');
      }
    });
  };

  uploadFile = async (obj, file) => {
    // this.setState({
    //   showApp: true
    // });
    const res = await createApi.uploadFile(obj);
    if (res && res.error_code === 1) {
      this.setState(
        {
          uploadUrl: res.data.url
        },
        () => {
          console.log(file);
          this.handleUpload(file);
        }
      );
    }
  };

  onRemove = () => {
    this.setState({
      disabled: false
    });
  };

  beforeUpload = (file, fileList) => {
    console.log(file, fileList);
    const obj = {
      openid: JSON.parse(sessionStorage.getItem('user')).openid,
      access_token: JSON.parse(sessionStorage.getItem('user')).access_token,
      name: `${parseInt(100 * Math.random())}${file.name}`,
      method_name: 'put'
    };
    this.uploadFile(obj, file);
    return false;
  };

  render() {
    console.log(timestampToTime(1546963200000));
    const { isRevise } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const smallFormItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 19 }
      }
    };

    const smallFormItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 20, offset: 0 },
        sm: { span: 19, offset: 5 }
      }
    };
    // getFieldDecorator('keys', { initialValue: [0] });
    // const keys = getFieldValue('keys');
    // const formItems = keys.map((k, index) => (
    //   <Form.Item
    //     {...(index === 0
    //       ? smallFormItemLayout
    //       : smallFormItemLayoutWithOutLabel)}
    //     label={index === 0 ? '升级平台系统版本' : ''}
    //     required={false}
    //     key={k}
    //     className={`${index ? styles.width50 : styles.width80}`}
    //   >
    //     {getFieldDecorator(`names [${k}]`, {
    //       validateTrigger: ['onChange', 'onBlur'],
    //       rules: [
    //         {
    //           required: true,
    //           whitespace: true,
    //           message: "Please input passenger's name or delete this field."
    //         }
    //       ]
    //     })(
    //       <Input
    //         placeholder="升级平台系统版本"
    //         style={{ width: '50%', marginRight: 8 }}
    //       />
    //     )}
    //     {keys.length > 1 ? (
    //       <Icon
    //         className="dynamic-delete-button"
    //         type="minus-circle-o"
    //         disabled={keys.length === 1}
    //         onClick={() => this.remove(k)}
    //       />
    //     ) : null}
    //     {index === keys.length - 1 && (
    //       <Button
    //         type="dashed"
    //         onClick={() => this.add()}
    //         style={{ width: '60%' }}
    //       >
    //         <Icon type="plus" /> 添加
    //       </Button>
    //     )}
    //   </Form.Item>
    // ));
    // getFieldDecorator('device', { initialValue: [0] });
    // const deviceKeys = getFieldValue('device');
    // // console.log(deviceKeys);
    // const deviceFormItems = deviceKeys.map((k, index) => (
    //   <Form.Item
    //     {...(index === 0
    //       ? smallFormItemLayout
    //       : smallFormItemLayoutWithOutLabel)}
    //     label={index === 0 ? '设备' : ''}
    //     required={false}
    //     key={k}
    //     className={`${index ? styles.width50 : styles.width80}`}
    //   >
    //     {getFieldDecorator(`device [${k}]`, {
    //       validateTrigger: ['onChange', 'onBlur'],
    //       rules: [
    //         {
    //           required: true,
    //           whitespace: true,
    //           message: "Please input passenger's name or delete this field."
    //         }
    //       ]
    //     })(
    //       <Input
    //         placeholder="升级设备"
    //         style={{ width: '50%', marginRight: 8 }}
    //       />
    //     )}
    //     {getFieldDecorator(`deviceV [${k}]`, {
    //       validateTrigger: ['onChange', 'onBlur'],
    //       rules: [
    //         // {
    //         //   required: true,
    //         //   whitespace: true,
    //         //   message: "Please input passenger's name or delete this field."
    //         // }
    //       ]
    //     })(
    //       <Input
    //         placeholder="升级设备版本"
    //         style={{ width: '50%', marginRight: 8 }}
    //       />
    //     )}
    //     {deviceKeys.length > 1 ? (
    //       <Icon
    //         className="dynamic-delete-button"
    //         type="minus-circle-o"
    //         disabled={keys.length === 1}
    //         onClick={() => this.removeDevice(k)}
    //       />
    //     ) : null}
    //     {index === deviceKeys.length - 1 && (
    //       <Button
    //         type="dashed"
    //         onClick={() => this.addDevice()}
    //         style={{ width: '60%' }}
    //       >
    //         <Icon type="plus" /> 添加
    //       </Button>
    //     )}
    //   </Form.Item>
    // ));
    // getFieldDecorator('keys', { initialValue: [0] });
    // const keys = getFieldValue('keys');
    // getFieldDecorator('device', { initialValue: [0] });
    // const deviceKeys = getFieldValue('device');
    // // console.log(keys);
    // getFieldDecorator('device', { initialValue: [0] });
    const { initData } = this.state;
    console.log(initData.begin_time);
    const rangeConfig = {
      initialValue: [
        initData.begin_time &&
          moment(timestampToTime(initData.begin_time), 'YYYY/MM/DD'),
        initData.end_time &&
          moment(timestampToTime(initData.end_time), 'YYYY/MM/DD')
      ],
      rules: [{ type: 'array' }]
    };

    // console.log(this);
    const formItems = (keyName, label) => {
      getFieldDecorator(keyName, {
        initialValue:
          (initData[idObj[keyName]] &&
            (initData[idObj[keyName]].length &&
              numToArr(initData[idObj[keyName]].length))) ||
          (!this.state.isRevise ? [0] : [])
      });
      const keys = getFieldValue(keyName);

      return keys.map((k, index) => (
        // <Col key={k}>
        <Form.Item
          {...(index === 0
            ? smallFormItemLayout
            : smallFormItemLayoutWithOutLabel)}
          label={index === 0 ? label : ''}
          required={false}
          key={k}
          className={`${index ? styles.width50 : styles.width80}`}
        >
          {keyName === 'keysFilter' &&
            getFieldDecorator(`osVersion[${k}]`, {
              initialValue:
                initData.filter_os_version && initData.filter_os_version[k],
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  whitespace: true
                },
                { min: 1, max: 16, message: '最少1位，最多16位!' }
              ]
            })(
              <Input
                placeholder={label}
                style={{ width: '50%', marginRight: 8 }}
              />
            )}
          {keyName === 'deviceFilter' &&
            getFieldDecorator(`vendor[${k}]`, {
              initialValue:
                initData.filter_device &&
                initData.filter_device[k] &&
                initData.filter_device[k].vendor,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input vendor's name or delete this field."
                },
                { min: 2, max: 16, message: '最少2位，最多16位!' }
              ]
            })(
              <Input
                placeholder="指定设备"
                style={{ width: '40%', marginRight: 8 }}
              />
            )}
          {keyName === 'deviceFilter' &&
            getFieldDecorator(`model[${k}]`, {
              initialValue:
                initData.filter_device &&
                initData.filter_device[k] &&
                initData.filter_device[k].model,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  // required: true,
                  whitespace: true
                  // message:
                  //   "Please input passenger's name or delete this field."
                },
                { min: 1, max: 16, message: '最少1位，最多16位!' }
              ]
            })(
              <Input
                placeholder="指定设备型号"
                style={{ width: '40%', marginRight: 8 }}
              />
            )}
          {keyName === 'versionFilter' &&
            getFieldDecorator(`opcode[${k}]`, {
              initialValue:
                initData.filter_version &&
                initData.filter_version[k] &&
                initData.filter_version[k].opcode,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{ required: true, message: 'Please select your opcode!' }]
            })(
              <Select
                placeholder="Please select a opcode"
                style={{ width: '20%', marginRight: 8 }}
              >
                <Option value=">"> &gt; </Option>
                <Option value="="> = </Option>
                <Option value="<"> &lt; </Option>
                <Option value="~"> != </Option>
              </Select>
            )}
          {keyName === 'versionFilter' &&
            getFieldDecorator(`num[${k}]`, {
              initialValue:
                initData.filter_version &&
                initData.filter_version[k] &&
                initData.filter_version[k].num,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  // whitespace: true,
                  message: '请输入版本号'
                }
              ]
            })(
              <Input
                placeholder="版本号"
                type="number"
                style={{ width: '30%', marginRight: 8 }}
              />
            )}
          {keyName === 'versionFilter' &&
            getFieldDecorator(`force[${k}]`, {
              initialValue:
                initData.filter_version &&
                initData.filter_version[k] &&
                initData.filter_version[k].force,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{ required: true, message: 'Please select your opcode!' }]
            })(
              <Select
                placeholder="Please select a opcode"
                style={{ width: '20%', marginRight: 8 }}
              >
                <Option value> 强制升级 </Option>
                <Option value={false}> 不强制升级 </Option>
              </Select>
            )}
          {/* keys.length > 1 ? */}
          {
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              // disabled={keys.length === 1}
              onClick={() => this.remove(k, keyName)}
            />
          }
          {/* {index === keys.length - 1 && (
              <Button
                type="dashed"
                onClick={() => this.add(keyName)}
                style={{ width: '60%' }}
              >
                <Icon type="plus" /> 添加
              </Button>
            )} */}
        </Form.Item>
      ));
    };
    console.log(isRevise);
    console.log(initData);
    if ((isRevise && initData.name) || !isRevise) {
      return (
        <div className={`versionWrapper ${styles.versionWrapper}`}>
          <div className={`versionFormWrap ${styles.versionFormWrap}`}>
            <Form
              onSubmit={this.handleSubmit}
              className={`versionForm ${styles.versionForm}`}
            >
              <Form.Item {...formItemLayout} label="当前版本名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入当前版本名称!'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="版本类型">
                {getFieldDecorator('type', {
                  rules: [
                    {
                      required: true,
                      message: '请输入支持版本!'
                    }
                  ]
                })(
                  <Select
                    placeholder="Please select a version"
                    style={{ width: '50%', marginRight: 8 }}
                  >
                    <Option value="Release">Release</Option>
                    <Option value="Beta">Beta</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="上传APP"
                className={this.state.showApp && 'noFirst'}
                // extra="longgggggggggggggggggggggggggggggggggg"
              >
                {getFieldDecorator('upload', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                  rules: [
                    {
                      required: true,
                      message: '请上传APP'
                    }
                    // {
                    //   validator: this.validateToPassword
                    // }
                  ]
                })(
                  <Upload
                    name="logo"
                    action={this.state.uploadUrl}
                    showUploadList={false}
                    // listType="picture"
                    disabled={this.state.disabled || this.state.showApp}
                    beforeUpload={this.beforeUpload}
                    onRemove={this.onRemove}
                  >
                    <Button>
                      <Icon type="upload" /> Click to upload
                    </Button>
                  </Upload>
                )}
                {/* this.state.download_url || */}
                {((isRevise && initData.download_url) || !isRevise) &&
                  this.state.showApp && (
                    // <li className={styles.li}>
                    //   <a href={initData.download_url}>APP</a>
                    //   <Icon
                    //     type="close"
                    //     onClick={() => this.setState({ showApp: false })}
                    //   />
                    // </li>
                    <div className="ant-upload-list-item ant-upload-list-item-undefined">
                      <div className="ant-upload-list-item-info">
                        <span>
                          <i className="anticon anticon-paper-clip">
                            <svg
                              viewBox="64 64 896 896"
                              className=""
                              data-icon="paper-clip"
                              width="1em"
                              height="1em"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z" />
                            </svg>
                          </i>
                          <a
                            className="ant-upload-list-item-name"
                            title="about_chinese.jpg"
                            href={
                              this.state.download_url || initData.download_url
                            }
                          >
                            {this.state.download_url || initData.download_url}
                          </a>
                        </span>
                      </div>
                      <i
                        title="Remove file"
                        className="anticon anticon-close"
                        onClick={() =>
                          this.setState({ showApp: false, disabled: false })
                        }
                      >
                        <svg
                          viewBox="64 64 896 896"
                          className=""
                          data-icon="close"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                        </svg>
                      </i>
                    </div>
                  )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="版本描述">
                {getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: '请输入版本描述!'
                    },
                    { min: 10, max: 256, message: '最少10位，最多256位!' }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="发布的版本号">
                {getFieldDecorator('version', {
                  rules: [
                    {
                      required: true,
                      message: '请输入当前发布的版本号!'
                    }
                  ]
                })(<Input type="number" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="升级平台" hasFeedback>
                {getFieldDecorator('filter_os_name', {
                  rules: [{ required: true, message: '请选择升级平台!' }]
                })(
                  <Select placeholder="Please select a platForm">
                    <Option value="iOS">iOS</Option>
                    <Option value="Android">Android</Option>
                  </Select>
                )}
              </Form.Item>
              {formItems('keysFilter', '升级平台系统版本')}
              <Form.Item {...smallFormItemLayoutWithOutLabel}>
                <Row type="flex" justify="center">
                  <Col span={12}>
                    <Button
                      type="dashed"
                      onClick={() => this.add('keysFilter')}
                      style={{ width: '60%' }}
                    >
                      <Icon type="plus" /> 添加升级平台系统版本
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              {formItems('deviceFilter', '指定过滤设备')}
              <Form.Item {...smallFormItemLayoutWithOutLabel}>
                <Row type="flex" justify="center">
                  <Col span={12}>
                    <Button
                      type="dashed"
                      onClick={() => this.add('deviceFilter')}
                      style={{ width: '60%' }}
                    >
                      <Icon type="plus" /> 添加指定过滤设备
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              {formItems('versionFilter', '过滤客户端版本号')}
              <Form.Item {...smallFormItemLayoutWithOutLabel}>
                <Row type="flex" justify="center">
                  <Col span={12}>
                    <Button
                      type="dashed"
                      onClick={() => this.add('versionFilter')}
                      style={{ width: '60%' }}
                    >
                      <Icon type="plus" /> 添加过滤客户端版本号
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item {...formItemLayout} label="升级时间">
                {getFieldDecorator('updateTime', rangeConfig)(<RangePicker />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="指定用户ID升级">
                {getFieldDecorator('filter_account', {})(
                  <TextArea
                    placeholder="指定用户ID升级,js的一个表达式返回true升级,通过account_id获取用户ID"
                    autosize={{ minRows: 4 }}
                  />
                )}
              </Form.Item>
              {/* {deviceFormItems} */}
              {/* {formItems('device', deviceKeys, '过滤设备', 'name')} */}
              <Form.Item>
                <Row type="flex" justify="center">
                  <Col span={8}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="btn-block btn-lg"
                    >
                      确定
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default Form.create()(Device);
