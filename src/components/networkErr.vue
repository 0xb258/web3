<script setup>
import { ref, defineExpose, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import config from '@/config'
import useWeb3 from '@/utils/useWeb3'
const { t } = useI18n()
let show = ref(false)
let open = () => {
  show.value = true
}

let handleConfirm = async () => {
  await useWeb3.ensureReady()
  if (window.ethereum.chainId == config.network.chainId) {
    emit('confirm')
    show.value = false
  }
}
let props = defineProps({
  title: {
    type: String,
    default: '标题'
  },
  cancelText: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: ''
  }
})
let emit = defineEmits(['confirm'])
defineExpose({
  open
})
</script>

<template>
  <van-overlay z-index="99" :custom-style="{ backdropFilter: 'blur(3px)', background: 'rgba(0, 0, 0, 0.5)' }"
    :show="show">
    <div class="wrapper">
      <div class="card">
        <!-- <div class="card_title">
          <div class="card_title_lebei">{{ props.title }}</div>
          <div class="card_title_icon" @click="show = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
              <path
                d="M9.32621 7.12594L14.8512 1.60094C15.2175 1.23469 15.2175 0.640938 14.8512 0.274688C14.485 -0.0915625 13.8912 -0.0915625 13.525 0.274688L7.99996 5.79969L2.47496 0.274688C2.10871 -0.0915625 1.51496 -0.0915625 1.14871 0.274688C0.782461 0.640938 0.782461 1.23469 1.14871 1.60094L6.67371 7.12594L1.14871 12.6509C0.782461 13.0172 0.782461 13.6109 1.14871 13.9772C1.33246 14.1597 1.57121 14.2497 1.81246 14.2497C2.05371 14.2497 2.29246 14.1597 2.47496 13.9759L7.99996 8.45219L13.525 13.9772C13.7075 14.1597 13.9475 14.2509 14.1875 14.2509C14.4275 14.2509 14.6675 14.1609 14.85 13.9772C15.2162 13.6109 15.2162 13.0172 14.85 12.6509L9.32621 7.12594Z"
                fill="#8F8F8F" />
            </svg>
          </div>
        </div> -->
        <div class="card_content">
          <div class="chain-error-content">
            <div class="error-icon">⚠️</div>
            <h3 class="mt-4">网络错误</h3>
            <p class="mt-4">当前网络不支持，请切换到 {{ config.network.chainName }} 网络</p>
            <div class="chain-info mt-4">
              <p class="mb-4"><strong>网络名称:</strong> {{ config.network.chainName }} </p>
              <p class="mb-4"><strong>链ID:</strong> {{ config.network.chainId }} </p>
              <p class="mb-4"><strong>RPC URL:</strong> {{ config.network.rpcUrls[0] }}</p>
            </div>
          </div>
        </div>
        <div class="card_footer">
          <!-- <div class="card_footer_btn" @click="handleCancel">{{ props.cancelText || t('popup_cancel') }}</div> -->
          <div class="card_footer_btn" @click="handleConfirm">重新检测</div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.card {
  padding: 14px;
  width: 344px;
  border-radius: 2px;
  background: #FFF;
  box-sizing: border-box;

  &_title {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 6px;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .card_title_lebei {
      color: #000;
      font-family: "Source Han Sans CN";
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 50px;
      /* 147.059% */
    }
  }

  &_content {
    min-height: 100px;
    padding: 20px 0;
    box-sizing: border-box;
    .chain-error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .error-icon {
      font-size: 24px;
      color: #FF0000;
    }
    .chain-info {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
    }
  }

  &_footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &_btn {
      flex: 1;
      display: flex;
      // width: 150px;
      height: 46px;
      padding: 8px 20px;
      justify-content: center;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
      border-radius: 2px;
      color: #FFF;
      text-align: center;
      font-family: "Source Han Sans CN";
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      /* 147.059% */
      // background: var(--5, radial-gradient(41.55% 42.54% at 52.19% 100%, #89A6EA 0%, #688EFF 55.29%, #164BD6 100%));
      background: #000000;
      // box-shadow: 0 8px 32px 0 rgba(0, 60, 255, 0.34), 0 0 20px 0 rgba(163, 192, 255, 0.57) inset;

      &:active {
        opacity: .8;
      }

      // &:first-child {
      //   margin-right: 16px;
      //   color: #8F8F8F;
      //   border-radius: 10px;
      //   // background: radial-gradient(41.55% 42.54% at 52.19% 100%, #7E95C7 0%, #5F6E90 100%);
      //   background: #E9E9E9;
      //   // box-shadow: 0 8px 32px 0 rgba(0, 60, 255, 0.34), 0 0 20px 0 rgba(255, 255, 255, 0.20) inset;
      // }
    }
  }
}

.card_title_icon {
  width: 20px;
  height: 20px;
  fill: #000;
}
</style>
