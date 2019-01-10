import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const logoImg = require('../../assets/images/logo.png');

// const { SubMenu } = Menu;
const { Sider } = Layout;

class AppSider extends React.Component {
  state = {
    // limit: 100,
    // menu: [],
    ownMenuArr: [
      {
        key: '发布新版本',
        name: '发布新版本',
        path: '/admin/publish'
      },
      {
        key: '版本查询',
        name: '版本查询',
        path: '/admin/query'
      }
    ]
  };

  componentDidMount() {
    // const obj = {
    //   url: `${JSON.parse(sessionStorage.getItem('user'))._id}/menus`,
    //   query: {
    //     limit: this.state.limit,
    //     offset: 0
    //   }
    // };
    // this.queryUser(obj);
  }

  // queryUser = async obj => {
  //   const res = await createApi.queryUser(obj);
  //   if (res) {
  //     // this.setState({
  //     //   menu: res.datas
  //     // });
  //     this.setState({
  //       menu: res.datas
  //     });
  //     // console.log(pagination.total);
  //   }
  // };

  generateMenu = function(menus) {
    let items = [];
    items = menus.map(menu => (
      <Menu.Item key={menu.key}>
        <Link to={menu.path}>
          <Icon type="appstore" />
          <span className="nav-text">{menu.name}</span>
        </Link>
      </Menu.Item>
    ));
    return items;
  };

  // toHref(target) {
  //   console.log(target);
  //   console.log(this);
  //   this.props.history.push(`admin/${target}`);
  // }

  render() {
    const { ownMenuArr } = this.state;
    return (
      <Sider collapsed={this.props.collapsed} trigger={null}>
        <div className="logo-box">
          <img className="logo" src={logoImg} alt="logo" />
          <span className="title">Leeker Labs PlatForm </span>
        </div>
        <div className="menu_wrap">
          <Menu theme="dark" mode="inline">
            {this.generateMenu(ownMenuArr)}
          </Menu>
        </div>
      </Sider>
    );
  }
}

// export default AppSider;
const mapStateToProps = () => ({
  // ownMenuArr: state.menu.ownMenuArr
});
export default connect(mapStateToProps)(AppSider);
