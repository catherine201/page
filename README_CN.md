# React-node

[![travis-ci](https://travis-ci.org/catherine201/final-node.svg?branch=master)](https://travis-ci.org/catherine201/final-node)
[![codecov](https://codecov.io/gh/catherine201/final-node/branch/master/graph/badge.svg)](https://codecov.io/gh/catherine201/final-node)
[![node](https://img.shields.io/badge/node-%20%3E%3D%206.10-brightgreen.svg)](https://nodejs.org)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

&nbsp;

[![React](/internals/img/react-padded-90.png)](https://facebook.github.io/react/)
[![Webpack](/internals/img/webpack-padded-90.png)](https://webpack.github.io/)
[![Redux](/internals/img/redux-padded-90.png)](http://redux.js.org/)
[![React Router](/internals/img/react-router-padded-90.png)](https://github.com/ReactTraining/react-router)
[![Redux saga](/internals/img/redux-saga-padded-90.png)](https://github.com/ReactTraining/react-router)
[![ESLint](/internals/img/eslint-padded-90.png)](http://eslint.org/)
[![Jest](/internals/img/jest-padded-90.png)](https://facebook.github.io/jest/)
[![Yarn](/internals/img/yarn-padded-90.png)](https://yarnpkg.com/)

&nbsp;

[react](https://github.com/facebook/react) 是目前最热门的前端视图库，[redux](https://github.com/reactjs/redux) 是 react 社区基于函数式编程思想也是最热门的应用状态管理容器；本项目是基于 [react](https://github.com/facebook/react), [redux](https://github.com/reactjs/redux) 最佳实践构建的 2048，此外也使用了近年来优秀的开源工具来提高代码质量，包括 [eslint](https://github.com/eslint/eslint)，[stylelint](https://github.com/stylelint/stylelint)，[prettier](https://github.com/prettier/prettier) 等等，以及 [travis](https://travis-ci.org)，[codecov](https://codecov.io) 等持续集成，持续部署等服务来保障代码质量和提高开发效率。喜欢的话点个 star 收藏下吧。😘


## 预览


### 数据持久化

网页应用最怕断电和离线，第一个问题通过 `store.subscribe` 订阅 redux 状态更新，把状态序列化到 `localStorage` 储存，即使刷新，断电，程序奔溃再次打开仍然是最新的状态，第二个问题借助 chrome 的 [PWA](https://zhuanlan.zhihu.com/p/25167289) 技术，即使断开网络仍然可以访问缓存的资源文件。

### Redux 状态

[redux](https://github.com/reactjs/redux) 是一个可预测的 JS 状态管理容器，结合 [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension) 扩展可以很方便的进行应用状态穿梭，对辅助开发和debug大有裨益。不仅可以查看 redux 保存的状态，还可以随时回到到过去某个时刻的状态就像时间穿梭机一样，也看得到 redux 每次 action 的触发，以及每次触发造成的状态改动。

## react 最佳实践

* 一个文件一个组件。

* 尽量使用无状态（Stateless）组件，也就是如果只是写一个单纯展示的组件，不需要组件保存自己的状态，不需要生命周期方法或者 refs 来操作 DOM 的组件则优先使用无状态组件，采用函数的形式。以项目 Tips 组件示例:

```js
    import React from "react";
    import PropTypes from "prop-types";
    import styles from "./tips.scss";

    export default function Tips({ title, content }) {
      return (
        <div className={styles.tips}>
          <p className={styles.title}>{title}</p>
          <p className={styles.content}>{content}</p>
        </div>
      );
    }

    Tips.propTypes = {
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    };
```

* 和上面相反，如果你需要组件生命周期方法优化组件性能（典型应用，重写 `shouldComponentUpdate` 方法），需要组件保存自己的状态，或者用 refs 操作 DOM，你就需要一个有状态组件，采用 es6 class 继承 React.Component 的写法。以项目 Cell 组件示例：

```js
    import React from "react";
    import PropTypes from "prop-types";
    import classnames from "classnames";
    import styles from "./cell.scss";
    import { isObjEqual } from "../../utils/helpers";

    export default class Cell extends React.Component {
      static propTypes = {
        value: PropTypes.number.isRequired
      };

      shouldComponentUpdate(nextProps, nextState) {
        return (
          !isObjEqual(nextProps, this.props) || !isObjEqual(nextState, this.state)
        );
      }

      render() {
        const { props: { value } } = this;
        const color = `color-${value}`;
        return (
          <td>
            <div
              className={classnames([styles.cell, { [styles[color]]: !!value }])}
            >
              <div className={styles.number}>{value || null}</div>
            </div>
          </td>
        );
      }
    }
```

* 事件绑定 this 方法。事件回调方法的 this 一直是一个比较麻烦事情，不管是在 jsx 的事件注册属性里面还是在构造函数里面绑定 this 都不够优雅，好在[`类的属性`](https://babeljs.io/docs/plugins/transform-class-properties/) 这个 es 提案的出现可以帮助减少模版代码。以 [ControlPanel](https://github.com/devrsi0n/React-2048-game/blob/e6812e8b89bb38109387e7f6495fcd5d70c11f26/src/containers/ControlPanel/index.js) 组件示例：

```js
constructor(...args) {
  super(...args);

  this.state = {
    speakerOn: true
  };
}

// 使用 this.keyDownHandler 自动绑定当前的 this
keyDownHandler = e => {
  switch (e.keyCode) {
    case keyUp:
    case keyDown:
    case keyLeft:
    case keyRight:
      e.preventDefault();
      break;
    default:
      break;
  }
};
```

* 使用 [propTypes](https://reactjs.org/docs/typechecking-with-proptypes.html) 属性进行传入 prop 的校验。可以校验 prop 的类型和是否必需，非必需的 prop 还必需填写 defaultProps 默认值。以无状态组件 [Button](https://github.com/devrsi0n/React-2048-game/blob/e6812e8b89bb38109387e7f6495fcd5d70c11f26/src/components/Button/index.js) 的部分代码示例：

```js
    Button.propTypes = {
      children: PropTypes.oneOfType([PropTypes.node]),
      onClick: PropTypes.func,
      size: PropTypes.oneOf(["lg", "md", "sm", "xs"]),
      type: PropTypes.oneOf([
        "default",
        "primary",
        "warn",
        "danger",
        "success",
        "royal"
      ]).isRequired
    };

    Button.defaultProps = {
      children: "",
      onClick() {},
      size: "md",
    };
```

* 使用 [HOC(Higher-Order Components)](http://huziketang.com/books/react/lesson28) 代替 mixin。mixin 官方已经不推荐使用了，redux 的 connect 方法就是 HOC 的应用。

* 为了提高应用性能，避免不必要的视图重绘，在需要的组件使用 `shouldComponentUpdate` 方法；以组件 [Row](https://github.com/devrsi0n/React-2048-game/blob/e6812e8b89bb38109387e7f6495fcd5d70c11f26/src/components/Row/index.js) 示例：

```js
  // 如果该行没有格子需要刷新也没有组件自己的状态刷新，
  // 则该组件不执行 render 方法，
  // 避免每次别的行数据刷新也跟着重新渲染。
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isObjEqual(nextProps, this.props) || !isObjEqual(nextState, this.state)
    );
  }
```

## 项目结构

本项目是基于 Facebook 官方出品的 [create-react-app](https://github.com/facebookincubator/create-react-app) 脚手架搭建的，reject 后做了适当修改以适配项目需求。



## 踩坑记录


## License

[MIT](http://opensource.org/licenses/MIT)
