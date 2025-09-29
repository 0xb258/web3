<script setup>
import { ref, defineExpose, onMounted } from 'vue'
import {setLocales,i18n} from '../lang'
import zh from '@/assets/icon/zh.png'
import tw from '@/assets/icon/tw.png'
import en from '@/assets/icon/en.png'
const { locale, t } = i18n.global
let show = ref(false)
let radio = ref('tw')

// 语言选项配置
const langOptions = [
  {
    value: 'zh',
    label: '简体中文',
    icon: zh
  },
  {
    value: 'tw', 
    label: '繁體中文',
    icon: tw
  },
  {
    value: 'en',
    label: 'English', 
    icon: en
  }
]

let open = () => {
  show.value = true
}

onMounted(() => {
  radio.value = localStorage.lang || 'tw'
})

let onRadioChange = (lang) => {
  radio.value = lang  // 更新选中状态
  setLocales(lang)
  locale.value = lang
  show.value = false
}

defineExpose({
  open
})
</script>
<!-- --van-popup-close-icon-color -->
<!-- van-popup v-model:show="show" position="bottom" round closeable @close="() => { }" safe-area-inset-bottom -->
<template>
  <van-popup position="bottom" closeable @close="show = false" :show="show" round>
    <div class="lang-selector">
      <div class="lang-header">
        <h3>选择语言</h3>
      </div>
      <div class="lang-options">
        <div 
          v-for="option in langOptions" 
          :key="option.value"
          class="lang-option" 
          :class="{ active: radio === option.value }"
          @click="onRadioChange(option.value)"
        >
          <img :src="option.icon" :alt="option.label" class="lang-flag" />
          <span class="lang-text">{{ option.label }}</span>
          <div class="check-mark" v-if="radio === option.value">✓</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
:deep(.van-popup__close-icon) {
  color: #666 !important;
}

.lang-selector {
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  min-height: 200px;
}

.lang-header {
  text-align: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.lang-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lang-option {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  &:hover {
    background: #e9ecef;
  }
  
  &.active {
    background: #e8f5e8;
    border-color: #4caf50;
  }
  
  .lang-flag {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
  }
  
  .lang-text {
    flex: 1;
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
  
  .check-mark {
    color: #4caf50;
    font-weight: bold;
    font-size: 18px;
  }
}
</style>
