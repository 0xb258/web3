export default {
  loginMessage: { method: 'get', url: '/api/v1/auth/loginMessage' }, //获取签名字符串
  login: { method: 'post', url: '/api/v1/auth/login' }, //登录
  isRegister: { method: 'post', url: '/api/v1/auth/isRegister' }, //是否注册
  index:{method:'get',url:'/api/v1/user/priceInfo'}, //首页
  calc:{method:'get',url:'/api/v1/power/calc'}, //获取余额
  minPerformanceRank:{method:'get',url:'/api/v1/user/minPerformanceRank'},
  todayPerformanceRank:{method:'get',url:'/api/v1/user/todayPerformanceRank'},
  transfer:{method:'post',url:'/api/v1/transfer/index'}, //转账
  transferList:{method:'get',url:'/api/v1/transfer/list'}, //转账记录
  powerLog:{method:'get',url:'/api/v1/user/powerLog'}, //算力记录
  apply:{method:'post',url:'/api/v1/withdraw/apply'}, //提现
  applyList:{method:'get',url:'/api/v1/withdraw/list'}, //提现记录
  getPayOrder:{method:'post',url:'/api/v1/power/getOrder'}, //获取支付订单
  userInfo:{method:'get',url:'/api/v1/user/info'}, //用户信息
  zhiList:{method:'get',url:'/api/v1/user/zhiList'}, //直推列表
  orderList:{method:'get',url:'/api/v1/power/orderList'}, //订单列表
  incomeList:{method:'get',url:'/api/v1/user/incomeList'}, //收益记录
  updateJuUid:{method:'post',url:'/api/v1/user/updateJuUid'}, //用户UID
}
