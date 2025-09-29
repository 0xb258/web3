<script setup>
import { ref, defineExpose, onMounted } from 'vue'
import {setLocales,i18n} from '../lang'
const { locale, t } = i18n.global
let show = ref(false)
let open = () => {
  show.value = true
}
let radio = ref('tw')
onMounted(()=>{
  radio.value = localStorage.lang || 'tw'
})
let onRadioChange = (lang) => {
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
  <van-popup position="bottom" closeable @close="show = false"
    safe-area-inset-bottom :show="show">
    <div class="wrapper">
      <div class="lang-popup ">
        <div class="lang-title">切换语言</div>
        <van-radio-group v-model="radio" @change="onRadioChange">
          <van-radio name="zh">
            <div class="lang-item">
              <img class="lang" src="../assets/icon/zh.png" alt="" />
              <div class="lang-name">中文（简体）</div>
            </div>
            <template #icon="props">
              <div class="img-icon">
                <img v-if="props.checked" class="img-icon" src="../assets/icon/icon-radio.png" />
              </div>
            </template>
          </van-radio>
          <van-radio name="tw">
            <div class="lang-item">
              <img class="lang" src="../assets/icon/tw.png" alt="" />
              <div class="lang-name">中文（繁体）</div>
            </div>
            <template #icon="props">
              <div class="img-icon">
                <img v-if="props.checked" class="img-icon" src="../assets/icon/icon-radio.png" />
              </div>
            </template>
          </van-radio>
          <van-radio name="en">
            <div class="lang-item">
              <img class="lang" src="../assets/icon/en.png" alt="" />
              <div class="lang-name">English</div>
            </div>
            <template #icon="props">
              <div class="img-icon">
                <img v-if="props.checked" class="img-icon" src="../assets/icon/icon-radio.png" />
              </div>
            </template>
          </van-radio>
        </van-radio-group>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
:root:root {
  --van-popup-close-icon-color: #000 !important;
}
:deep(.van-popup__close-icon) {
  color: #000 !important;
}
.wrapper {
  width: 100vw !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  color: #000;
}

.lang-popup {
  width: 100%;
  // background-color: hsla(0, 11%, 7%, 0.9);
  // background-color: rgb(255, 255, 255,.4);
    /* #F2F6F6 */
  background: rgba(0, 193, 141, .8);
  // opacity: .8;
  backdrop-filter: blur(3px);
  // box-shadow: 0 0 5px 0 rgba(187, 211, 255, 0.54) inset, 0 0 10px 0 rgba(0, 59, 255, 0.33);
  padding: 22px 13px 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .lang-title {
    text-align: left;
    color: #000;
    font-family: Altinn-DIN;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}


.van-radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .van-radio {
    position: relative;
    gap: 10px;

    .van-radio__icon {
      position: absolute;
      top: 50%;
      right: 17px;
      transform: translateY(-50%);
    }

    .img-icon {
      width: 23px;
      height: 23px;
    }

    .van-radio__label {
      width: 100%;
      margin-left: 0;

      .lang-item {
        display: flex;
        align-items: center;
        padding: 14px 17px;
        border-radius: 6px;
        min-width: 280px;
        background: rgba(255, 255, 255, 0.1);

        .lang {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }

        .lang-name {
          font-size: 16px;
          font-weight: 500;
          color: #000;
        }
      }
    }
  }
}
</style>
