import createApi from '../createApi';
import { serverIp } from '../server_config';

const config = {
  // 发布新版本
  publish: {
    url: '/app/versions',
    options: {
      method: 'POST'
    }
  },
  uploadFile: {
    url: '/users/%openid%/signature',
    options: {
      method: 'PUT',
      baseUrl: serverIp.login
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
