import createApi from '../createApi';

const config = {
  // 查询目录
  queryFolders: {
    url: '/paths',
    options: {
      method: 'GET',
      showLoading: false
    }
  },
  // 新增目录
  addFolder: {
    url: '/paths',
    options: {
      method: 'POST'
    }
  },
  // 修改目录
  reviseFolder: {
    url: '/paths/%id%/',
    options: {
      method: 'PUT'
    }
  },
  // 删除目录
  deleteFolder: {
    url: '/paths/%id%/',
    options: {
      method: 'DELETE'
    }
  },
  // 根据目录查询文章
  queryFileByFolder: {
    url: '/article',
    options: {
      method: 'GET',
      showLoading: false
    }
  },
  // 新建文章
  addArticle: {
    url: '/article',
    options: {
      method: 'POST',
      showLoading: false
    }
  },
  // 删除文章
  deleteArticle: {
    url: '/article/%id%/',
    options: {
      method: 'DELETE',
      showLoading: false
    }
  },
  // 获取文章内容
  queryArticle: {
    url: '/article/%id%/',
    options: {
      method: 'GET',
      showLoading: false
    }
  },
  // 修改文章内容
  reviseArticleContent: {
    url: '/article/%id%/content',
    options: {
      method: 'PUT',
      showLoading: false
    }
  },
  // 修改文章标题
  reviseArticleTitle: {
    url: '/article/%id%/title',
    options: {
      method: 'PUT',
      showLoading: false
    }
  },
  // 修改文章状态 -- 发布
  reviseArticleStatus: {
    url: '/article/%id%/status',
    options: {
      method: 'PUT',
      showLoading: false
    }
  },
  // 查询所有版本
  getVersion: {
    url: '/app/versions',
    options: {
      method: 'GET',
      showLoading: false
    }
  },
  // 查询单个版本
  getVersionById: {
    url: '/app/versions/%id%/',
    options: {
      method: 'GET',
      showLoading: false
    }
  },
  // 修改单个版本
  reviseVersionById: {
    url: '/app/versions/%id%/',
    options: {
      method: 'PUT'
    }
  }
};

export default createApi(config);
