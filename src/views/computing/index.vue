<script setup>
import { onMounted, ref, watch } from 'vue'
import Dialog from '@/components/Dialog.vue'
import { useI18n } from 'vue-i18n'
import avatar from '@/static/icon/public/avatar.png'
import swiper from '@/static/imgs/index/swiper.png'
import api from '@/apis'
import { debounce } from '@/utils'
import { showToast } from 'vant'
import useWeb3 from '@/utils/useWeb3'
import { formatEther } from 'ethers'

const { t } = useI18n()
let amount = ref(100)
let balance = ref(0)

// 驗證輸入只允許正數和小數
const validateAmount = (value) => {
  // 移除所有非數字和小數點的字符
  let cleaned = value.replace(/[^0-9.]/g, '')
  
  // 確保只有一個小數點
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // 確保小數點後最多18位
  if (parts.length === 2 && parts[1].length > 18) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 18)
  }
  
  // 確保不以小數點開頭
  if (cleaned.startsWith('.')) {
    cleaned = '0' + cleaned
  }
  
  // 確保不以多個0開頭（除了0.xxx的情況）
  if (cleaned.match(/^0+[1-9]/)) {
    cleaned = cleaned.replace(/^0+/, '')
  }
  
  return cleaned
}

const handleAmountInput = (event) => {
  const inputValue = event.target.value
  const validatedValue = validateAmount(inputValue)
  
  // 更新輸入框的值
  event.target.value = validatedValue
  amount.value = validatedValue
}
onMounted( async () => {
  watch(amount, debouncedHandler)
  await useWeb3.ensureReady()
  const res = await useWeb3.provider.getBalance(useWeb3.signer.address)
  if(res){
    balance.value = formatEther(res)
  }else{
    balance.value = 0.00
  }
  
})

const debouncedHandler = debounce(async (value) => {
  if (value) {
    await calc()
  }

}, 500)
const dialogRef = ref(null)
// const selectList = ref([
//   { text: '选项一' },
//   { text: '选项二' },
//   { text: '选项三' },
// ])
const showPopover = ref(false)
const onSelect = (index) => {
  console.log(index)
}
const handleClick = async() => {
  // 驗證金額是否為有效的正數
  const numAmount = parseFloat(amount.value)
  if (isNaN(numAmount) || numAmount <= 0) {
    showToast('请输入有效的认购数量')
    return
  }
  dialogRef.value.open()
}
let toPay = async ()=>{
  // try {
    await getPayOrder()
    await useWeb3.ensureReady()
    await useWeb3.pay(payOrder.value.pay_amount, payOrder.value.address1, payOrder.value.address2, payOrder.value.order_no)
  // } catch (error) {
  //   showToast('支付失败')
  // }
  
}


let order = ref({})
let payOrder = ref(null)
const getPayOrder = async () => {
  try {
    const res = await api.home.getPayOrder({ amount:amount.value })
    payOrder.value = res
  } catch (error) { 
    showToast(error.message)
  }
}
const calc = async () => {
  const res = await api.home.calc({
    amount:amount.value
  })
  order.value = res
}
calc()



