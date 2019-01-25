function resolveIp() {
  const mode = process.env.NODE_ENV.trim();
  if (mode === 'development') {
    return {
      login: '/log',
      thirdServer: '/third',
      logic: '/article'
    };
  }
  return {
    login: 'http://passport.leekerlabs.com',
    thirdServer: 'http://dbapp.api.leekerlabs.com',
    logic: 'http://dbapp.api.leekerlabs.com'
  };
}
export const serverIp = resolveIp();
