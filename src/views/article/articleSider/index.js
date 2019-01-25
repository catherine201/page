import React from 'react';
import { Layout, Menu, Icon, Input, Popover, Divider, Modal } from 'antd';
import { connect } from 'react-redux';
import createApi from '../../../api/article';
// import { FirstLastChange } from '../../../utils';
import styles from './index.less';

// const { SubMenu } = Menu;
const { Sider } = Layout;

// const keyNum = '29665234';
// let initFlag = false;

class ArticleSider extends React.Component {
  constructor() {
    super();
    this.state = {
      clientWidth: document.body.offsetWidth * 0.14, // 屏幕宽度
      // reverseFlag: false, // 是否最后一个变为第一个
      folderName: '',
      reviseFolderName: '',
      reviseFolderId: '',
      showAddClassify: false,
      reviseModelShow: false,
      // limit: 100,
      // menu: [],
      ownMenuArr: []
    };
    this.popoverContent = this.popoverContent.bind(this);
    this.handleAddFolders = this.handleAddFolders.bind(this);
  }

  componentDidMount() {
    const _this = this;
    window.addEventListener('resize', () => {
      _this.setState({
        clientWidth: document.body.offsetWidth * 0.14
      });
    });
    if (!this.props.articleFolder.init) {
      this.props.getArticleFolder().then(res => {
        this.setState(
          {
            ownMenuArr: res.data.datas
          },
          () => {
            res.data.datas.length &&
              this.props.history.push(
                `/article/notebooks/${this.state.ownMenuArr[0]._id}`
              );
            if (res.data.datas.length) {
              const folderId = this.state.ownMenuArr[0]._id;
              const obj = {
                access_token: JSON.parse(sessionStorage.getItem('user'))
                  .second_access_token,
                article_path: folderId,
                limit: 100,
                offset: 0
              };
              // this.queryFileByFolder(obj, key);
              this.props.getArticleFile(obj).then(result => {
                result.data.datas.length
                  ? this.props.history.push(
                      `/article/notebooks/${folderId}/notes/${
                        result.data.datas[0]._id
                      }`
                    )
                  : this.props.history.push(
                      `/article/notebooks/${folderId}/notes`
                    );
              });
            }
          }
        );
      });
    } else {
      this.setState({
        ownMenuArr: this.props.articleFolder.data.datas
      });
      this.props.match.params.folder
        ? this.props.match.params.file
          ? this.props.history.push(
              `/article/notebooks/${this.props.match.params.folder}/notes/${
                this.props.match.params.file
              }`
            )
          : this.props.history.push(
              `/article/notebooks/${this.props.match.params.folder}/notes`
            )
        : this.props.history.push(`/article/notebooks`);
    }
    // !this.props.articleFolder.init
    //   ? this.props.getArticleFolder().then(res => {
    //       this.setState(
    //         {
    //           ownMenuArr: res.data.datas
    //         },
    //         () => {
    //           res.data.datas.length &&
    //             this.props.history.push(
    //               `/article/notebooks/${this.state.ownMenuArr[0]._id}`
    //             );
    //           if (res.data.datas.length) {
    //             const folderId = this.state.ownMenuArr[0]._id;
    //             const obj = {
    //               access_token: JSON.parse(sessionStorage.getItem('user'))
    //                 .second_access_token,
    //               article_path: folderId,
    //               limit: 100,
    //               offset: 0
    //             };
    //             // this.queryFileByFolder(obj, key);
    //             this.props.getArticleFile(obj).then(result => {
    //               result.data.datas.length
    //                 ? this.props.history.push(
    //                     `/article/notebooks/${folderId}/notes/${
    //                       result.data.datas[0]._id
    //                     }`
    //                   )
    //                 : this.props.history.push(
    //                     `/article/notebooks/${folderId}/notes`
    //                   );
    //             });
    //           }
    //         }
    //       );
    //     })
    //   : this.setState({
    //       ownMenuArr: this.props.articleFolder.data.datas
    //     });
  }

  // shouldComponentUpdate(nextProps) {
  //   console.log(nextProps.match.params.folder);
  //   return nextProps.match.params.folder === undefined;
  // }

  componentWillUnmount() {
    const _this = this;
    window.removeEventListener('resize', () => {
      _this.setState({
        clientWidth: document.body.offsetWidth * 0.14
      });
    });
    this.setState = () => {};
  }

  init = (id, fileId) => {
    const obj = {
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      limit: 100,
      offset: 0
    };
    this.queryFolders(obj, id, fileId);
  };

