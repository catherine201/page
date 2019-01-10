// import createApi from '../../api/queryNoLoading';

const asideState = {
  state: {
    countLoadingArr: []
  },
  reducers: {
    setCountLoading(state, data) {
      return {
        ...state,
        countLoadingArr: data
      };
    }
  },
  effects: () => ({})
};

export default asideState;
