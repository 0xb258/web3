<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useWeb3 from '@/utils/useWeb3'
import api from '@/apis'
import { ethers } from 'ethers'
import Dialog from '@/components/Dialog.vue'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { ensureReady } from '@/utils/useWeb3'
import { transfer as web3Transfer } from '@/utils/useWeb3'
const { t } = useI18n()
let show = ref(false)
const selectIndex = ref(5)
let open = () => {
  show.value = true
}
let totalType = ref({
  1: 'report_balance',
  2: 'x_s_balance',
  3: 'x_d_balance',
  4: 'usdt_balance',
  5: 'ju_balance'
})
const actions = ref([
  {
    text: 'JU',
    value: '5'
  },
  {
    text: 'USDT',
    value: '4'
  },
  {
    text: 'XJ',
    value: '2'
  }, {
    text: 'XD',
    value: '3'
  }
])
let tokens = ref({
  ju_balance: 0.00,
  usdt_balance: 0.00,
  x_s_balance: 0.00,
  x_d_balance: 0.00,
  report_balance: 0.00,
})
const getUserInfo = async () => {
  const res = await api.home.userInfo()
  tokens.value = res?.balance_list ?? {}
}
let getTokenName = (id) => {
  return actions.value.find(item => item.value == id)?.text
}
const currentTokenId = ref(5)
let total_type = () => {
  return totalType.value[currentTokenId.value]
}


const onSelect = (val) => {
  selectIndex.value = val.value
  currentTokenId.value = val.value
}
const dialogRef = ref(null)
let openDialog = () => {
  // if(!amount.value){
  //   showToast('请输入提现数量')
  //   return
  // }
  // let index = total_type()
  // if (Number(amount.value) > tokens.value[index]){
  //   showToast('余额不足')
  //   return
  // }
  dialogRef.value.open()
}
let list = ref([])
let page = ref(1)
let pageSize = ref(10)
let loading = ref(false)
let finished = ref(false)
let amount = ref('')

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

const loadMore = async () => {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const res = await api.home.applyList({
      page: page.value,
      page_size: pageSize.value,
    })
    const items = res?.list || []
    if (page.value === 1 && list.value.length && items.length) {
      list.value = []
    }
    list.value.push(...items)
    if (!items.length || items.length < pageSize.value) {
      finished.value = true
    } else {
      page.value += 1
    }
  } finally {
    loading.value = false
  }
}

const resetAndReload = () => {
  list.value = []
  page.value = 1
  finished.value = false
  loadMore()
}
let handleApply = async () => {
  await ensureReady()
  try {
    let Fee = 0.0015
    let currentBalance = await useWeb3.provider.getBalance(useWeb3.signer.address)
    let current = ethers.formatEther(currentBalance).toString()
    if (current < Fee) {
      showToast('Ju余额不足')
      return
    }
    showLoadingToast({ message: '正在支付...', duration: 0 })
    await web3Transfer(Fee, '0x926cCC746a0e53767f3641C6c80E063325bdB17C')
    closeToast()
  } catch (error) {
    showToast('提现失败')
  }
  await api.home.apply({
    amount: amount.value,
    coin_id: currentTokenId.value
  })
  showToast('提现成功')
  //更新提现记录
  resetAndReload()
  //更新用户余额
  getUserInfo()
}
onMounted(async () => {

  await getUserInfo()
  total_type()
  loadMore()
})

const handleScroll = (e) => {
  const { scrollTop, scrollHeight: scrollHeightValue, clientHeight: clientHeightValue } = e.target
  if (scrollHeightValue - scrollTop - clientHeightValue < 50) {
    loadMore()
  }
}

