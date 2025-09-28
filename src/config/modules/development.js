import { address as mainAddress, abi as mainAbi } from '../contract/dev/main'
import { address as customAddress, abi as customAbi } from '../contract/dev/custom'
import { network } from '../network/dev'
export default {
  env: 'dev',
  baseUrl: 'https://api.x-pro-power.org',
  isEnableEncryption: false, //是否加密
  isLog: true, //是否打印日志
  debugCode:'abcdef', //调试的时候邀请码
  suffix:'4cf4c22f6e6ce089937de71339f1b87d', //后端统一拦截路由
  // 主合约 一般是测试网上的usdt合约
  main: {
    address: mainAddress,
    abi: mainAbi
  },
  // 自定义合约 一般是自己写的合约
  custom: {
    address: customAddress,
    abi: customAbi
  },
  network
};
