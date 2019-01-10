import createApi from '../../api/version';

const asideState = {
  state: {
    initVersion:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).version.initVersion) ||
      {}
  },
  reducers: {
    setVersion(state, data) {
      // 从第二个变量开始为调用increment时传递进来的参数，后面依次类推，例如：dispatch.count.increment(10, 20)时， num1 = 10 , num2 = 20.
      return {
        ...state,
        initVersion: data
      };
    }
  },
  effects: dispatch => ({
    async getInitVersion() {
      const res = await createApi.getVersion({ limit: 100, offset: 0 });
      if (res) {
        console.log(res.datas);
        console.log(dispatch);
        dispatch.query.setVersion(res);
      }
    }
  })
};

export default asideState;
