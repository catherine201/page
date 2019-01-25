// 观察者模式的实现

// 多对多

const center = {};

const eventContain = {};

// 监听事件
// center.$on('事件名字', 回调函数);
center.$on = function(eventName, callback) {
  // 按照事件名字保存下来回调函数
  if (!eventContain[eventName]) {
    // 这个事件还没有执行过监听
    eventContain[eventName] = [];
  }
  eventContain[eventName].push(callback);
};

// 触发事件
// center.$emit('事件名字', 传递的参数);
// center.$emit = function(eventName, params){
center.$emit = function(eventName, ...rest) {
  // 获得事件名字相同的回调函数列表，挨个执行回调函数
  const eventList = eventContain[eventName];
  if (eventList) {
    eventList.map(callback => {
      //			callback(params);
      callback(...rest);
    });
  }
};

// 移除监听
// center.$off('事件名字');
center.$off = function(eventName) {
  // 清空事件名字相同的事件列表
  eventContain[eventName] = [];
};

export default center;
