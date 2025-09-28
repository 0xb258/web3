
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '../router'
import useWeb3 from '../utils/useWeb3'


export const useIndexStore = defineStore('index', () => {
  // 状态
  const token = ref('')
  //当前授权额度
  const currentAuth = ref(0)
  //当前余额
  const currentBalance = ref(0)
  //地址
  const address = ref('')
  //当前链
  const currentChain = ref('')




  // 计算属性
  const isWalletInstalled = computed(() => {
    return typeof window !== 'undefined' && window.ethereum
  })

  const balance = computed( async() => {
    const balance = await useWeb3.mainContract.balanceOf(address.value)
    return balance
  })






  // 方法区
  const setToken = (newToken) => {
    if(!newToken){
      router.push('/')
    }
    token.value = newToken
  }

  const setAddress = (newAddress) => {
    address.value = newAddress
  }

  const setCurrentBalance = (balance) => {
    currentBalance.value = balance
  }

  const setCurrentAuth = (auth) => {
    currentAuth.value = auth
  }
  const initWallet = async () => {
    //获取主合约余额
    const balance = await useWeb3.mainContract.balanceOf(address.value)
    setCurrentBalance(balance)
    //获取主合约授权额度
    const auth = await useWeb3.mainContract.getCurrentAuth(address.value)
    setCurrentAuth(auth)
  }

  // 清除所有状态
  const clearAll = () => {
    token.value = ''
    address.value = ''
    currentBalance.value = 0
    currentAuth.value = 0
    //路由跳转到首页
    router.push('/')
  }

  // 格式化地址显示
  const formatAddress = computed(() => {
    if (!address.value) return ''
    return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
  })


  return { 
    // 状态
    token,
    address,
    currentBalance,
    currentAuth,

    // 计算属性
    isWalletInstalled,
    formatAddress,
    balance,
    currentChain,

    // 方法区
    setToken,
    setAddress,
    setCurrentBalance,
    setCurrentAuth,
    initWallet,
    clearAll
  }
})