  // 查询文集
  queryFolders = (obj, id, fileId) => {
    console.log(id);
    this.props.getArticleFolder().then(res => {
      console.log(id);
      this.setState({
        // ownMenuArr: this.state.reverseFlag
        //   ? FirstLastChange(res.data.datas)
        //   : res.data.datas
        ownMenuArr: res.data.datas
      });
      id
        ? fileId
          ? this.props.history.push(`/article/notebooks/${id}/notes/${fileId}`)
          : res.data.datas.length
          ? this.props.history.push(`/article/notebooks/${id}`)
          : this.props.history.push(`/article/notebooks`)
        : this.props.history.push(
            `/article/notebooks/${this.props.match.params.folder ||
              res.data.datas[0]._id}`
          );
    });
    // const res = await createApi.queryFolders(obj);
    // if (res) {
    //   this.setState(
    //     {
    //       ownMenuArr: this.state.reverseFlag
    //         ? FirstLastChange(res.data.datas)
    //         : res.data.datas
    //     },
    //     () => {
    //       console.log(id);
    //       if (!initFlag) {
    //         console.log('again');
    //         id
    //           ? this.props.history.push(`/article/notebooks/${id}`)
    //           : this.props.history.push(
    //               `/article/notebooks/${this.props.match.params.folder ||
    //                 this.state.ownMenuArr[0]._id}`
    //             );
    //       }
    //       this.setState({
    //         reverseFlag: false
    //       });
    //     }
    //   );
    // }
  };

  onChangeFolderName = e => {
    this.setState({
      reviseFolderName: e.target.value
    });
  };

  // handleReviseFolder = () => {
  //   console.log('修改api');
  // };

  // 修改文集
  reviseFolderApi = async (obj, id) => {
    const res = await createApi.reviseFolder(obj);
    if (res) {
      this.setState({
        reviseFolderName: '',
        reviseFolderId: '',
        reviseModelShow: false
      });
      const fileObj = {
        access_token: JSON.parse(sessionStorage.getItem('user'))
          .second_access_token,
        article_path: id,
        limit: 100,
        offset: 0
      };
      this.props.getArticleFile(fileObj).then(res => {
        const fileId = res.data.datas.length && res.data.datas[0]._id;
        this.init(id, fileId);
      });
    }
  };

  confirmReviseFolder = () => {
    const obj = {
      id: this.state.reviseFolderId,
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      name: this.state.reviseFolderName
    };
    const id = this.state.reviseFolderId;
    this.reviseFolderApi(obj, id);
  };

  cancleReviseFolder = () => {
    this.setState({
      reviseFolderName: '',
      reviseFolderId: '',
      reviseModelShow: false
    });
  };

  reviseFolder = (e, id, name) => {
    e.stopPropagation();
    this.setState({
      reviseFolderId: id,
      reviseFolderName: name,
      reviseModelShow: true
    });
  };

  // 删除文集
  deleteFolderApi = async (obj, id) => {
    console.log(id);
    const res = await createApi.deleteFolder(obj);
    if (res) {
      const fileObj = {
        access_token: JSON.parse(sessionStorage.getItem('user'))
          .second_access_token,
        article_path: id,
        limit: 100,
        offset: 0
      };
      // this.queryFileByFolder(obj, key);
      this.props.getArticleFile(fileObj).then(res => {
        const fileId = res.data.datas.length && res.data.datas[0]._id;
        this.init(id, fileId);
      });
    }
  };

  handleDeleteFolder = (id, nextId) => {
    const obj = {
      id,
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token
    };
    this.deleteFolderApi(obj, nextId);
  };

  deleteFolder = (id, name) => {
    let nextId = '';
    this.state.ownMenuArr.map((item, index) => {
      if (item._id === id && index !== this.state.ownMenuArr.length - 1) {
        nextId = this.state.ownMenuArr[index + 1]._id;
      } else if (
        item._id === id &&
        index === this.state.ownMenuArr.length - 1 &&
        index !== 0
      ) {
        nextId = this.state.ownMenuArr[index - 1]._id;
      } else if (index === 0) {
        nextId = this.state.ownMenuArr[index]._id;
      }
    });
    console.log(nextId);
    this.$modal.confirm({
      content: `确认删除文集《${name}》，文章将被移动到回收站。`,
      okText: '确定',
      cancelText: '取消',
      className: 'noIcon',
      onOk: () => {
        this.handleDeleteFolder(id, nextId);
      }
    });
  };

