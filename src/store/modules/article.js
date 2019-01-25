import createApi from '../../api/article';

const asideState = {
  state: {
    articleFile:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article.articleFile) ||
      [],
    articleFolder:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article.articleFolder) ||
      []
  },
  reducers: {
    setArticleFile(state, data) {
      return {
        ...state,
        articleFile: data
      };
    },
    setArticleFolder(state, data) {
      return {
        ...state,
        articleFolder: data
      };
    }
  },
  effects: dispatch => ({
    async getArticleFile(obj) {
      console.log(obj);
      const res = await createApi.queryFileByFolder(obj);
      if (res) {
        res.init = true;
        dispatch.article.setArticleFile(res);
        return new Promise(resolve => resolve(res));
      }
    },
    async getArticleFolder() {
      const obj = {
        access_token: JSON.parse(sessionStorage.getItem('user'))
          .second_access_token,
        limit: 100,
        offset: 0
      };
      const res = await createApi.queryFolders(obj);
      if (res) {
        res.init = true;
        dispatch.article.setArticleFolder(res);
        return new Promise(resolve => resolve(res));
      }
    }
    // async getArticleFile() {
    //   const arr = [
    //     {
    //       key: '29665232',
    //       title: '2019-01-18'
    //     },
    //     {
    //       key: '29665233',
    //       title: '2019-01-19'
    //     }
    //   ];
    //   dispatch.article.setArticleFile(arr);
    // }
  })
};

export default asideState;
