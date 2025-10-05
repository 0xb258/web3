<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/apis'
const { t } = useI18n()

let actions = ref({
	1:'数据调整',
	2:'提现',
	3:'提现退回',
	4:'购买算力',
	5:'失效退回',
	6:'内部转账',
	7:'小区业绩排行榜分红',
	8:'每日入金排行榜分红',
	9:'静态产出',
	10:'直推产出',
	11:'层级产出',
	12:'团队产出',
	13:'兑换',
	14:'算力产出',
	15:'XD释放'
})

let list = ref([])
let page = ref(1)
let pageSize = ref(10)
let loading = ref(false)
let finished = ref(false)

const loadMore = async () => {
    if (loading.value || finished.value) return
    loading.value = true
    try {
        const res = await api.home.incomeList({
            type: 15,
            page: page.value,
            page_size: pageSize.value
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
let releaseData = ref({
	total_amount: 0.00,  // 累计释放总额
	has_amount: 0.00,    // 已释放总额
	last_amount: 0.00    // 剩余释放总额
})
let getReleaseData = async () => {
	const res = await api.exchange.releaseXD()
	releaseData.value = res ?? {}
}

onMounted(() => {
    resetAndReload()
    getReleaseData()
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
			<div class="body_top mb-20 px-16 pt-[26px] pb-[24px] text-[#fff]">
				<!-- <div class="text-[14px] font-pingfang mb-16 opacity-90">XD 释放统计</div> -->
				
				<!-- 统计卡片 -->
				<div class="stats-container">
					<!-- 累计释放总额 - 独占一排 -->
					<div class="stat-card stat-card-primary">
						<div class="stat-label-primary">累计释放总额</div>
						<div class="stat-value-primary">{{ Number(releaseData.total_amount || 0).toFixed(2) }}</div>
					</div>
					
					<!-- 已释放和剩余释放 - 一排两个 -->
					<div class="stats-grid">
						<div class="stat-card stat-card-secondary">
							<div class="stat-value">{{ Number(releaseData.has_amount || 0).toFixed(2) }}</div>
							<div class="stat-label">已释放总额</div>
						</div>
						<div class="stat-card stat-card-secondary">
							<div class="stat-value">{{ Number(releaseData.last_amount || 0).toFixed(2) }}</div>
							<div class="stat-label">剩余释放总额</div>
						</div>
					</div>
				</div>
			</div>
            <div class="body_content px-15">
                <div class="scroll-box" @scroll.passive="handleScroll">
                <div class="mb-[10px] h-[64px] rounded-[6px] px-[14px] bg-[#F5F8F8] flex items-center justify-between"
                    v-for="(item, index) in list" :key="item.id || index">
					<div class="flex items-center">
						<div class="content ml-10">
							<div class="text-[16px] text-[#000]">{{ actions[item.type] }}</div>
							<div class="text-[10px] text-[#8F8F8F] mt-[10px]">{{ item.created_at }}</div>
						</div>
					</div>
					<div>{{ Number(item?.total ||0).toFixed(2) }}</div>
				</div>
                <div class="py-12 text-center text-[#999] text-[12px]" v-if="loading">加载中...</div>
                <div class="py-12 text-center text-[#999] text-[12px]" v-else-if="finished && list.length">没有更多数据了</div>
                <div class="flex items-center justify-center mt-20" v-if="!list.length && !loading">
					<van-empty image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80"
						description="暂无数据" />
				</div>
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
		border-radius: 0 0 16px 16px;
	}
}

.stats-container {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
}

.stat-card {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 12px;
	text-align: center;
	border: 1px solid rgba(255, 255, 255, 0.2);
	transition: all 0.3s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}
}

// 主卡片样式 - 累计释放总额
.stat-card-primary {
	padding: 20px 16px;
	background: rgba(255, 255, 255, 0.2);
	
	.stat-label-primary {
		font-family: 'PingFang SC', sans-serif;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 12px;
		letter-spacing: 0.5px;
	}

	.stat-value-primary {
		font-family: 'Roboto', sans-serif;
		font-size: 32px;
		font-weight: 700;
		color: #fff;
		line-height: 1.2;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
}

// 次级卡片样式 - 已释放和剩余释放
.stat-card-secondary {
	padding: 16px 12px;

	.stat-value {
		font-family: 'Roboto', sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #fff;
		margin-bottom: 8px;
		line-height: 1.2;
	}

	.stat-label {
		font-family: 'PingFang SC', sans-serif;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.3;
	}
}


.scroll-box {
  max-height: 76vh;
  overflow-y: auto;
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
	img{
		width: 100%;
		height: 100%;
	}
}

.border-D9 {
	border: 1px solid #D9D9D9;
}
</style>
