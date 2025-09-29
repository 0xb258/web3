<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import lang from './lang.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useIndexStore } from '@/store'
import avatar from '@/static/icon/public/avatar.png'
import light from '@/static/icon/public/light.png'
import dark from '@/static/icon/public/dark.png'
const emit = defineEmits(['connectWallet'])
defineProps({
  theme: {
    type: String,
    default: 'light' //'dark' // light
  }
})
const { t } = useI18n()
const router = useRouter()
const store = useIndexStore()
let langRef = ref(null)

let handleLanguge = () => {
  langRef.value.open()
}
let connectWallet = () => {
  emit('connectWallet')
}
let navList = ref([
  {
    label: t('home'),
    path: '/index'
  },
  {
    label: t('lever'),
    path: '/lever'
  },
  {
    label: t('lending'),
    path: '/lending'
  },
  {
    label: t('finance'),
    path: '/finance'
  },
  {
    label: t('project'),
    path: '/project'
  }
])

watch(
  () => t('home'),
  () => {
    navList.value = [
      {
        label: t('home'),
        path: '/index'
      },
      {
        label: t('lever'),
        path: '/lever'
      },
      {
        label: t('lending'),
        path: '/lending'
      },
      {
        label: t('finance'),
        path: '/finance'
      },
      {
        label: t('project'),
        path: '/project'
      }
    ]
  }
)
let toHome = () => {
  router.push('/index')
}
</script>
<template>
  <nav :style="{ backgroundColor: theme === 'dark' ? '#191D1C' : '#FFFFFF' }">
    <div class="header_wallet" @click="toHome">
      <van-image width="38" height="38" :src="avatar" />
    </div>
    <div class="header_right">
      <div class="language_icon flex items-center" @click="handleLanguge">
        <van-image width="32" height="32" :src="dark" v-if="theme == 'dark'" />
        <div class="rounded-[10px] bg-#F2F6F6 w-32 h-32 flex items-center justify-center" v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M11 20.1667C5.93729 20.1667 1.83337 16.0628 1.83337 11C1.83337 5.93729 5.93729 1.83337 11 1.83337C16.0628 1.83337 20.1667 5.93729 20.1667 11C20.1667 16.0628 16.0628 20.1667 11 20.1667ZM8.90087 18.0281C7.9965 16.1098 7.47259 14.0344 7.35812 11.9167H3.72354C3.90191 13.3274 4.48614 14.6559 5.40523 15.7408C6.32432 16.8257 7.53872 17.6203 8.90087 18.0281ZM9.19421 11.9167C9.33262 14.1525 9.97154 16.2525 11 18.106C12.0563 16.2035 12.6734 14.0887 12.8059 11.9167H9.19421ZM18.2765 11.9167H14.642C14.5275 14.0344 14.0036 16.1098 13.0992 18.0281C14.4614 17.6203 15.6758 16.8257 16.5949 15.7408C17.5139 14.6559 18.0982 13.3274 18.2765 11.9167ZM3.72354 10.0834H7.35812C7.47259 7.96568 7.9965 5.89025 8.90087 3.97196C7.53872 4.37976 6.32432 5.1744 5.40523 6.25931C4.48614 7.34422 3.90191 8.67272 3.72354 10.0834ZM9.19512 10.0834H12.805C12.6727 7.91142 12.056 5.79661 11 3.89404C9.94375 5.79654 9.32672 7.91135 9.19421 10.0834H9.19512ZM13.0992 3.97196C14.0036 5.89025 14.5275 7.96568 14.642 10.0834H18.2765C18.0982 8.67272 17.5139 7.34422 16.5949 6.25931C15.6758 5.1744 14.4614 4.37976 13.0992 3.97196Z"
              fill="black" />
          </svg>
        </div>
      </div>
      <div class="nav_btn nam_btn--icon">
        <!-- 如果有地址，显示地址和断开连接按钮 -->
        <div v-if="store.address" class="flex items-center gap-2">
          <div class="py-10 px-14 text-[#00C18D] text-[12px] font-pingfang border-c18 rounded-[10px]">
            {{ store.formatAddress }}
          </div>
        </div>
        <!-- 如果没有地址，显示连接钱包按钮 -->
        <div v-else>
          <div 
            @click="connectWallet"
            class="py-10 px-14 text-[#00C18D] text-[12px] font-pingfang border-c18 rounded-[10px] cursor-pointer hover:bg-[#00C18D] hover:text-white transition-colors"
          >
            连接钱包
          </div>
        </div>
      </div>
    </div>
  </nav>
  <lang ref="langRef" />
</template>

<style scoped lang="scss">
nav {
  // position: fixed !important;
  // top: 0;
  // left: 0;
  width: 100%;
  padding: 14px;
  background-color: #191D1C;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 99;
}

.header_right {
  display: flex;
  align-items: center;
}

.nav_btn {
  margin-left: 16px;
}

.nav_body {
  width: 100vw;
  height: 100vh;
  margin-top: auto;
  background: radial-gradient(89.43% 47.97% at 50.13% 100%, #3e509c 0%, #03002c 62.5%);
  padding-top: calc(var(--van-nav-bar-height) + 35px);
}

.nav_list {
  box-sizing: border-box;

  .nav_list_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 24px 20px;

    .nav_list_item--label {
      color: #fff;
      font-family: 'Source Han Sans CN';
      font-size: 18px;
      font-weight: 500;
    }

    .nav_list_item--icon {
      margin-left: 10px;
      margin-top: -10px;
    }
  }
}

.border-c18 {
  border: 1px solid #00C18D;
}
</style>
