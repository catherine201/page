// import store from '../store';
// 进入全屏
export function requestFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullScreen) {
    elem.webkitRequestFullScreen();
  } else if (elem.msRequestFullscreen) {
    // elem.msRequestFullscreen() 没有指定元素
    document.body.msRequestFullscreen();
  }
}
// 退出全屏
export function exitFullscreen() {
  const doc = document;
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.webkitCancelFullScreen) {
    doc.webkitCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/**
 * 从属性路径获取值
 * getValueByPath({err: {info: 'xxx'}}, ['err', 'info']) // xxx
 * @param {object} data 对象
 * @param {array} paths 路径数组；如: ['error', 'info']
 * @return {any} 返回属性路径值，不存在返回undefined
 * */
export const getValueByPath = (data, paths) => {
  function loop(obj, i) {
    if (i < paths.length - 1) {
      if (typeof obj[paths[i]] === 'undefined') {
        return undefined;
      }
      return loop(obj[paths[i]], ++i);
    }
    return obj[paths[i]];
  }
  return loop(data, 0);
};

// id to name
export function idToName(arr, menuArr) {
  let str = '';
  arr.forEach((element, index) => {
    const ind = menuArr.findIndex(item => item._id === element);
    if (ind !== -1) {
      str += index ? `,${menuArr[ind].name}` : `${menuArr[ind].name}`;
    }
  });
  if (str.startsWith(',')) {
    str = str.substring(1);
  }
  return str;
}

export function init() {
  // Warn if overriding existing method
  if (Array.prototype.equals)
    console.warn(
      "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
    );
  // attach the .equals method to Array's prototype to call it on any array
  Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array) return false;
    // compare lengths - can save a lot of time
    if (this.length !== array.length) return false;
    for (let i = 0, l = this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i])) return false;
      } else if (this[i] !== array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  };
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, 'equals', { enumerable: false });
}

// 删除对象属性值为空的键
export function handleObj(obj) {
  Object.keys(obj).map(item => {
    if (
      obj[item] === undefined ||
      obj[item] === '' ||
      JSON.stringify(obj[item]) === '{}'
    ) {
      delete obj[item];
    }
  });
  return obj;
}

// 节流 情景：窗口改变，用户疯狂点击，页面滚动  原理：无论用户点击多少次，在一定时间内只算一次

// export function throttle(handle, wait) {
//   let lasttime = 0;
//   return function(e) {
//     console.log(e);
//     const nowtime = new Date().getTime();
//     if (nowtime - lasttime > wait) {
//       handle.apply(this, arguments);
//       lasttime = nowtime;
//     }
//   };
// }

// 防抖 情景：密码等校验，实时search, 拖拽   原理： 当函数频繁触发的时候， 延迟执行 setTimeout

// 简单版
// export function debounce(handle, delay) {
//   let timer = null;
//   return function() {
//     const _this = this;

//     const _arg = arguments;
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       handle.apply(_this, _arg);
//     }, delay);
//   };
// } // 其中 handle 为需要进行防抖操作的函数，delay 为延迟时间

// 增加前缘触发功能  防抖
export const debounce = (fn, wait, immediate = false) => {
  let timer;

  let startTimeStamp = 0;
  let context;
  let args;

  const run = timerInterval => {
    timer = setTimeout(() => {
      const now = new Date().getTime();
      const interval = now - startTimeStamp;
      if (interval < timerInterval) {
        // the timer start time has been reset，so the interval is less than timerInterval
        console.log('debounce reset', timerInterval - interval);
        startTimeStamp = now;
        run(timerInterval - interval); // reset timer for left time
      } else {
        if (!immediate) {
          fn.apply(context, args);
        }
        clearTimeout(timer);
        timer = null;
      }
    }, timerInterval);
  };

  return function() {
    context = this;
    args = arguments;
    const now = new Date().getTime();
    startTimeStamp = now; // set timer start time

    if (!timer) {
      console.log('debounce set', wait);
      if (immediate) {
        fn.apply(context, args);
      }
      run(wait); // last timer alreay executed, set a new timer
    }
  };
};

//

// / 增加前缘  节流
export const throttle = function(fn, interval) {
  const __self = fn;
  // 保存需要被延迟执行的函数引用 timer, // 定时器

  let firstTime = true; // 是否是第一次调用
  return function() {
    const args = arguments;

    const __me = this;
    if (firstTime) {
      // 如果是第一次调用，不需延迟执行
      __self.apply(__me, args);
      return (firstTime = false);
    }
    if (timer) {
      // 如果定时器还在，说明前一次延迟执行还没有完成
      return false;
    }
    timer = setTimeout(() => {
      // 延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      __self.apply(__me, args);
    }, interval || 500);
  };
};

export function numToArr(num) {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
}

// var data = {
//   vendor: ['a1', 'b1', '121', 'd1'],
//   model: ['a2', 'b2', 'c2'],
//   modelc: ['a3', 'b3'],
//   vendorb: ['a4', 'b4'],
//   }
//   function handleData(params) {
//   const keysArr = Object.keys(params)
//   // 获取最大长度
//   let maxLengthArr = keysArr.map(item => params[item].length)
//   const maxLength = Math.max(...maxLengthArr)
//   console.log(maxLength);
//   let resArr = []
//   for (let index = 0; index < maxLength; index++) {
//   let element = {}
//   keysArr.map(item => {
//   if (params[item][index]) {
//   element[item] = params[item][index]
//   }
//   })
//   resArr.push(element)
//   }
//   console.log('resArr', resArr);
//   }
//   handleData(data)

export function handleData(params) {
  console.log(params);
  const keysArr = Object.keys(params);
  console.log(keysArr);
  // 获取最大长度
  const maxLengthArr = keysArr.map(item => params[item].length);
  const maxLength = Math.max(...maxLengthArr);
  console.log(maxLength);
  const resArr = [];
  for (let index = 0; index < maxLength; index++) {
    const element = {};
    keysArr.map(item => {
      if (params[item][index]) {
        element[item] = params[item][index];
      }
    });
    resArr.push(element);
  }
  console.log('resArr', resArr);
  return resArr;
}

export function escapeEmpty(arr) {
  return arr.filter(item => JSON.stringify(item) !== '{}' && item !== '');
}

// function reversalData(data) {
// console.log('data', data);
// let resData = {}
// data.map(item => {
// const keysArr = Object.keys(item)
// keysArr.map(ele => {
// console.log('resData.ele', resData[ele]);
// if (!resData[ele]){
// resData[ele] = [item[ele]]
// } else {
// resData[ele].push(item[ele])
// }
// })
// })
// console.log('resData', resData);
// return resData
// }
// reversalData(resD)

// ### 8） 获取文件上传URL
// ### PUT /users/:openid/signature
// #### 参数:Body
// |字段|描述|类型|是否必填|
// ----|----|---|---|
// |access_token|子系统访问授权系统的令牌|string|是|
// |name|操作文件的路径名,如："/radar/head/user1.jpg"|string|是|
// |method_name|文件操作方法名："get","put"|string|是|

export function timestampToTime(timestamp) {
  const date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = `${date.getFullYear()}/`;
  const M = `${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }/`;
  const D = `${date.getDate()} `;
  // const h = `${date.getHours()}:`;
  // const m = `${date.getMinutes()}:`;
  // const s = date.getSeconds();
  // return Y + M + D + h + m + s;
  return Y + M + D;
}