</script>
<template>
  <div class="container">
    <div class="body">
      <!-- 底部按钮fixed pb-[66px] -->
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
                  v-for="(value, index) in total">
                </div>
              </div>
            </template>
          </van-swipe>
        </div>
        <!-- <div class="mb-16">
          <div class="text-[#000] font-pingfang text-[14px] mb-8">认购类型</div>
          <div
            class="font-700 text-[#000] border-c0 rounded-[8px] px-10 py-12 font-rroboto flex items-center justify-between">
            <div class="flex items-center">
              <van-image width="18px" height="18px" :src="avatar" />
              <div class="ml-6">JU</div>
            </div>
            <div class="text-[#237D4E] font-700">
              <van-popover v-model:show="showPopover" :actions="selectList" @select="onSelect" :show-arrow="false"
                :offset="[-50, 0]">
                <template #reference>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                    <path
                      d="M1.66065 0.392841L5.75777 4.1337L9.90873 0.343694L9.90909 0.344384C10.0496 0.220268 10.2409 0.1439 10.4517 0.1439C10.8836 0.143899 11.2337 0.463593 11.2337 0.857915C11.2337 1.05035 11.15 1.22502 11.0141 1.35333L11.0145 1.35367L6.3225 5.63771L6.32212 5.63736C6.18006 5.77193 5.98076 5.85596 5.75968 5.85596C5.75891 5.85596 5.75854 5.85596 5.75777 5.85596C5.757 5.85596 5.75661 5.85596 5.75623 5.85596C5.53515 5.85596 5.33545 5.77193 5.1934 5.63736L5.19303 5.63771L0.500997 1.3537L0.502913 1.35194C0.368509 1.22363 0.285644 1.04969 0.285644 0.857926C0.285644 0.463603 0.635784 0.14391 1.06765 0.14391C1.30476 0.14392 1.51706 0.240484 1.66065 0.392841Z"
                      fill="black" />
                  </svg>
                </template>
              </van-popover>
            </div>
          </div>
        </div> -->
        <div class="mb-10">
          <div class="text-[#000] font-pingfang text-[14px] mb-8">数量</div>
          <div
            class="font-700 text-[#000] border-c0 rounded-[8px] px-10 py-12 font-rroboto flex items-center justify-between">
            <input type="text" v-model="amount" @input="handleAmountInput" placeholder="请输入认购数量"
              class="w-100% outline-none border-none font-pingfang font-400 text-[12px] text-[#7A7777]" />
          </div>
        </div>
        <div class="flex items-center justify-between text-[#7A7777] text-[10px] font-pingfang mb-16">
          <div>汇率:1JU={{ Number(order?.price).toFixed(2)||'-' }}USDT</div>
          <div>可用资产：{{ Number(balance).toFixed(4) }} JU</div>
        </div>
        <div class="flex items-center justify-between mb-12">
          <div class="w-50% font-roboto py-10 px-16 rounded-[12px] bg-[#F2F6F6]">
            <div class="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                <path
                  d="M13 4.49957C13.3283 4.49957 13.6537 4.56435 13.957 4.69C14.2602 4.81562 14.5355 4.99997 14.7676 5.23199C14.9997 5.46417 15.1839 5.74018 15.3096 6.04352C15.4351 6.34667 15.5 6.67146 15.5 6.99957C15.5 7.32785 15.4352 7.6533 15.3096 7.9566C15.1839 8.25995 14.9997 8.53596 14.7676 8.76813C14.5355 9.00016 14.2602 9.18451 13.957 9.31012C13.8093 9.37132 13.6559 9.41695 13.5 9.44879V13.2525L17.1143 9.63824C16.9379 9.43516 16.7936 9.20585 16.6904 8.9566C16.5648 8.6533 16.5 8.32785 16.5 7.99957C16.5 7.67146 16.5649 7.34667 16.6904 7.04352C16.8161 6.74018 17.0003 6.46417 17.2324 6.23199C17.4645 5.99997 17.7398 5.81562 18.043 5.69C18.3463 5.56435 18.6717 5.49957 19 5.49957C19.3283 5.49957 19.6537 5.56435 19.957 5.69C20.2602 5.81562 20.5355 5.99997 20.7676 6.23199C20.9997 6.46417 21.1839 6.74018 21.3096 7.04352C21.4351 7.34667 21.5 7.67146 21.5 7.99957C21.5 8.32785 21.4352 8.6533 21.3096 8.9566C21.1839 9.25995 20.9997 9.53596 20.7676 9.76813C20.5355 10.0002 20.2602 10.1845 19.957 10.3101C19.6537 10.4358 19.3283 10.5005 19 10.5005C18.6717 10.5005 18.3463 10.4358 18.043 10.3101C17.9999 10.2923 17.9589 10.2698 17.917 10.2496L13.5 14.6666V17.4996H12.5V14.4752L8.20996 10.1851C8.12775 10.2306 8.04419 10.274 7.95703 10.3101C7.6537 10.4358 7.32833 10.5005 7 10.5005C6.67167 10.5005 6.3463 10.4358 6.04297 10.3101C5.7398 10.1845 5.46448 10.0002 5.23242 9.76813C5.00027 9.53596 4.81605 9.25995 4.69043 8.9566C4.56484 8.6533 4.49997 8.32785 4.5 7.99957C4.50003 7.67146 4.56491 7.34667 4.69043 7.04352C4.81605 6.74018 5.00027 6.46417 5.23242 6.23199C5.46448 5.99997 5.7398 5.81562 6.04297 5.69C6.3463 5.56435 6.67167 5.49957 7 5.49957C7.32833 5.49957 7.6537 5.56435 7.95703 5.69C8.2602 5.81562 8.53552 5.99997 8.76758 6.23199C8.99973 6.46417 9.18395 6.74018 9.30957 7.04352C9.43509 7.34667 9.49997 7.67146 9.5 7.99957C9.50003 8.32785 9.43516 8.6533 9.30957 8.9566C9.22379 9.16375 9.1087 9.35649 8.97168 9.53278L12.5 13.0611V9.44879C12.3441 9.41695 12.1907 9.37132 12.043 9.31012C11.7398 9.18451 11.4645 9.00016 11.2324 8.76813C11.0003 8.53596 10.8161 8.25995 10.6904 7.9566C10.5648 7.6533 10.5 7.32785 10.5 6.99957C10.5 6.67146 10.5649 6.34667 10.6904 6.04352C10.8161 5.74018 11.0003 5.46417 11.2324 5.23199C11.4645 4.99997 11.7398 4.81562 12.043 4.69C12.3463 4.56435 12.6717 4.49957 13 4.49957Z"
                  fill="black" />
                <path
                  d="M13 17.5001C13.2967 17.5001 13.5867 17.588 13.8334 17.7529C14.08 17.9177 14.2723 18.1519 14.3858 18.426C14.4994 18.7001 14.5291 19.0017 14.4712 19.2927C14.4133 19.5837 14.2704 19.8509 14.0607 20.0607C13.8509 20.2705 13.5836 20.4134 13.2926 20.4712C13.0017 20.5291 12.7001 20.4994 12.426 20.3859C12.1519 20.2723 11.9176 20.0801 11.7528 19.8334C11.588 19.5867 11.5 19.2967 11.5 19.0001C11.5 18.6022 11.658 18.2207 11.9393 17.9394C12.2206 17.6581 12.6022 17.5001 13 17.5001ZM13 15.5001C12.3078 15.5001 11.6311 15.7053 11.0555 16.0899C10.4799 16.4745 10.0313 17.0211 9.76642 17.6607C9.50152 18.3002 9.4322 19.0039 9.56725 19.6829C9.7023 20.3618 10.0356 20.9855 10.5251 21.4749C11.0146 21.9644 11.6383 22.2978 12.3172 22.4328C12.9961 22.5679 13.6999 22.4985 14.3394 22.2336C14.9789 21.9687 15.5256 21.5201 15.9101 20.9446C16.2947 20.369 16.5 19.6923 16.5 19.0001C16.5 18.5404 16.4095 18.0853 16.2336 17.6607C16.0577 17.236 15.7999 16.8502 15.4749 16.5252C15.1499 16.2002 14.764 15.9424 14.3394 15.7665C13.9148 15.5906 13.4596 15.5001 13 15.5001Z"
                  fill="#00C18D" />
              </svg>
            </div>
            <div class="text-[#000000] text-[16px] font-700 mb-6">{{ Number(order?.need_report||0.00).toFixed(3) }}</div>
            <div class="text-[#808080] text-[10px]">预计支付XUSDT</div>
          </div>
          <div class="w-50% font-roboto py-10 px-16 rounded-[12px] bg-[#F2F6F6] ml-10">
            <div class="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11.03 12.2C6.31 12.2 2.75 10.31 2.75 7.80002C2.75 5.29002 6.31 3.40002 11.03 3.40002C15.75 3.40002 19.31 5.29002 19.31 7.80002C19.31 10.31 15.75 12.2 11.03 12.2ZM11.03 5.41002C7.2 5.41002 4.75 6.83002 4.75 7.81002C4.75 8.79002 7.2 10.21 11.03 10.21C14.86 10.21 17.31 8.79002 17.31 7.81002C17.31 6.83002 14.87 5.41002 11.03 5.41002ZM11.03 17.06C7.32 17.06 4.14 15.84 3.12 14.02C3.00689 13.7907 2.98596 13.5267 3.0615 13.2824C3.13704 13.038 3.30332 12.8319 3.52614 12.7064C3.74897 12.5809 4.0114 12.5456 4.2595 12.6076C4.50759 12.6697 4.72249 12.8244 4.86 13.04C5.41 14.02 7.76 15.06 11.03 15.06C14.21 15.06 16.57 14.05 17.17 13.09C17.46 12.62 18.08 12.48 18.55 12.78C19.02 13.07 19.16 13.69 18.86 14.16C17.75 15.92 14.68 17.06 11.03 17.06ZM11.03 21.91C7.32 21.91 4.14 20.69 3.12 18.87C3.00689 18.6407 2.98596 18.3767 3.0615 18.1324C3.13704 17.888 3.30332 17.6819 3.52614 17.5564C3.74897 17.4309 4.0114 17.3956 4.2595 17.4576C4.50759 17.5197 4.72249 17.6744 4.86 17.89C5.41 18.87 7.76 19.91 11.03 19.91C14.21 19.91 16.57 18.9 17.17 17.94C17.46 17.47 18.08 17.33 18.55 17.63C19.02 17.92 19.16 18.54 18.86 19.01C17.75 20.77 14.68 21.91 11.03 21.91Z"
                  fill="black" />
                <path
                  d="M11.03 21.91C7.31997 21.91 4.13997 20.69 3.11997 18.87C3.00686 18.6407 2.98593 18.3767 3.06147 18.1323C3.13701 17.888 3.30329 17.6819 3.52611 17.5564C3.74893 17.4309 4.01137 17.3956 4.25946 17.4576C4.50756 17.5197 4.72245 17.6744 4.85997 17.89C5.40997 18.87 7.75997 19.91 11.03 19.91C14.21 19.91 16.57 18.9 17.17 17.94C17.46 17.47 18.08 17.33 18.55 17.63C19.02 17.92 19.16 18.54 18.86 19.01C17.75 20.77 14.68 21.91 11.03 21.91Z"
                  fill="#00C18D" />
              </svg>
            </div>
            <div class="text-[#000000] text-[16px] font-700 mb-6">{{ Number(order?.needJu||0.00).toFixed(3) }}</div>
            <div class="text-[#808080] text-[10px]">预计支付Ju</div>
          </div>
        </div>
        <!-- <div class="p-12 rounded-[10px] bg-[#EFF7F4] mb-16 text-[10px]">
          <div class="mb-20 text-[#3A3A3A]">认购时间:2025-09-07 00:00:00~2025-10-0600:00:00</div>
          <p style="line-height: 1.8;">认购规则:</p>
          <p style="line-height: 1.8;">1、订阅后，您将获得相当于您订阅金额的计算能力和积分。</p>
          <p style="line-height: 1.8;">2、认购的JU将安全地持有在持牌经纪账户中。要激活您的持股，您必须通过Ju.com 交易所完成经纪账户KYC。</p>
          <p style="line-height: 1.8;">3、认购股份总数有限，将按先到先得的原则分配。</p>
          <p style="line-height: 1.8;">4、2025年09月15日以前，认购价0.65u/股:9月16日~9月25日之间，认购价0.715u/股:9月26日~10月5日，认购价0.79u/股</p>
          <p style="line-height: 1.8;">5、您订阅的JU可能会被质押12个月。质押期结束后，这些JU将在经纪账户内自由交易。</p>
        </div> -->
        <div
          class=" h-46 rounded-[14px] bg-[#00C18D] text-[#fff] text-[18px] flex items-center justify-center mb-16 van-haptics-feedback"
          @click="handleClick">
          认 购</div>
        <!-- </div> -->
      </div>
    </div>
    <Dialog ref="dialogRef" title="认购" @confirm="toPay">
      <div class="w-100% flex flex-col items-center justify-center font-roboto text-[18px]">
        <div class=" text-[#000] mb-10">是否确认花费</div>
        <div class="text-[#00C18D] font-800">{{ Number(order?.needJu || 0.00).toFixed(3) }} JU</div>
      </div>
    </Dialog>
  </div>
</template>
<style lang="scss" scoped>
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
      background: linear-gradient(192deg, #191D1C 30.36%, #237D4E 90.99%);
    }

    // &_content {}

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

.border-c0 {
  border: 0.5px solid #C0C0C0;
}

.footerBtn {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  background-color: #fff;
  padding: 6px 16px;
}
</style>
