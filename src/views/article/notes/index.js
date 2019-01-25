import React from 'react';
import { Layout, Icon, Input } from 'antd';
import { connect } from 'react-redux';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import createApi from '../../../api/article';
// import { debounce } from '../../../utils';
import styles from './index.less';

// const { SubMenu } = Menu;
const { Content } = Layout;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_558012_rlj4y8cy1uo.js'
});
const excludeControls = ['link', 'text-indent', 'fullscreen'];

class Notes extends React.Component {
  constructor() {
    super();
    this.state = {
      editorState: BraftEditor.createEditorState(null),
      saveIng: false,
      title: '',
      hasNote: false,
      hoverStatus: false,
      lastHtml: '', // 最后发布那一次的html
      lastReviseHtml: '', // 最后保存那一次的html
      alreadyPublish: false,
      publishStatus: 0 // 0 还没发布  1 已经发布 2 发布未更新
      // limit: 100,
      // menu: []
    };
  }

  async componentDidMount() {
    // // 假设此处从服务端获取html格式的编辑器内容
    // // const htmlContent = await fetchEditorContent();
    // const htmlContent = ``;
    // // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    // this.setState({
    //   editorState: BraftEditor.createEditorState(htmlContent)
    // });
    if (this.props.match.params.file) {
      this.setState({
        hasNote: true
      });
      this.init();
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.match.params.file !== this.props.match.params.file) {
    const obj = {
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      id: nextProps.match.params.file
    };
    this.queryArticle(obj);
    // }
  }

  componentWillUnmount() {
    // window.onbeforeunload = function() {
    //   return null;
    // };
    this.$center.$off('initAgain');
  }

  init = () => {
    const obj = {
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      id: this.props.match.params.file
    };
    this.queryArticle(obj);
  };

  queryArticle = async obj => {
    const res = await createApi.queryArticle(obj);
    if (res) {
      console.log(new Date(res.data.updated_at) - new Date(res.data.posted_at)); // >0 还没更新;
      switch (res.data.status) {
        case 'shelve':
          new Date(res.data.updated_at) - new Date(res.data.posted_at) > 0
            ? this.setState({
                publishStatus: 2,
                lastHtml: res.data.content,
                alreadyPublish: true
              })
            : this.setState({
                publishStatus: 1,
                lastHtml: res.data.content,
                alreadyPublish: true
              });
          break;
        default:
          this.setState({
            publishStatus: 0,
            alreadyPublish: false
          });
          break;
      }
      this.setState({
        editorState: BraftEditor.createEditorState(res.data.content),
        lastReviseHtml: res.data.content,
        title: res.data.title
      });
    }
  };

  handleChange = editorState => {
    console.log(editorState);
    this.setState({ editorState });
    if (
      this.state.alreadyPublish &&
      this.state.editorState.toHTML() !== this.state.lastHtml
    ) {
      this.setState({
        publishStatus: 2
      });
    }
  };

  handleBlur = () => {
    console.log('blur');
    if (this.state.lastReviseHtml !== this.state.editorState.toHTML()) {
      this.submitContent();
    }
  };

  reviseArticleContent = async (obj, flag, val) => {
    const res = await createApi.reviseArticleContent(obj);
    if (res.data) {
      console.log(flag);
      this.setState({
        saveIng: false,
        lastReviseHtml: res.data.content
      });
      switch (res.data.status) {
        case 'shelve':
          console.log(
            new Date(res.data.updated_at) - new Date(res.data.posted_at) > 0
          );
          new Date(res.data.updated_at) - new Date(res.data.posted_at) > 0
            ? this.setState({
                publishStatus: 2
              })
            : this.setState({
                publishStatus: 1
              });
          break;
        default:
          this.setState({
            publishStatus: 0
          });
          break;
      }
      if (flag === 'publish') {
        const obj = {
          id: this.props.match.params.file,
          access_token: JSON.parse(sessionStorage.getItem('user'))
            .second_access_token,
          status: val
        };
        this.reviseArticleStatusApi(obj);
      }
    }
  };

  reviseArticleTitle = async obj => {
    const res = await createApi.reviseArticleTitle(obj);
    if (res) {
      this.$center.$emit('initAgain');
      this.setState({
        saveIng: false
      });
      switch (res.data.status) {
        case 'shelve':
          new Date(res.data.updated_at) - new Date(res.data.posted_at) > 0
            ? this.setState({
                publishStatus: 2
              })
            : this.setState({
                publishStatus: 1
              });
          break;
        default:
          this.setState({
            publishStatus: 0
          });
          break;
      }
    }
  };

  submitContent = async (flag, val) => {
    this.setState({
      saveIng: true
    });
    const obj = {
      id: this.props.match.params.file,
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      content: this.state.editorState.toHTML()
    };
    this.reviseArticleContent(obj, flag, val);
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    // const htmlContent = this.state.editorState.toHTML()
    // const result = await saveEditorContent(htmlContent)
  };

  onChangeTitle = e => {
    this.setState({ title: e.target.value, saveIng: true });
  };

  changeTitleBlur = () => {
    const obj = {
      id: this.props.match.params.file,
      access_token: JSON.parse(sessionStorage.getItem('user'))
        .second_access_token,
      title: this.state.title
    };
    this.reviseArticleTitle(obj);
  };

  preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close();
    }

