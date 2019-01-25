import React from 'react';
import { Layout, Menu, Icon, Popover, Divider } from 'antd';
import { connect } from 'react-redux';
import createApi from '../../../api/article';
import { FirstLastChange, getNowFormatDate } from '../../../utils';
import styles from './index.less';

// const { SubMenu } = Menu;
const { Sider } = Layout;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_558012_rlj4y8cy1uo.js'
});

class NoteBooks extends React.Component {
  constructor() {
    super();
    this.state = {
      clientWidth: document.body.offsetWidth * 0.24, // 屏幕宽度
      reverseFlag: false, // 是否最后一个变为第一个
      // limit: 100,
      // menu: [],
      addIng: false,
      ownMenuArr: []
    };
    this.popoverContent = this.popoverContent.bind(this);
  }

  componentDidMount() {
    console.log('组件重新渲染');
    const _this = this;
    window.addEventListener('resize', () => {
      _this.setState({
        clientWidth: document.body.offsetWidth * 0.24
      });
    });
    this.$center.$on('initAgain', () => {
      console.log('修改标题');
      const obj = {
        access_token: JSON.parse(sessionStorage.getItem('user'))
          .second_access_token,
        article_path: this.props.match.params.folder,
        limit: 100,
        offset: 0
      };
      this.props.getArticleFile(obj).then(res => {
        this.setState({
          ownMenuArr: res.data.datas
        });
      });
    });
    // this.init();
    if (this.props.match.params.folder) {
      const obj = {
        access_token: JSON.parse(sessionStorage.getItem('user'))
          .second_access_token,
        article_path: this.props.match.params.folder,
        limit: 100,
        offset: 0
      };
      !this.props.articleFile.init
        ? this.props.getArticleFile(obj).then(res => {
            this.setState({
              ownMenuArr: res.data.datas
            });
          })
        : this.setState({
            ownMenuArr: this.props.articleFile.data.datas
          });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.folder !== this.props.match.params.folder) {
      console.log('componentWillReceiveProps');
      const obj = {
        access_token: JSON.parse(sessionStorage.getItem('user'))
          .second_access_token,
        article_path: nextProps.match.params.folder,
        limit: 100,
        offset: 0
      };
      !this.props.articleFile.init
        ? this.props.getArticleFile(obj).then(res => {
            this.setState({
              ownMenuArr: res.data.datas
            });
          })
        : this.setState({
            ownMenuArr: this.props.articleFile.data.datas
          });
      // this.queryFileByFolder(obj);
    }
  }

  componentWillUnmount() {
    const _this = this;
    window.removeEventListener('resize', () => {
      _this.setState({
        clientWidth: document.body.offsetWidth * 0.14
      });
    });
    this.$center.$off('initAgain');
    this.setState = () => {};
  }

  init = id => {
    const obj = {
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      article_path: this.props.match.params.folder,
      limit: 100,
      offset: 0
    };
    this.queryFileByFolder(obj, id);
  };

  queryFileByFolder = (obj, id) => {
    this.props.getArticleFile(obj).then(res => {
      this.setState(
        {
          ownMenuArr: this.state.reverseFlag
            ? FirstLastChange(res.data.datas)
            : res.data.datas
        },
        () => {
          this.setState({
            reverseFlag: false
          });
        }
      );
      id
        ? this.props.history.push(
            `/article/notebooks/${this.props.match.params.folder}/notes/${id}`
          )
        : this.props.history.push(
            `/article/notebooks/${this.props.match.params.folder}/notes/${res
              .data.datas.length && res.data.datas[0]._id}`
          );
    });
  };

  publishNow = (id, title) => {
    console.log(id, title);
    const obj = {
      id,
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      status: 'shelve'
    };
    this.reviseArticleStatusApi(obj, id);
  };

  // 发布文章
  reviseArticleStatusApi = async (obj, id) => {
    const res = await createApi.reviseArticleStatus(obj);
    if (res) {
      this.init(id);
    }
  };

