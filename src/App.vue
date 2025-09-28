<style>
.van-popup.van-toast {
  background: var(--van-toast-background) !important;
  box-sizing: content-box !important;
  transition: all var(--van-duration-fast) !important;
  width: 100px !important;
  max-width: 400px !important;
}

input::placeholder {
  font-size: 18px !important;
  font-family: 'PingFang SC' !important;
  opacity: 0.8 !important;
}
</style>
<template>
  <Nav :theme="theme" @connectWallet="init" />
  <NetworkErr @confirm="init" ref="networkErrRef" />
  <div id="main">
    <router-view></router-view>
  </div>
  <van-popup v-model:show="show" position="bottom" round closeable @close="() => { }" safe-area-inset-bottom>
    <div class="pt-[18px] pb-[20px] px-10px">
      <div class="mb-20 text-[18px] font-pingfang font-700">邀请码</div>
      <div class="bg-[#F2F6F6] px-14 py-20 rounded-[8px] mb-20">
        <input type="text" v-model="invitationCode"
          class="outline-none border-none bg-[#fff]/0 color-[#000]/80 font-pingfang text-[18px]" placeholder="请输入邀请码" />
      </div>
      <div @click="handleConfirmCode" :class="invitationCode ? 'opacity-100' : 'opacity-50'"
        class="van-haptics-feedback disabled:opacity-50 py-16 text-[16px] font-roboto bg-[#000] text-[#fff] rounded-[2px] flex items-center justify-center">
        确 定</div>
    </div>
  </van-popup>
</template>

<script setup>
import Nav from '@/components/header.vue'
import NetworkErr from '@/components/networkErr.vue'
import { watch, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useWeb3 from '@/utils/useWeb3'
import { showToast } from 'vant'
import { useIndexStore } from '@/store'
import api from '@/apis'
import config from '@/config'
const show = ref(false)
const store = useIndexStore()
const route = useRoute()
const theme = ref('') // dark light
let invitationCode = ref(route.query?.code || '')
//监听地址变化
let networkErrRef = ref(null)

let handleConfirmCode = async () => {
  if (!invitationCode.value) {
    return
  }
  show.value = false
  login()
}

const init = async () => {
  try {
    await useWeb3.ensureReady()
    if (window.ethereum.chainId != config.network.chainId) {
      invitationCode.value = route.query?.code || ''
      networkErrRef.value.open()
      return
    }
    let address = useWeb3.signer?.address
    const isRegister = await api.home.isRegister({ address })
    if (!isRegister?.isRegister) {
      invitationCode.value = route?.query?.code
      show.value = true
      return
    }
    login()
  } catch (error) {
    console.log('[  ] >', error)
  }
}

let login = async () => {
  await useWeb3.ensureReady()
  let address = useWeb3.signer?.address
  const { message } = await api.home.loginMessage()
  const signature = await useWeb3.signMessage(`${message}`)
  const res = await api.home.login({ address: address, message, sign_message: signature, code: invitationCode.value })
  store.setAddress(address)
  store.setToken(res.token)
}

onMounted(async () => {
  await init()
  useWeb3.onAccountChange((address) => {
    store.setToken('')
    setTimeout(() => {
      window.location.reload()
    }, 800)
  })
  useWeb3.onChainChange((chainId) => {
    if (window.ethereum.chainId != config.network.chainId) {
      networkErrRef.value.open()
      return
    }
  })
})

//监听路由变化
watch(() => route.path, (val) => {
  theme.value = route.meta.headerTheme || 'light'
})


</script>
