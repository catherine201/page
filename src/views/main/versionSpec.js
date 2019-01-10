import React from 'react';
import { Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { numToArr, timestampToTime } from '../../utils';
import createApi from '../../api/version';

const { RangePicker } = DatePicker;
const { Option } = Select;

const idObj = {
  keysFilter: 'filter_os_version',
  deviceFilter: 'filter_device',
  versionFilter: 'filter_version',
  areaFilter: 'areaId'
};
class VersionSpec extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      showApp: false,
      download_url: '',
      isRevise: this.props.id,
      initData: {}
      // filter_os_version: ['1', '2', '3']
    };
  }

  componentWillMount() {
    console.log(this.props);
    const obj = {
      id: this.props.id
    };
    if (this.props.id) {
      this.queryPublish(obj);
    }
  }

  queryPublish = async obj => {
    // const { form } = this.props;
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
          this.setState({
            showApp: Boolean(initData.download_url)
          });
        }
      );
    }
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
      if (initData[idObj[keyName]].length) {
        return keys.map((k, index) => (
          <Form.Item
            {...(index === 0
              ? smallFormItemLayout
              : smallFormItemLayoutWithOutLabel)}
            label={index === 0 ? label : ''}
            required={false}
            key={k}
            className={`${index ? styles.width50 : styles.width80}`}
          >
            {keyName === 'keysFilter' && (
              <span>{initData.filter_os_version[k]}</span>
            )}
            {keyName === 'deviceFilter' && (
              <span
                style={{
                  width: '30%',
                  marginRight: 8,
                  display: 'inline-block'
                }}
              >
                {`指定设备: ${initData.filter_device[k].vendor}`}
              </span>
            )}
            {keyName === 'deviceFilter' && (
              <span style={{ width: '30%', marginRight: 8 }}>
                {`指定设备型号: ${initData.filter_device[k].model || '无'}`}
              </span>
            )}
            {keyName === 'versionFilter' &&
              getFieldDecorator(`opcode[${k}]`, {
                initialValue:
                  initData.filter_version &&
                  initData.filter_version[k] &&
                  initData.filter_version[k].opcode,
                validateTrigger: ['onChange', 'onBlur']
              })(
                <Select disabled style={{ width: '20%', marginRight: 8 }}>
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
                validateTrigger: ['onChange', 'onBlur']
              })(
                <Input
                  disabled
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
                validateTrigger: ['onChange', 'onBlur']
              })(
                <Select
                  disabled
                  placeholder="Please select a opcode"
                  style={{ width: '20%', marginRight: 8 }}
                >
                  <Option value> 强制升级 </Option>
                  <Option value={false}> 不强制升级 </Option>
                </Select>
              )}
          </Form.Item>
        ));
      }
      return (
        <Form.Item label={label} {...smallFormItemLayout}>
          无
        </Form.Item>
      );
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
                <span>{initData.name}</span>
              </Form.Item>
              <Form.Item {...formItemLayout} label="版本类型">
                <span>{initData.type}</span>
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="下载地址"
                className={this.state.showApp && 'noFirst'}
                // extra="longgggggggggggggggggggggggggggggggggg"
              >
                {((isRevise && initData.download_url) || !isRevise) &&
                  this.state.showApp && (
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
                    </div>
                  )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="版本描述">
                <span>{initData.description}</span>
              </Form.Item>
              <Form.Item {...formItemLayout} label="发布的版本号">
                <span>{initData.version}</span>
              </Form.Item>
              <Form.Item {...formItemLayout} label="升级平台" hasFeedback>
                <span>{initData.filter_os_name}</span>
              </Form.Item>
              {/* initData.filter_os_version.length && */}
              {formItems('keysFilter', '升级平台系统版本')}
              {formItems('deviceFilter', '指定过滤设备')}
              {formItems('versionFilter', '过滤客户端版本号')}
              <Form.Item {...formItemLayout} label="升级时间">
                {getFieldDecorator('updateTime', rangeConfig)(
                  <RangePicker disabled />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="指定用户ID升级">
                <span>{initData.filter_account || '无'}</span>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default Form.create()(VersionSpec);
