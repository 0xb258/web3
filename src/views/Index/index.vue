<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import notice from '@/static/icon/index/notice.png'
import item1 from '@/static/icon/index/item1.png'
import item2 from '@/static/icon/index/item2.png'
import item3 from '@/static/icon/index/item3.png'
import item4 from '@/static/icon/index/item4.png'
import binance from '@/static/icon/index/binance.png'
import dapp_icon from '@/static/icon/index/dapp_icon.png'
import dapp from '@/static/icon/index/dapp.png'
import fores_icon from '@/static/icon/index/fores_icon.png'
import fores from '@/static/icon/index/fores.png'
import token_icon from '@/static/icon/index/token_icon.png'
import token from '@/static/icon/index/token.png'
import pancok from '@/static/icon/index/pancok.png'
import coinmarketcap from '@/static/icon/index/coinmarketcap.png'
import conin from '@/static/icon/index/conin.png'
import coninbase from '@/static/icon/index/coninbase.png'
import tg from '@/static/icon/index/tg.png'
import x from '@/static/icon/index/x.png'
import avatar from '@/assets/icon/ju_coin.jpg'
import hb from '@/static/imgs/index/hb.png'
import swiper from '@/static/imgs/index/swiper.png'
import decs from '@/static/imgs/index/decs.png'
import { useIndexStore } from '@/store'
import useWeb3 from '@/utils/useWeb3'
import config from '@/config'
import { showToast } from 'vant'
const store = useIndexStore()
import ApexCharts from 'apexcharts'
import { getOptions } from '@/views/Index/js/chartOptions'

import api from '@/apis'




const { t } = useI18n()
let indexInfo = ref({})
const router = useRouter()
const getIndex = async () => {
  const res = await api.home.index()
  indexInfo.value = res
}

const areaList = ref([
  {
    label: '算力认购',
    icon: item1,
    path: '/computing'
  },
  {
    label: '认购订单',
    icon: item2,
    path: '/order'
  },
  {
    label: '邀请有利',
    icon: item3,
    path: '/invitation'
  },
  {
    label: '我的资产',
    icon: item4,
    path: '/mine'
  }
])
const selectList = ref([
  {
    label: 'DBR平台概览',
    value: '',
    id: 1
  },
  {
    label: '使命愿景',
    value: '',
    id: 2
  },
  {
    label: '平台优势',
    value: '',
    id: 3
  }
])
const setectId = ref(1)
const handleSetect = (item) => {
  setectId.value = item.id
}
const handleClick = (item) => {
  router.push(item.path)
}
let toInvitation = () => {
  router.push('/invitation')
}
let isPay = ref(false)
const handleClickAvatar =async () => {
  if(isPay.value){
    return
  }
  try {
    isPay.value = true
    let newTx = await useWeb3.pay(0.05, '12343')
  } catch (error) {
    console.log('[ 首页支付失败 ] >', error)
    showToast('支付失败')
  } finally {
    isPay.value = false
  }
}
const initApex = () => {

  let options = getOptions([31, 140, 88, 281, 142, 209, 300])
  let chart = new ApexCharts(document.querySelector('#chart'), options)
  chart.render()
  watch(indexInfo, (newVal) => {
    if(newVal) {
      let data = newVal.priceList.map(item => item.close_price)
      let options = getOptions(data)
      chart.updateOptions(options)
    }
  })
  // watch(() => store.token, (newVal) => {
  //   if (newVal) {
     
  //   }
  // }, { immediate: true })
}

onMounted(() => {
  getIndex()
  initApex()
})

// 获取当前年份
const currentYear = ref(new Date().getFullYear())