  // 删除文章
  deleteArticleApi = async (obj, id) => {
    const res = await createApi.deleteArticle(obj);
    if (res) {
      this.init(id);
    }
  };

  handleDeleteFile = (id, nextId) => {
    const obj = {
      id,
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token
    };
    this.deleteArticleApi(obj, nextId);
  };

  deleteFile = (id, title) => {
    let nextId = '';
    this.state.ownMenuArr.map((item, index) => {
      if (item._id === id && index !== this.state.ownMenuArr.length - 1) {
        nextId = this.state.ownMenuArr[index + 1]._id;
      } else if (
        item._id === id &&
        index === this.state.ownMenuArr.length - 1
      ) {
        nextId = this.state.ownMenuArr[index - 1]._id;
      }
    });
    this.$modal.confirm({
      content: `确认删除文章《${title}》，文章将被移动到回收站。`,
      okText: '确定',
      cancelText: '取消',
      className: 'noIcon',
      onOk: () => {
        this.handleDeleteFile(id, nextId);
      }
    });
  };

  popoverContent = (id, title) => (
    <div>
      <div
        className="popoverLi_item"
        onClick={() => {
          this.publishNow(id, title);
        }}
      >
        <IconFont type="icon-bushufabu" />
        直接发布
      </div>
      <Divider className={styles.Divider} />
      <div
        className="popoverLi_item"
        onClick={() => {
          this.deleteFile(id, title);
        }}
      >
        <Icon type="delete" />
        删除文章
      </div>
    </div>
  );

  toHref = key => {
    this.props.history.push(
      `/article/notebooks/${this.props.match.params.folder}/notes/${key}`
    );
  };

  generateMenu = function(menus) {
    let items = [];
    items = menus.map(menu => (
      <Menu.Item
        key={menu._id}
        className={`${styles.menu_item}
        ${this.props.match.params.file === menu._id &&
          styles.menu_item_active}`}
        onClick={() => {
          this.toHref(menu._id);
        }}
      >
        <span>
          {menu.status !== 'shelve' ? (
            <Icon type="file" />
          ) : (
            <Icon type="file-done" className={styles.file_done} />
          )}
          <span className="nav-text">{menu.title}</span>
        </span>
        <Popover
          placement="bottomRight"
          content={this.popoverContent(menu._id, menu.title)}
          trigger="hover"
          className={styles.setting_Popover}
        >
          <Icon type="setting" />
        </Popover>
      </Menu.Item>
    ));
    return items;
  };

  addArticleApi = async obj => {
    const res = await createApi.addArticle(obj);
    if (res) {
      this.setState(
        {
          addIng: false,
          reverseFlag: false
        },
        () => {
          console.log(res.data.id);
          this.init(res.data.id);
        }
      );
    }
  };

  // 添加文章
  addArticle = () => {
    const obj = {
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      article_path: this.props.match.params.folder,
      title: getNowFormatDate()
    };
    this.setState({
      addIng: true
    });
    this.addArticleApi(obj);
  };
  // toHref(target) {
  //   console.log(target);
  //   console.log(this);
  //   this.props.history.push(`admin/${target}`);
  // }

  render() {
    const { ownMenuArr, addIng, clientWidth } = this.state;
    return (
      <Sider
        className={styles.article_mid_sider}
        width={clientWidth}
        theme="light"
      >
        <div
          className={styles.add_mid_article}
          onClick={() => this.addArticle()}
        >
          <Icon type="plus" />
          新建文章{addIng && '中...'}
        </div>
        <div className={styles.menu_mid_wrap}>
          <Menu theme="light" mode="inline">
            {this.generateMenu(ownMenuArr)}
          </Menu>
        </div>
        <div
          className={styles.add_mid_article}
          onClick={() => this.addArticle()}
        >
          <Icon type="plus" />
          在下方新建文章{addIng && '中...'}
        </div>
      </Sider>
    );
  }
}

// export default AppSider;
const mapStateToProps = state => ({
  articleFile: state.article.articleFile
});

const mapDispatchToProps = dispatch => ({
  getArticleFile: dispatch.article.getArticleFile
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteBooks);