  popoverContent = (id, name) => (
    <div>
      <div
        className="popoverLi_item"
        onClick={e => {
          this.reviseFolder(e, id, name);
        }}
      >
        <Icon type="edit" />
        修改文集
      </div>
      <Divider className={styles.Divider} />
      <div
        className="popoverLi_item"
        onClick={() => {
          this.deleteFolder(id, name);
        }}
      >
        <Icon type="delete" />
        删除文集
      </div>
    </div>
  );

  toHref = key => {
    const obj = {
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      article_path: key,
      limit: 100,
      offset: 0
    };
    // this.queryFileByFolder(obj, key);
    this.props.getArticleFile(obj).then(res => {
      res.data.datas.length
        ? this.props.history.push(
            `/article/notebooks/${key}/notes/${res.data.datas[0]._id}`
          )
        : this.props.history.push(`/article/notebooks/${key}/notes`);
    });
    // this.props.history.push(`/article/notebooks/${key}`);
  };

  generateMenu = function(menus) {
    let items = [];
    items = menus.map(menu => (
      <Menu.Item
        key={menu._id}
        className={`${styles.menu_item}
          ${this.props.match.params.folder === menu._id &&
            styles.menu_item_active}`}
        onClick={() => {
          this.toHref(menu._id);
        }}
      >
        <span className="nav-text">{menu.name}</span>
        {this.props.match.params.folder === menu._id}
        {this.props.match.params.folder === menu._id && (
          <Popover
            placement="bottomRight"
            content={this.popoverContent(menu._id, menu.name)}
            trigger="hover"
            className={styles.setting_Popover}
          >
            <Icon type="setting" />
          </Popover>
        )}
      </Menu.Item>
    ));
    return items;
  };

  onChangeName = e => {
    this.setState({ folderName: e.target.value });
  };

  // 添加文集
  addFolder = async obj => {
    const res = await createApi.addFolder(obj);
    if (res) {
      this.setState(
        {
          // reverseFlag: false,
          showAddClassify: false,
          reviseFolderName: ''
        },
        () => {
          const fileObj = {
            access_token: JSON.parse(sessionStorage.getItem('user'))
              .second_access_token,
            article_path: res.data.id,
            limit: 100,
            offset: 0
          };
          this.props.getArticleFile(fileObj).then(() => {
            this.init(res.data.id);
          });
        }
      );
    }
  };

  // 提交增加文集
  handleAddFolders = () => {
    const obj = {
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      name: this.state.folderName
    };
    this.addFolder(obj);
    // this.state.ownMenuArr.unshift({
    //   key: `${keyNum++}`,
    //   name: this.state.folderName
    // });
    // this.setState({
    //   ownMenuArr: this.state.ownMenuArr
    // });
  };

  render() {
    const { ownMenuArr, showAddClassify, folderName, clientWidth } = this.state;
    return (
      <Sider className={styles.article_sider} width={clientWidth}>
        <div className={styles.back_home_btn}>回 首 页</div>
        <div className={styles.add_article}>
          <p
            className={styles.add_article_p}
            onClick={() => {
              this.setState({ showAddClassify: true });
            }}
          >
            <Icon type="plus" />
            新建文集
          </p>
          <div
            className={
              showAddClassify
                ? styles.add_article_form
                : styles.add_article_form_hide
            }
          >
            <Input
              value={folderName}
              placeholder="请输入文集名..."
              className={styles.article_name_input}
              onPressEnter={this.handleAddFolders}
              onChange={this.onChangeName}
            />
            <div className={`flex ${styles.add_article_confirm}`}>
              <div
                className={styles.submit_btn}
                onClick={this.handleAddFolders}
              >
                提交
              </div>
              <span
                className={`cursor ${styles.cancel_word}`}
                onClick={() => {
                  this.setState({ showAddClassify: false });
                }}
              >
                取消
              </span>
            </div>
          </div>
        </div>
        <div className={styles.menu_wrap}>
          <Menu theme="dark" mode="inline">
            {this.generateMenu(ownMenuArr)}
          </Menu>
        </div>
        <Modal
          title="请输入新文集名"
          visible={this.state.reviseModelShow}
          onOk={this.confirmReviseFolder}
          onCancel={this.cancleReviseFolder}
          okText="确认"
          cancelText="取消"
        >
          <Input
            value={this.state.reviseFolderName}
            onChange={this.onChangeFolderName}
          />
        </Modal>
      </Sider>
    );
  }
}

const mapStateToProps = state => ({
  articleFile: state.article.articleFile,
  articleFolder: state.article.articleFolder
});

const mapDispatchToProps = dispatch => ({
  getArticleFile: dispatch.article.getArticleFile,
  getArticleFolder: dispatch.article.getArticleFolder
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleSider);