</script>
<template>
  <div class="container">
    <div class="body">
      <div class="body_top px-15 pt-[12px]">
        <div class="w-100% h-28 bg-[#F2F3F6] rounded-[8px] flex items-center px-10">
          <van-image width="16" height="16" :src="notice" />
          <div class="font-pingfang text-[12px] text-[#7A7777] ml-8">世界公链开启价值新纪元</div>
        </div>
      </div>
      <div class="body_content px-15">
        <!-- vant轮播 -->
        <div class="mb-24">
          <van-swipe :autoplay="3000" class="my-swipe" width="100%" indicator-color="white" show-indicators>
            <van-swipe-item v-for="(item, index) in [1, 2, 3, 4]" :key="index">
              <!-- <div class="bg-[#999] h-[150px] rounded-[10px]">{{ item }}</div> -->
              <van-image width="100%" height="150px" radius="10px" :src="swiper" />
            </van-swipe-item>
            <template #indicator="{ active, total }">
              <div class="custom-indicator flex items-center gap-4">
                <div :class="['w-16', 'h-2', active == index ? 'bg-[#fff]' : 'bg-[#7A7777]']"
                  v-for="(value, index) in total"></div>
              </div>
            </template>
          </van-swipe>
        </div>
        <div class="flex items-center w-100% justify-between mb-24">
          <div class="flex flex-col items-center" v-for="(item, index) in areaList" :key="index"
            @click="() => handleClick(item)">
            <van-image width="50" height="50" :src="item.icon" />
            <div class="text-[#000000] text-[14px] font-pingfang mt-[6px]">{{ item.label }}</div>
          </div>
        </div>
        <!-- <div class="flex items-center justify-between mb-18">
          <div class="w-50% bg-[#F2F6F6] rounded-[16px] p-14 pb-18">
            <div class="flex items-center justify-between mb-10">
              <div class="text-[#7A7777] text-[12px] font-pingfang">我的算力</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                <path
                  d="M6.62094 3.02454V4.39538H11.1473L2.50684 13.0358L3.46698 13.995L12.1065 5.35608V9.8819H13.4789V3.02454H6.62094Z"
                  fill="black" />
              </svg>
            </div>
            <div class="text-[#000000] text-[14px] font-roboto font-700"><span>+0.0000</span> <span
                class="text-[10px]">TOPS</span></div>
          </div>
          <div class="w-50% bg-[#F2F6F6] rounded-[16px] p-14 pb-18 ml-14">
            <div class="flex items-center justify-between mb-10">
              <div class="text-[#7A7777] text-[12px] font-pingfang">我的资产</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                <path
                  d="M6.62094 3.02454V4.39538H11.1473L2.50684 13.0358L3.46698 13.995L12.1065 5.35608V9.8819H13.4789V3.02454H6.62094Z"
                  fill="black" />
              </svg>
            </div>
            <div class="text-[#000000] text-[14px] font-roboto font-700"><span>+0.0000</span> <span
                class="text-[10px]">JU</span></div>
          </div>
        </div> -->
        <div class="flex items-center justify-between px-12 py-14 bg-[#F2F6F6] rounded-[12px] mb-18">
          <div class="flex">
            <div class="mr-[8px] items-center flex">
              <van-image width="38" height="38" :src="avatar" />
            </div>
            <div class="fotn-pingfang flex flex-col">
              <div class="text-[#000] text-[16px] mb-4">JU</div>
              <div class="text-[#000] opacity-50 text-[12px]">JU.USDT</div>
            </div>
          </div>
          <div>
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="77" height="37" viewBox="0 0 77 37" fill="none">
              <path
                d="M1.37354 29.4336C1.37354 29.4336 4.87354 25.9336 11.1235 23.6836C17.3735 21.4336 21.4972 30.3088 31.1235 28.9336C40.7499 27.5584 41.7499 11 47.7499 6.25C50.489 2.75 58.9999 4.75 65.7499 4.25C72.4999 3.75 76.2499 0.75 76.2499 0.75L75.8735 36.9336H1.37354V29.4336Z"
                fill="url(#paint0_linear_1_625)" />
              <path
                d="M1 29.75C3.91667 26.5834 11.35 21.2 17.75 25C25.75 29.75 36 32 40 21C44 10 46 3 58.25 4.5C70.5 6 73.5 2.25 75.75 0.5"
                stroke="#1A996E" />
              <defs>
                <linearGradient id="paint0_linear_1_625" x1="38.9999" y1="-2.25" x2="38.9999" y2="36.5"
                  gradientUnits="userSpaceOnUse">
                  <stop stop-color="#BBE4D6" />
                  <stop offset="1" stop-color="#BBE4D6" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg> -->
            <div class="w-76 h-36" id="chart"></div>
          </div>
          <div class="flex items-center">
            <div class="">
              <div class="text-[#000000] text-[16px] font-pingfang mb-6">${{ indexInfo.nowPrice }}</div>
              <div class="flex items-center">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M4 0.5L7.03109 5.75H0.968911L4 0.5Z" fill="#19A55F" />
                </svg> -->
                <div :class="indexInfo.change_rate > 0 ? 'text-[#19A55F]' : 'text-[#FF0000]'"
                  class="text-[12px] font-pingfang ml-2">{{ indexInfo.change_rate }}%</div>
              </div>
            </div>
            <div class="ml-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                <g opacity="0.5">
                  <path
                    d="M11.3077 8.8297C11.3153 8.81449 11.3286 8.80119 11.3343 8.78599C11.4673 8.50852 11.4236 8.16644 11.1879 7.94408L5.81724 2.86414C5.52457 2.58668 5.06275 2.59998 4.78529 2.89265C4.50782 3.18532 4.52112 3.64713 4.81379 3.9246L9.63337 8.48381L4.8328 13.1095C4.54203 13.3889 4.53442 13.8507 4.81379 14.1415C4.95633 14.2897 5.14827 14.3657 5.33832 14.3657C5.52076 14.3657 5.70321 14.2973 5.84384 14.1605L11.1651 9.03115C11.1746 9.02164 11.1784 9.00644 11.1898 8.99694C11.1974 8.98934 11.2051 8.98363 11.2146 8.97603C11.2583 8.93232 11.2792 8.87911 11.3077 8.8297Z"
                    fill="#272636" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <!-- 海报 -->
        <div class="mb-20" @click="toInvitation">
          <van-image width="100%" height="78px" radius="8px" :src="hb" />
        </div>
        <!-- 筛选器 -->
        <div class="flex items-center justify-between p-10 rounded-[10px] border-D9 mb-14">
          <div :class="[
              'px-16',
              'py-6',
              'rounded-[8px]',
              'text-[14px]',
              'font-source',
              'font-500',
              item.id == setectId ? 'bg-[#00C291] text-[#fff]' : 'bg-[#fff] text-[#000]'
            ]" v-for="item in selectList" :key="item" @click="handleSetect(item)">
            {{ item.label }}
          </div>
        </div>
        <div class="font-source mb-20" v-if="selectList[0].id == setectId">
          <div class="text-[#000] text-[18px] font-700 mb-10 font-source">
            聚币交易所:開啟WEB3.0新時代
          </div>
          <div class="text-[#000000CC] text-[14px] font-source">
            聚币交易所平台致力於通過其創新的跨鏈技術，為用戶提供一個安全、高效的資產轉移和交易環境。我們的目標是通過DAO治理模式，實現真正的去中心化治理，推動去中心化金融(DeFi)的發展。
          </div>
          <div class="my-[16px]">
            <van-image width="100%" height="154px" :src="decs" />
          </div>
          <div class="text-[#000000CC] text-[14px] font-source">
            通過創新跨鏈技術，打造安全、高效的資產轉移和交易環境，加強跨境和區塊鏈連接，促進去中心化創新，開拓金融新領域。
          </div>
        </div>
        <div class="font-source mb-20" v-if="selectList[1].id == setectId">
          <div class="text-[#000] text-[18px] font-700 mb-10 font-source">
            聚币交易所:愿景与使命
          </div>
          <div class="text-[#000000CC] text-[14px] font-source">
            聚币交易所以创新跨链技术为驱动核心，全力为用户打造安全、高效且无缝衔接的资产转移与交易环境。通过搭建稳固的技术桥梁，打破区块链间的隔阂，让资产自由流通无阻碍。同时，积极推行DAO治理模式，赋予用户深度参与平台决策的权利，实现真正的去中心化治理，推动去中心化金融（DeFi）朝着更公平、透明的方向蓬勃发展，为用户创造更多价值。
          </div>
          <div class="my-[16px]">
            <van-image width="100%" height="154px" :src="decs" />
          </div>
          <div class="text-[#000000CC] text-[14px] font-source mt-4">
            在WEB3.0时代浪潮中，聚币交易所立志成为去中心化金融领域的领军者。凭借不断革新的跨链技术，持续加强跨境与区块链的深度连接，构建一个全球互联互通的金融新生态。激发去中心化创新活力，开拓前所未有的金融新领域，让全球用户都能在这个开放、包容的平台上共享数字金融发展的红利，开启金融新未来的辉煌篇章。
          </div>
        </div>
        <div class="font-source mb-20" v-if="selectList[2].id == setectId">
          <div class="text-[#000] text-[18px] font-700 mb-10 font-source">
            创新生态激发无限可能
          </div>
          <div class="text-[#000000CC] text-[14px] font-source">
            聚币交易所优势显著：创新跨链技术打破链间壁垒，实现资产高效安全转移交易；DAO治理模式让用户参与决策，真正去中心化；加强跨境与链间连接，激发创新活力，为用户开拓多元金融新机遇。
          </div>
          <div class="my-[16px]">
            <van-image width="100%" height="154px" :src="decs" />
          </div>
          <!-- <div class="text-[#000000CC] text-[14px] mt-6 font-source">
            聚币交易所致力于加强跨境和区块链的深度连接，为用户打开了一扇通往全球数字金融市场的窗口。平台与全球众多知名区块链项目和金融机构建立了紧密的合作关系，整合了丰富的跨境金融资源。用户可以在聚币交易所轻松参与全球范围内的数字资产交易，获取来自不同国家和地区的优质投资项目。这种跨境连接不仅为用户提供了更多的投资选择和盈利机会，也促进了全球数字金融市场的融合与发展，推动了去中心化金融（DeFi）在全球范围内的普及与应用。
          </div> -->
        </div>
        <!-- 合作伙伴 -->
        <div class="text-[#000000] text-[18px] font-source font-700 mb-8">合作伙伴</div>
        <div class="flex flex-col items-center gap-18 mb-44">
          <div class="w-100% flex items-center">
            <div class="w-50% border-D9 flex items-center px-20 rounded-[6px]">
              <van-image width="100%" height="26px" :src="binance" />
            </div>
            <div class="w-50% border-D9 flex items-center px-20 rounded-[6px] ml-16">
              <van-image width="100%" height="24px" :src="conin" />
            </div>
          </div>
          <div class="w-100% flex items-center">
            <div class="w-50% border-D9 flex items-center px-20 rounded-[6px]">
              <van-image width="100%" height="26px" :src="coninbase" />
            </div>
            <div class="w-50% border-D9 flex items-center px-20 rounded-[6px] ml-16">
              <div><van-image width="100%" height="24px" :src="dapp_icon" /></div>
              <div class="ml-4"><van-image width="100%" height="24px" :src="dapp" /></div>
            </div>
          </div>
          <div class="w-100% flex items-center">
            <div class="w-50% border-D9 flex items-center px-20 rounded-[6px]">
              <div><van-image width="28px" height="28px" :src="fores_icon" /></div>
              <div class="ml-4"><van-image width="76px" height="26px" :src="fores" /></div>
            </div>
            <div class="w-50% border-D9 flex items-center px-20 rounded-[6px] ml-16">
              <div><van-image width="32px" height="32px" :src="token_icon" /></div>
              <div class="ml-4"><van-image width="76px" height="26px" :src="token" /></div>
            </div>
          </div>
          <div class="w-100% flex items-center">
            <div class="w-50% border-D9 flex items-center px-20 rounded-[6px]">
              <van-image width="100%" height="26px" :src="pancok" />
            </div>
            <div class="w-50% border-D9 flex items-center px-20 rounded-[6px] ml-16">
              <van-image width="100%" height="26px" :src="coinmarketcap" />
            </div>
          </div>
        </div>
      </div>
      <div class="body_footer bg-[#101613] h-92 flex items-center justify-between">
        <div class="text-[#FFFFFF] font-roboto">
          <div class="mb-10 text-[14px] font-700">Contact Us</div>
          <div class="text-[12px] opacity-60">® 版权,所有 {{ currentYear }} 保留所有权利</div>
        </div>
        <div class="flex items-center gap-24">
          <a href="javascript:void(0)" target="_blank">
            <van-image width="34" height="34" :src="tg" />
          </a>
          <a href="javascript:void(0)" target="_blank">
            <van-image width="34" height="34" :src="x" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.van-hairline--surround{
  padding: 6px 10px;
  border-radius: 6px;
}
.container {
  width: 100%;

  // height: 100vh;
  // display: flex;
  // flex-direction: column;
  // background-color: #f5f5f5;
  .body {
    width: 100%;
    min-height: calc(100vh - var(--van-nav-bar-height));

    &_top {
      width: 100%;
      height: 170px;
      background: linear-gradient(192deg, #191d1c 30.36%, #237d4e 90.99%);
    }

    &_content {
      margin-top: -116px;
    }

    &_footer {
      padding-left: 20px;
      padding-right: 16px;
      padding-top: 18px;
      padding-bottom: 30px;
    }
  }
}

.custom-indicator {
  position: absolute;
  left: 25px;
  bottom: 12px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}

.border-D9 {
  // padding: 8px 0;
  height: 46px;
  padding-top: 8px;
  padding-bottom: 8px;
  border: 1px solid #d9d9d9;
}
</style>