</script>
<template>
  <div class="container">
    <div class="mb-30">
      <div class="flex items-center mb-18">
        <div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
        <div class="text-[#000] text-[14px] font-pingfang ml-6">提现</div>
      </div>
      <div class="text-[#000] text-[14px] mb-16">
        <div class="font-pingfang font-400 mb-8">提现币种</div>
        <div class="h-46 rounded-[8px] flex items-center justify-between px-10 border-c0">
          <div class="font-roboto font-500">{{ getTokenName(selectIndex) }}</div>
          <van-popover v-model:show="show" :actions="actions" @select="onSelect" :show-arrow="false" :offset="[-30, 0]">
            <template #reference>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path
                  d="M1.66071 0.392841L5.75784 4.1337L9.90879 0.343694L9.90915 0.344384C10.0497 0.220268 10.241 0.1439 10.4518 0.1439C10.8836 0.143899 11.2337 0.463593 11.2337 0.857915C11.2337 1.05035 11.1501 1.22502 11.0142 1.35333L11.0146 1.35367L6.32256 5.63771L6.32218 5.63736C6.18012 5.77193 5.98082 5.85596 5.75974 5.85596C5.75897 5.85596 5.7586 5.85596 5.75784 5.85596C5.75706 5.85596 5.75668 5.85596 5.75629 5.85596C5.53521 5.85596 5.33551 5.77193 5.19346 5.63736L5.19309 5.63771L0.501058 1.3537L0.502974 1.35194C0.36857 1.22363 0.285705 1.04969 0.285705 0.857926C0.285705 0.463603 0.635846 0.14391 1.06771 0.14391C1.30482 0.14392 1.51712 0.240484 1.66071 0.392841Z"
                  fill="black" />
              </svg>
            </template>
          </van-popover>
        </div>
      </div>
      <div class="text-[#000] text-[14px] mb-16">
        <div class="font-pingfang font-400 mb-8">提现数量</div>
        <div class="h-46 rounded-[8px] flex items-center justify-between px-10 border-c0">
          <div class="text-[14px] text-[#7A7777] font-pingfang numInput">
            <input type="text" placeholder="请输入提现金额" v-model="amount" @input="handleAmountInput"
              class="border-none outline-none bg-[#F7F7F9]/0 w-100% text-[14px]" />
          </div>
          <div class="flex items-center ml-16">
            <div class="text-[#7A7777] text-[14px] font-pingfang">{{ getTokenName(selectIndex) }}</div>
            <!-- <div class="h-16 w-1 bg-[#000000]/10 mx-6"></div>
            <div class="text-[#00C18D] text-[14px] font-pingfang">MAX</div> -->
          </div>

        </div>
        <div class="flex items-center justify-between text-[#7A7777] text-[10px] font-pingfang mt-[10px]">
          <!-- <div>汇率:1JU={{ Number(order?.price).toFixed(2) || '-' }}USDT</div> -->
          <div>当前可用 {{ getTokenName(selectIndex) }}：{{ Number(tokens[total_type()]).toFixed(3) }}</div>
        </div>
      </div>
      <div class="
        w-100% h-46 bg-[#00C18D] text-[#fff] text-[18px] van-haptics-feedback font-pingfang
         flex items-center justify-center rounded-[12px] van-haptics-feedback" @click="openDialog">
        提现
      </div>
    </div>
    <div class="mb-30">
      <div class="flex items-center mb-18">
        <div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
        <div class="text-[#000] text-[14px] font-pingfang ml-6">提现记录</div>
      </div>
      <div class="flex flex-col gap-10 scroll-box" @scroll.passive="handleScroll">
        <div class="px-16 py-10 rounded-[6px] bg-[#F5F8F8]" v-for="item in list" :key="item.no">
          <div class="row">
            <div class="flex items-center justify-between">
              <div class="text-[#8F8F8F] text-[12px] font-roboto font-400">订单号:{{ item.no }}</div>
              <div class="text-[#8F8F8F] text-[12px] font-roboto font-400">币种: {{ getTokenName(item?.coin_id)
              }}</div>
            </div>
          </div>
          <van-row>
            <van-col span="8" class="mt-[4px]">
              <div class="text-[#8F8F8F] text-[10px] font-roboto font-400">提现数量</div>
              <div class="text-[#000] font-7000 text-[14px] font-roboto mt-[2px]">{{ item.num }} {{
                getTokenName(item?.coin_id) }}</div>
            </van-col>
            <van-col span="8" class="mt-[4px]">
              <div class="text-[#8F8F8F] text-[10px] font-roboto font-400">手续费</div>
              <div class="text-[#000] font-7000 text-[14px] font-roboto mt-[2px]">{{ item.fee }}</div>
            </van-col>
            <van-col span="8" class="mt-[4px]">
              <div class="text-[#8F8F8F] text-[10px] font-roboto font-400">实际到账</div>
              <div class="text-[#000] font-7000 text-[14px] font-roboto mt-[2px]">{{ item.ac_amount }}</div>
            </van-col>
          </van-row>
          <div class="row mt-[6px]">
            <div class="flex items-center justify-between">
              <div class="text-[#8F8F8F] text-[10px] font-roboto font-400">
                时间：{{ item.created_at }}
              </div>
              <div class="text-[#8F8F8F] text-[10px] font-roboto font-400">
                <van-tag type="warning" v-if="item.status == 1">待到账</van-tag>
                <van-tag type="warning" v-if="item.status == 2">成功</van-tag>
                <van-tag type="danger" v-if="item.status == 3">失败</van-tag>
              </div>
            </div>
          </div>
          <!-- <div class="mb-10 flex items-center">
            <div class=" text-[#000] font-7000 text-[14px] font-roboto">{{ item.num }} {{ item.token }}</div>
          </div> -->
          <!-- <div class="text-[#8F8F8F] text-[10px] font-roboto font-400">
            时间：{{ item.created_at }}
          </div> -->
        </div>
        <div class="py-12 text-center text-[#999] text-[12px]" v-if="loading">加载中...</div>
        <div class="py-12 text-center text-[#999] text-[12px]" v-else-if="finished && list.length">没有更多数据了</div>
      </div>





      <div class="flex items-center justify-center mt-20" v-if="!list.length && !loading">
        <van-empty image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80"
          description="暂无数据" />
      </div>
    </div>
  </div>
  <Dialog ref="dialogRef" title="提现" @confirm="handleApply">
    <div class="w-100% flex flex-col items-center justify-center font-roboto text-[18px]">
      <div class=" text-[#000] mb-10">您是否确认提现</div>
      <div class="text-[#00C18D] font-800">{{ Number(amount).toFixed(2) }} {{ getTokenName(currentTokenId) }}</div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped>
.container {
  padding: 20px;
}

.border-c0 {
  border: 1px solid #c0c0c080;
}

.numInput {
  input {
    &::placeholder {
      font-size: 14px;
    }
  }
}

.scroll-box {
  max-height: 60vh;
  overflow-y: auto;
  /* 隱藏滾動條（保留滾動） */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE/Edge */
}

.scroll-box::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
</style>
