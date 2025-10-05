export default {
  doExchange: { method: 'post', url: '/api/v1/exchange/index' }, // 币币兑换
  list: { method: 'get', url: '/api/v1/exchange/list' }, // 兑换记录
  releaseXD: { method: 'get', url: '/api/v1/user/releaseInfo' } // 待释放XD
}