    window.previewWindow = window.open();
    window.previewWindow.document.write(this.buildPreviewHtml());
    window.previewWindow.document.close();
  };

  publishNow = val => {
    // 发布之前先保存
    this.submitContent('publish', val);
    // const obj = {
    //   id: this.props.match.params.file,
    //   access_token: JSON.parse(sessionStorage.getItem('user'))
    //     .second_access_token,
    //   status: 'shelve'
    // };
    // this.reviseArticleStatusApi(obj);
  };

  // 发布文章
  reviseArticleStatusApi = async obj => {
    const res = await createApi.reviseArticleStatus(obj);
    if (res) {
      this.setState({
        publishStatus: 1,
        lastHtml: res.data.content,
        alreadyPublish: true
      });
      switch (res.data.status) {
        case 'shelve':
          new Date(res.data.updated_at) - new Date(res.data.posted_at) > 0
            ? this.setState({
                publishStatus: 2,
                lastHtml: res.data.content,
                alreadyPublish: true
              })
            : this.setState({
                publishStatus: 1,
                lastHtml: res.data.content,
                alreadyPublish: true
              });
          break;
        default:
          this.setState({
            publishStatus: 0,
            lastHtml: res.data.content
          });
          break;
      }
      this.$center.$emit('initAgain');
      console.log(res.data);
      // this.init();
    }
  };

  buildPreviewHtml() {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.state.editorState.toHTML()}</div>
        </body>
      </html>
    `;
  }

  render() {
    const extendControls = [
      {
        key: 'save-button',
        type: 'button',
        title: '保存',
        text: <Icon type="save" />,
        onClick: this.submitContent
      },
      {
        key: 'publish-button',
        type: 'button',
        text: (
          <div>
            {this.state.publishStatus === 0 ? (
              <p>
                <IconFont type="icon-bushufabu" />
                发布文章
              </p>
            ) : this.state.publishStatus === 1 ? (
              <p
                onMouseEnter={() => {
                  this.setState({ hoverStatus: true });
                }}
                onMouseLeave={() => {
                  this.setState({ hoverStatus: false });
                }}
              >
                <Icon type={this.state.hoverStatus ? 'close' : 'check'} />
                {this.state.hoverStatus ? '取消发布' : '已经发布'}
              </p>
            ) : (
              <p>
                <Icon type="sync" />
                更新发布
              </p>
            )}
          </div>
        ),
        onClick: () => {
          this.publishNow(
            this.state.publishStatus === 1 ? 'unshelve' : 'shelve'
          );
        }
      },
      'fullscreen',
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      }
    ];
    const { saveIng, title, hasNote } = this.state;
    return (
      <Content className={`article_edit ${styles.article_edit}`}>
        {!hasNote ? (
          <div className={styles.article_edit_no_content}>
            <span className={styles.no_content_word}>Leeker Labs</span>
          </div>
        ) : (
          <div className={styles.article_edit_content}>
            <div className={styles.edit_title}>
              <p className={styles.edit_title_p}>
                <Input
                  value={title}
                  onChange={this.onChangeTitle}
                  className={styles.edit_title_p}
                  onBlur={this.changeTitleBlur}
                />
              </p>
              <span className={styles.edit_status}>
                {saveIng ? '保存中...' : '已保存'}
              </span>
            </div>
            <BraftEditor
              value={this.state.editorState}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              onSave={this.submitContent}
              excludeControls={excludeControls}
              extendControls={extendControls}
            />
          </div>
        )}
      </Content>
    );
  }
}

// export default AppSider;
const mapStateToProps = () => ({
  // ownMenuArr: state.menu.ownMenuArr
});
export default connect(mapStateToProps)(Notes);
