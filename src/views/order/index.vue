<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import avatar from '@/static/icon/public/avatar.png'
import swiper from '@/static/imgs/index/swiper.png'
import api from '@/apis'
const { t } = useI18n()
let orderList = ref([])
let page = ref(1)
let pageSize = ref(10)
let loading = ref(false)
let finished = ref(false)

const loadMore = async () => {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const res = await api.home.orderList({ page: page.value, page_size: pageSize.value })
    const list = res?.list ?? []

    // 追加數據
    if (page.value === 1 && orderList.value.length && list.length) {
      orderList.value = []
    }
    orderList.value.push(...list)

    // 判斷是否還有更多
    if (!list.length || list.length < pageSize.value) {
      finished.value = true
    } else {
      page.value += 1
    }
  } finally {
    loading.value = false
  }
}

const handleScroll = (e) => {
  const { scrollTop, scrollHeight: scrollHeightValue, clientHeight: clientHeightValue } = e.target
  if (scrollHeightValue - scrollTop - clientHeightValue < 50) {
    loadMore()
  }
}

onMounted(() => {
  loadMore()
})
</script>
<template>
  <div class="container">
    <div class="body">
      <div class="body_content px-15">
        <!-- vant轮播 -->
        <div class="mb-20">
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
        <div class="px-8 py-6 flex items-center bg-[#EDFFFF] rounded-full mb-16">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10.2064 3.43323C8.94028 3.43323 7.7026 3.80867 6.64987 4.51209C5.59713 5.2155 4.77663 6.2153 4.2921 7.38503C3.80758 8.55477 3.68081 9.84192 3.92782 11.0837C4.17482 12.3255 4.78452 13.4661 5.67979 14.3614C6.57507 15.2567 7.71573 15.8664 8.95751 16.1134C10.1993 16.3604 11.4864 16.2336 12.6562 15.7491C13.8259 15.2646 14.8257 14.4441 15.5291 13.3913C16.2325 12.3386 16.608 11.1009 16.608 9.83482C16.608 8.99415 16.4424 8.16171 16.1207 7.38503C15.799 6.60836 15.3274 5.90265 14.733 5.30821C14.1386 4.71377 13.4329 4.24223 12.6562 3.92052C11.8795 3.59881 11.0471 3.43323 10.2064 3.43323ZM10.2064 13.3859C10.0659 13.3859 9.92862 13.3443 9.81182 13.2662C9.69503 13.1882 9.604 13.0773 9.55024 12.9475C9.49649 12.8177 9.48242 12.6749 9.50982 12.5371C9.53723 12.3994 9.60487 12.2728 9.7042 12.1735C9.80352 12.0742 9.93007 12.0065 10.0678 11.9791C10.2056 11.9517 10.3484 11.9658 10.4782 12.0195C10.608 12.0733 10.7189 12.1643 10.7969 12.2811C10.875 12.3979 10.9166 12.5352 10.9166 12.6757C10.9092 12.859 10.8311 13.0324 10.6987 13.1594C10.5663 13.2864 10.3899 13.3573 10.2064 13.3571V13.3859ZM10.5615 10.5066C10.5615 10.9001 10.3984 11.2169 10.2064 11.2169C10.0144 11.2169 9.85129 10.9001 9.85129 10.5066L9.45779 7.27226C9.45779 7.0839 9.53262 6.90325 9.66581 6.77006C9.799 6.63687 9.97965 6.56204 10.168 6.56204C10.3564 6.56204 10.537 6.63687 10.6702 6.77006C10.8034 6.90325 10.8782 7.0839 10.8782 7.27226L10.5615 10.5066Z"
              fill="#00C18D" />
          </svg>
          <div class="text-[#2C2C2C] text-[10px] font-pingfang">
            认购获得的股票处于锁仓状态，可在券商处查看您的股票资产
          </div>
        </div>
        <div class="">
          <!-- <div class="flex items-cente justify-between text-[#7F8693] text-[12px] font-pingfang mb-8">
            <div class="flex items-center">
              <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" :offset="[30,0]">
                <template #reference>
                  <div class="flex items-center ">
                    <div class="mr-[6px]">{{ actions.find(item=>item.id == selectId).text }}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <g clip-path="url(#clip0_3_223)">
                        <path
                          d="M8.47737 2.74483C8.59815 2.62919 8.75798 2.56315 8.92516 2.55982C9.09234 2.5565 9.25467 2.61612 9.37996 2.72686C9.50524 2.83761 9.58434 2.99139 9.60156 3.15772C9.61878 3.32404 9.57286 3.49077 9.47292 3.62483L9.40803 3.6995L5.00537 7.99461L0.671151 3.8675C0.549478 3.75146 0.476143 3.59374 0.465837 3.42592C0.455532 3.2581 0.509016 3.09258 0.615577 2.96253C0.722137 2.83248 0.873903 2.74749 1.04047 2.72459C1.20704 2.7017 1.37611 2.74258 1.51381 2.83906L1.59024 2.90127L4.99381 6.14216L8.47735 2.74481L8.47737 2.74483Z"
                          fill="#7F8693" />
                      </g>
                      <defs>
                        <clipPath id="clip0_3_223">
                          <rect width="10" height="10" fill="white" transform="translate(10) rotate(90)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </template>
              </van-popover>

            </div>
            <div class="flex items-center">
              <div class="mr-[6px]">正序</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M8.79299 4.1491C8.98313 4.1491 9.15461 4.03455 9.22747 3.85876C9.30032 3.68318 9.25999 3.48083 9.12561 3.34626L6.97239 1.19324C6.9011 1.12195 6.78567 1.12195 6.71438 1.19324L6.30725 1.60037C6.23596 1.67166 6.23596 1.78718 6.30725 1.85837L7.65764 3.20867H0.842993C0.743481 3.20867 0.66272 3.28933 0.66272 3.38894V3.96892C0.66272 4.06843 0.743384 4.14919 0.842993 4.14919H8.79299V4.1491ZM9.15676 5.84685H1.20901C1.01887 5.84685 0.847388 5.9614 0.774536 6.13718C0.701685 6.31277 0.742017 6.51511 0.876392 6.64968L3.02961 8.80281C3.1009 8.8741 3.21633 8.8741 3.28762 8.80281L3.69475 8.39568C3.76604 8.32439 3.76604 8.20886 3.69475 8.13767L2.34436 6.78728H9.15676C9.25754 6.78728 9.33918 6.70554 9.33918 6.60486V6.02937C9.33918 5.92859 9.25754 5.84685 9.15676 5.84685Z"
                  fill="#7F8693" />
              </svg>
            </div>
          </div> -->
          <div class="list flex flex-col items-center gap-16 mb-24" v-if="orderList.length"
            @scroll.passive="handleScroll" style="max-height: 60vh; overflow-y: auto;">
            <div class="flex w-100% border-D9 px-15 py-12 rounded-[10px] font-pingfang" v-for="item in orderList"
              :key="item.id">
              <!-- <div class="">
                <van-image width="30px" height="30px" :src="avatar" />
              </div>
              <div class="flex flex-col gap-6 ml-10">
                <div class="text-[#000] text-[16px]">{{ item.ju_num }}</div>
                <div class="rounded-[6px] px-12 py-4 bg-[#E5FAEF] text-[#19A55F] text-[12px] text-center">获得算力:{{ item.total_amount }}
                </div>
                <div class="text-[#9C9C9C]">{{ item.created_at }}</div>
              </div> -->
              <div class="flex flex-col items-center justify-between">
                <div class="flex w-100% items-center justify-between p-4">
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">获得算力</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ Number(item?.total_power||0.00).toFixed(2)}}
                    </div>
                  </div>
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">支付XUSDT</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ Number(item?.report_num).toFixed(2)}}
                    </div>
                  </div>
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">当前Ju价格</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ Number(item?.ju_price).toFixed(2) }}
                    </div>
                  </div>

                </div>
                <div class="flex w-100% items-center p-4 gap-30">
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">支付Ju数量</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ Number(item?.ju_num).toFixed(2) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">购买时间</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ item?.created_at || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="py-12 text-center text-[#999] text-[12px]" v-if="loading">加載中...</div>
          <div class="py-12 text-center text-[#999] text-[12px]" v-else-if="finished">沒有更多數據了</div>
          <div class="flex items-center justify-center mt-20" v-else>
            <van-empty image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80"
              description="暂无订单" />
          </div>

        </div>
      </div>
    </div>
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

.border-D9 {
  border: 1px solid #D9D9D9;
}
</style>
