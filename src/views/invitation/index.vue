<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import friendBg from '@/static/imgs/friend/friend_bg.png'
import invitation from '@/static/imgs/friend/invitation.png'
import { showNotify, Collapse, CollapseItem } from 'vant'
import { formatEthereumAddress } from '@/utils'
import api from '@/apis'
import dayjs from 'dayjs'
const { t } = useI18n()
const activeTab = ref(0)
//用户信息
let userInfo = ref({})
const getUserInfo = async () => {
  const res = await api.home.userInfo()
  userInfo.value = res
}
//直推列表
let zhiList = ref([])
const getZhiList = async () => {
  const res = await api.home.zhiList()
  zhiList.value = res
}


let init = async () => {
  await getUserInfo()
  await getZhiList()
}

onMounted(() => {
  init()
})
const activeNames = ref(['0']);
const tabs = ref([
  {
    label: '邀请记录',
    value: '',
    id: 0
  },
  // {
  //   label: '奖励明细',
  //   value: '',
  //   id: 1
  // }
])
// 改变tab
const changeTab = (item) => {
  if (activeTab.value == item.id) return
  activeTab.value = item.id
}

// 复制内容到剪贴板
const copyContent = async (content, type) => {
  const targetUrl = window.location.href
  const urlObj = new URL(targetUrl)
  let text = urlObj.origin + "/#/index?code=" + content
  try {
    // 复制普通文本
    await navigator.clipboard.writeText(text)
    showNotify({ type: 'success', message: '复制成功' })
    return true
  } catch (err) {
    // 如果不支持Clipboard API，使用备用方法
    if (type === 'html') {
      // HTML内容使用execCommand无法直接复制
      throw new Error('浏览器不支持HTML复制')
    }

    return fallbackCopyText(text)
  }
}

