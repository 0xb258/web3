import { address as mainAddress, abi as mainAbi } from '../contract/pro/main'
import { address as customAddress, abi as customAbi } from '../contract/pro/custom'
import { network } from '../network/pro'
export default {
  env: 'pro',
  baseUrl: 'https://api.x-pro-power.org',
  isEnableEncryption: true, //是否加密
  isLog: false, //是否打印日志
  suffix: '4cf4c22f6e6ce089937de71339f1b87d', //后端统一拦截路由
  main: {
    address: mainAddress,
    abi: mainAbi
  },
  custom: {
    address: customAddress,
    abi: customAbi
  },
  network
}
