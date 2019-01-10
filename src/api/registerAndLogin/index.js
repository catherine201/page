import createApi from '../createApi';
import { serverIp } from '../server_config';

const config = {
  // 注册
  register: {
    url: '/register/name',
    options: {
      method: 'POST',
      baseUrl: serverIp.login
    }
  },
  // 预登录
  login: {
    url: '/users/name/login',
    options: {
      method: 'POST',
      baseUrl: serverIp.login
    }
  },
  authLogin: {
    url: '/api/tokens/auth_code',
    options: {
      method: 'GET',
      baseUrl: serverIp.login
    }
  },
  // 最终登录
  secondLogin: {
    url: '/login',
    options: {
      method: 'POST'
    }
  },
  // 登出
  logout: {
    url: '/logout',
    options: {
      method: 'POST',
      errorHandler: false,
      showLoading: false
    }
  }
};

export default createApi(config);