// 备用复制方法
const fallbackCopyText = (text) => {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)

    try {
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)

      if (success) {
        showNotify({ type: 'success', message: '复制成功' })
        resolve(true)
      } else {
        reject(new Error('execCommand复制失败'))
      }
    } catch (err) {
      document.body.removeChild(textarea)
      reject(err)
    }
  })
}
</script>
<template>
  <div class="container">
    <div class="body">
      <div class="body_top mb-18" :style="{ background: `url(${friendBg}) no-repeat`, 'background-size': '100% 100%' }">
        <div class="body_top__content text-[#fff] font-pingfang">
          <div class="text-[20px] mb-6">邀请好友</div>
          <div class="text-[12px]">邀请好友赢取高额奖励</div>
        </div>
      </div>
      <div class="body_content px-15">
        <div class="border-D9 px-16 pt-[10px] pb-[0px] rounded-[10px] flex flex-col items-center mb-20">
          <van-image width="188px" height="154px" :src="invitation" />
          <div class="text-[#666666] text-[12px] font-pingfang mb-8">我的邀请码</div>
          <div class="mb-10 text-[#000000] text-[20px] font-roboto mb-26">{{ userInfo?.code }}</div>
          <div
            class="w-250 h-40 flex items-center justify-center rounded-[14px] bg-[#000000] text-[#fff] text-[14px] font-pingfang mb-26 van-haptics-feedback"
            @click="() => copyContent(userInfo?.code)">
            复制邀请码
          </div>
          <!-- <div class="w-100% flex items-center justify-between mb-16">
            <div class="text-[#7A7777] text-[12px] font-pingfang">推荐人邀请码</div>
            <div class="text-[#000000] text-[12px] font-pingfang flex items-center">
              <div class="mr-[6px]">WADADSDA</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                <path
                  d="M4.88757 3.625V1.9375C4.88757 1.78832 4.94684 1.64524 5.05233 1.53975C5.15781 1.43426 5.30089 1.375 5.45007 1.375H12.2001C12.3493 1.375 12.4923 1.43426 12.5978 1.53975C12.7033 1.64524 12.7626 1.78832 12.7626 1.9375V9.8125C12.7626 9.96168 12.7033 10.1048 12.5978 10.2102C12.4923 10.3157 12.3493 10.375 12.2001 10.375H10.5126V12.0625C10.5126 12.373 10.2594 12.625 9.94614 12.625H3.20401C3.12983 12.6254 3.0563 12.6112 2.98763 12.5832C2.91896 12.5551 2.85652 12.5137 2.80388 12.4615C2.75125 12.4092 2.70946 12.3471 2.68092 12.2786C2.65238 12.2101 2.63765 12.1367 2.63757 12.0625L2.63926 4.1875C2.63926 3.877 2.89239 3.625 3.20514 3.625H4.88757ZM6.01257 3.625H10.5126V9.25H11.6376V2.5H6.01257V3.625ZM4.88757 6.4375V7.5625H8.26257V6.4375H4.88757ZM4.88757 8.6875V9.8125H8.26257V8.6875H4.88757Z"
                  fill="black" />
              </svg>
            </div>
          </div> -->
          <!-- <div class="w-100% flex items-center justify-between">
            <div class="text-[#7A7777] text-[12px] font-pingfang">我的ID</div>
            <div class="text-[#000000] text-[12px] font-pingfang flex items-center">
              <div class="mr-[6px]">WADADSDA</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                <path
                  d="M4.88757 3.625V1.9375C4.88757 1.78832 4.94684 1.64524 5.05233 1.53975C5.15781 1.43426 5.30089 1.375 5.45007 1.375H12.2001C12.3493 1.375 12.4923 1.43426 12.5978 1.53975C12.7033 1.64524 12.7626 1.78832 12.7626 1.9375V9.8125C12.7626 9.96168 12.7033 10.1048 12.5978 10.2102C12.4923 10.3157 12.3493 10.375 12.2001 10.375H10.5126V12.0625C10.5126 12.373 10.2594 12.625 9.94614 12.625H3.20401C3.12983 12.6254 3.0563 12.6112 2.98763 12.5832C2.91896 12.5551 2.85652 12.5137 2.80388 12.4615C2.75125 12.4092 2.70946 12.3471 2.68092 12.2786C2.65238 12.2101 2.63765 12.1367 2.63757 12.0625L2.63926 4.1875C2.63926 3.877 2.89239 3.625 3.20514 3.625H4.88757ZM6.01257 3.625H10.5126V9.25H11.6376V2.5H6.01257V3.625ZM4.88757 6.4375V7.5625H8.26257V6.4375H4.88757ZM4.88757 8.6875V9.8125H8.26257V8.6875H4.88757Z"
                  fill="black" />
              </svg>
            </div>
          </div> -->
        </div>
        <div class="">
          <div class="flex items-center mb-12">
            <div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
            <div class="text-[#000] text-[14px] font-pingfang ml-6">我的身份</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="w-30%">
              <div class="mb-20">
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">{{
                  userInfo?.level_name || 0
                }}</div>
                <div class="text-[#666666] text-[12px] font-pingfang">等级</div>
              </div>
            </div>
            <div class="wMin-30%">
              <div class="mb-20" v-if="userInfo?.is_studio == 1">
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">
                是</div>
                <div class="text-[#666666] text-[12px] font-pingfang">工作室</div>
              </div>
            </div>
            <div class="wMin-20%">
              <div class="mb-20" v-if="userInfo?.is_center == 1">
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">是
                </div>
                <div class="text-[#666666] text-[12px] font-pingfang">运营中心</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-30">
          <div class="flex items-center mb-12">
            <div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
            <div class="text-[#000] text-[14px] font-pingfang ml-6">概况数据</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="w-30%">
              <div class="mb-20">
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">{{
                  userInfo?.zhi_num || 0
                }}</div>
                <div class="text-[#666666] text-[12px] font-pingfang">直推人数</div>
              </div>
              <div>
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">{{ userInfo?.team_num
                  || 0
                }}
                </div>
                <div class="text-[#666666] text-[12px] font-pingfang">团队人数</div>
              </div>
            </div>
            <div class="wMin-30%">
              <div class="mb-20">
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">{{ Number(userInfo?.me_performance ||
                  0).toFixed(2)
                }}</div>
                <div class="text-[#666666] text-[12px] font-pingfang">个人业绩</div>
              </div>
              <div>
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">{{ Number(userInfo?.team_performance || 0).toFixed(2) }}
                </div>
                <div class="text-[#666666] text-[12px] font-pingfang">团队业绩</div>
              </div>
            </div>
            <div class="wMin-20%">
              <div class="mb-20">
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">{{
                  Number(userInfo?.min_performance || 0).toFixed(2) }}</div>
                <div class="text-[#666666] text-[12px] font-pingfang">小区业绩</div>
              </div>
              <div>
                <div class="text-[#000] text-[16px] font-roboto font-900 mb-8">{{ Number(userInfo?.total_performance || 0).toFixed(2) }}
                </div>
                <div class="text-[#666666] text-[12px] font-pingfang">累计业绩</div>
              </div>
            </div>
          </div>
        </div>
        <div class="">
          <div class="flex items-center mb-12">
            <div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
            <div class="flex items-center gap-20">
              <div :class="[
                'text-[#000] text-[14px] font-pingfang ml-6',
                activeTab == item.id ? '' : 'opacity-50'
              ]" @click="() => changeTab(item)" v-for="item in tabs" :key="item.id">
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="w-100% h-1 bg-[#000] opacity-10 mb-10"></div>
          <div class="list" v-show="activeTab == 0">
            <van-collapse :border="false" v-model="activeNames" v-for="(item, index) in zhiList" :key="item.id">
              <van-collapse-item :name="index">
                <template #title>
                  <div class="text-[#333] text-[14px] font-pingfang">{{ formatEthereumAddress(item?.address) }}</div>
                </template>
                <template #value>
                  <div class="text-[#333] text-[12px] font-pingfang">{{ dayjs(item?.created_at).format('YYYY-MM-DD HH:mm: ss') }}</div>
                </template>
                <!-- <template #right-icon></template> -->
                <div class="flex w-100% items-center justify-between p-4">
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">直推人数</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ item?.zhi_num || 0 }}</div>
                  </div>
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">团队人数</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ item?.team_num || 0 }}</div>
                  </div>
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">个人业绩</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ Number(item?.me_performance || 0).toFixed(2) }}</div>
                  </div>
                </div>
                <div class="flex w-100% items-center p-4 gap-68">
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">团队业绩</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ Number(item?.team_performance || 0).toFixed(2) }}</div>
                  </div>
                  <div>
                    <div class="text-[#666] text-[12px] font-pingfang">小区业绩</div>
                    <div class="text-[#666] text-[16px] font-roboto font-900">{{ Number(item?.min_performance || 0).toFixed(2) }}</div>
                  </div>
                </div>
              </van-collapse-item>
            </van-collapse>
            <div class="flex items-center justify-center mt-10" v-if="!zhiList.length">
              <van-empty image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80"
                description="暂无记录" />
            </div>
          </div>
          <!-- <div class="list w-100%" v-show="activeTab == 1">
            <div class="w-100% flex items-center justify-between text-[#000000] text-[10px] font-pingfang mb-10">
              <div>类型</div>
              <div class="text-center">奖励</div>
              <div class="w-30% text-right">时间</div>
            </div>
            <div class="flex flex-col gap-14 mb-16">
              <div class="w-100% flex items-center justify-between text-[#000000] text-[10px] font-pingfang mb-10">
                <div>A1</div>
                <div class="text-center">0</div>
                <div class="w-30% text-right">2025-10-10</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
}

.body {
  width: 100%;
  min-height: calc(100vh - var(--van-nav-bar-height) - 28px);

  &_top {
    width: 100%;
    height: 200px;

    &__content {
      padding-top: 123px;
      padding-left: 16px;
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

/* vant 组件样式 */
// 样式穿透
:deep(.van-cell) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

:deep(.van-collapse-item__content) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
