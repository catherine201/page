import React from 'react';
import { Table, Icon, Modal } from 'antd';
import styles from './index.less';
import createApi from '../../api/version';
import VersionSpec from './versionSpec';

class Main extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 6
      },
      id: '1',
      data: [],
      limit: 6 // 一页多少个项
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const obj = {
      limit: 6,
      offset: 0
    };
    this.queryPublish(obj);
  }

  handleTableChange = pagination => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    const obj = {
      limit: 6,
      offset: (pagination.current - 1) * this.state.limit
    };
    this.queryPublish(obj);
    this.setState({
      pagination: pager
    });
  };

  handleEdit = id => {
    this.props.history.push(`/admin/publish/${id}`);
  };

  handleView = id => {
    console.log(id);
    this.setState(
      {
        id
      },
      () => {
        this.setState({
          showModal: true
        });
      }
    );
  };

  handleCancel = () => {
    this.setState({
      showModal: false
    });
  };

  queryPublish = async obj => {
    const res = await createApi.getVersion(obj);
    if (res) {
      // console.log(res);
      const pagination = { ...this.state.pagination };
      // pagination.total = res.paging.total;
      // console.log(res.paging.total);
      pagination.total = res.paging.total;
      this.setState({
        pagination,
        data: res.datas
      });
      console.log(this.state.data);
    }
  };

  render() {
    const columns = [
      {
        title: '版本名称',
        dataIndex: 'name',
        key: 'name',
        width: '8%'
      },
      {
        title: '支持版本',
        dataIndex: 'type',
        key: 'type',
        width: '8%'
      },
      {
        title: 'APP下载地址',
        dataIndex: 'download_url',
        key: 'download_url',
        width: '20%'
      },
      {
        title: '版本描述',
        dataIndex: 'description',
        key: 'description',
        width: '15%'
      },
      {
        title: '发布的版本号',
        dataIndex: 'version',
        key: 'version',
        width: '8%'
      },
      {
        title: '升级平台',
        dataIndex: 'filter_os_name',
        key: 'filter_os_name',
        width: '10%'
      },
      {
        title: '操作',
        // dataIndex: 'teams',
        // key: 'teams',
        width: '20%',
        render: text => (
          <span>
            <Icon
              className={`${styles.Icon}`}
              type="form"
              onClick={() => {
                this.handleEdit(text._id);
              }}
            />
            <Icon
              className={`${styles.IconEye}`}
              type="eye"
              onClick={() => {
                this.handleView(text._id);
              }}
            />
          </span>
        )
      }
    ];
    return (
      <div className={`groupMsg_wrapper ${styles.groupMsg_wrapper}`}>
        <div className={`flex ${styles.result_top}`}>
          <h2>查询结果: </h2>
          {/* <Button type="primary" onClick={e => this.toShowModal(e, 1)}>
            新增
          </Button> */}
        </div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          rowKey={record => {
            console.log(record._id);
            return record._id;
          }}
        />
        <Modal
          className={`groupMsg_modal ${this.state.showModal ? 'noFooter' : ''}`}
          title="版本详情"
          width={860}
          visible={Boolean(this.state.showModal)}
          // centered
          okText="确认"
          cancelText="取消"
          onCancel={this.handleCancel}
        >
          {this.state.showModal && <VersionSpec id={this.state.id} />}
        </Modal>
      </div>
    );
  }
}
export default Main;
