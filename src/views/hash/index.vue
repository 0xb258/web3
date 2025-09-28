<script setup>
import { ref, onMounted, computed } from 'vue'
import Dialog from '@/components/Dialog.vue'
import { useI18n } from 'vue-i18n'
import USDT from '@/static/icon/mine/USDT.png'
import JU from '@/static/icon/mine/JU.png'
import api from '@/apis'
const { t } = useI18n()

let userInfo = ref({})
let tokens = ref({
	ju_balance: 0.00,
	usdt_balance: 0.00,
	x_s_balance: 0.00,
	x_d_balance: 0.00,
	report_balance: 0.00,
})
const getUserInfo = async () => {
	const res = await api.home.userInfo()
	userInfo.value = res
	tokens.value = res?.balance_list ?? {}
}


let type = ref({
	1: '个人算力',
	2: '直推算力',
	3: '层级算力',
	4: '团队算力'
})

let page = ref(1)
let pageSize = ref(10)
let list = ref([])
let loading = ref(false)
let finished = ref(false)

const loadMore = async () => {
	if (loading.value || finished.value) return
	loading.value = true
	try {
		const res = await api.home.powerLog({
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

onMounted(() => {
	loadMore()
	getUserInfo()
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
		<div class="body">
			<div class="body_top h-160 mb-20 px-16 pt-[26px] pb-[20px] text-[#fff]">
				<div class="flex items-center justify-between mb-20 px-16 text-[#fff]">
					<div class="w-38%">
						<div class="mb-20">
							<div class="text-[#fff] text-[16px] font-roboto font-900 mb-8">{{
								Number(userInfo?.zhi_num || 0).toFixed(2)
							}}</div>
							<div class="text-[#ccc] text-[12px] font-pingfang">直推人数</div>
						</div>
						<div>
							<div class="text-[#fff] text-[16px] font-roboto font-900 mb-8">{{ Number(userInfo?.team_num
								|| 0).toFixed(2)
							}}
							</div>
							<div class="text-[#ccc] text-[12px] font-pingfang">团队人数</div>
						</div>
					</div>
					<div class="w-30%">
						<div class="mb-20">
							<div class="text-[#fff] text-[16px] font-roboto font-900 mb-8">{{ Number(userInfo?.me_performance ||
								0).toFixed(2)
							}}</div>
							<div class="text-[#ccc] text-[12px] font-pingfang">个人业绩</div>
						</div>
						<div>
							<div class="text-[#fff] text-[16px] font-roboto font-900 mb-8">{{ Number(userInfo?.team_performance ||
								0).toFixed(2) }}
							</div>
							<div class="text-[#ccc] text-[12px] font-pingfang">团队业绩</div>
						</div>
					</div>
					<div class="wMin-20%">
						<div class="mb-20">
							<div class="text-[#fff] text-[16px] font-roboto font-900 mb-8">{{
								Number(userInfo?.min_performance || 0).toFixed(2) }}</div>
							<div class="text-[#ccc] text-[12px] font-pingfang">小区业绩</div>
						</div>
						<div>
							<div class="text-[#fff] text-[16px] font-roboto font-900 mb-8">{{ Number(userInfo?.total_performance ||
								0).toFixed(2) }}
							</div>
							<div class="text-[#ccc] text-[12px] font-pingfang">累计业绩</div>
						</div>
					</div>
				</div>
			</div>

			<div class="body_content px-15">
				<div class="scroll-box" @scroll.passive="handleScroll">
					<div class="mb-[14px] h-[84px] rounded-[14px] px-14 bg-[#F5F8F8] flex items-center justify-between"
						v-for="(item, index) in list" :key="item.id || index">
					<div class="flex items-center">
						<div class="content ml-10">
							<div class="text-[16px] text-[#000]">{{ type[item?.power_type || 1] }}</div>
							<div class="text-[10px] text-[#8F8F8F] mt-[10px]">更新：{{ item.created_at || '2025-01-01 12:00:00 ' }}</div>
						</div>
					</div>
					<div>{{ Number(item?.power || 0).toFixed(2) }}</div>
				</div>
					<div class="py-12 text-center text-[#999] text-[12px]" v-if="loading">加载中...</div>
					<div class="py-12 text-center text-[#999] text-[12px]" v-else-if="finished && list.length">没有更多数据了</div>
				</div>
				<div class="flex items-center justify-center mt-20" v-if="list.length == 0">
					<van-empty image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80"
						description="暂无数据" />
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
		background: linear-gradient(192deg, #191D1C 30.36%, #237D4E 90.99%);

		// &__content {}
	}
}

.scroll-box {
  max-height: 70vh;
  overflow-y: auto;
  /* 隱藏滾動條（保留滾動） */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.scroll-box::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
/* 去除底部留白 */
.scroll-box {
  padding-bottom: 0;
}
.scroll-box > div:last-child {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}



.custom-indicator {
	position: absolute;
	left: 25px;
	bottom: 12px;
	padding: 2px 5px;
	font-size: 12px;
	background: rgba(0, 0, 0, 0.1);
}

.img {
	width: 60px;
	height: 38px;

	img {
		width: 100%;
		height: 100%;
	}
}

.border-D9 {
	border: 1px solid #D9D9D9;
}
</style>
