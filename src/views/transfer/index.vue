<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/apis'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { transfer as web3Transfer, ensureReady } from '@/utils/useWeb3'
const { t } = useI18n()

let selectIndex = ref(1)
let show = ref(false)
let totalType = ref({
	1: 'report_balance',
	2: 'x_s_balance',
	3: 'x_d_balance',
	4: 'usdt_balance',
	5: 'ju_balance'
})
const actions = ref([
	{
		text: 'XUSDT',
		value: '1'
	},
	{
		text: 'XJ',
		value: '2'
	}, {
		text: 'XD',
		value: '3'
	}
])
let getTokenName = (id) => {
	return actions.value.find(item => item.value == id)?.text
}
let total_type = () => {
	return totalType.value[currentTokenId.value]
}

const currentTokenId = ref(1)
const onSelect = (val) => {
	selectIndex.value = val.value
	currentTokenId.value = val.value
}



onMounted(async () => {
	await getUserInfo()
	total_type()
	transferList(1)
})
let list = ref([])
let page = ref(1)
let pageSize = ref(10)
let transferList = async (type) => {
	let res = await api.home.transferList({
		page: page.value,
		page_size: pageSize.value,
		transfer_type: type
	})
	list.value = res.list || []

}
let tokens = ref({
	ju_balance: 0.00,
	usdt_balance: 0.00,
	x_s_balance: 0.00,
	x_d_balance: 0.00,
	xb_balance: 0.00,
	report_balance: 0.00,
})
const getUserInfo = async () => {
	const res = await api.home.userInfo()
	tokens.value = res?.balance_list ?? {}
}
let amount = ref('')
let address = ref('')

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

const handleClick = async () => {

	if (!address.value) {
		showToast('请输入转账地址')
		return
	}
	if (!amount.value) {
		showToast('请输入转账金额')
		return
	}

	// 驗證金額是否為有效的正數
	const numAmount = parseFloat(amount.value)
	if (isNaN(numAmount) || numAmount <= 0) {
		showToast('请输入有效的转账金额')
		return
	}
	let index = total_type()
	if (Number(amount.value) > tokens.value[index]) {
		showToast('余额不足')
		return
	}
	try {
		await api.home.transfer({
			num: amount.value,
			to_address: address.value,
			coin_id: currentTokenId.value
		})
		
		// 确保关闭加载提示，然后显示成功提示
		closeToast()
		setTimeout(() => {
			showToast('转账成功')
		}, 100)
		
		amount.value = ''
		
		// 刷新用户余额和转账记录
		await getUserInfo()
		await transferList(activeTab.value)
	} catch (e) {
		showToast(e.message)
	}

}
//0x926cCC746a0e53767f3641C6c80E063325bdB17C
//0.0015JU

const activeTab = ref(1)
const tabs = ref([
	{
		label: '转出记录',
		value: '',
		id: 1
	},
	{
		label: '转入记录',
		value: '',
		id: 2
	}
])
const changeTab = (item) => {
	if (activeTab.value == item.id) return
	activeTab.value = item.id
	page.value = 1
	pageSize.value = 10
	transferList(item.id)
}
</script>
<template>
	<div class="container">
		<div class="body">
			<div class="body_content px-15 mb-16">
				<div class="flex items-center mb-6">
					<div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
					<div class="text-[#000] text-[14px] font-pingfang ml-6">转账币种</div>
				</div>
				<!-- <div
					class="font-700 text-[#000] border-c0 rounded-[8px] px-10 py-12 font-rroboto flex items-center justify-between">
					<input type="number" readonly value="XUSDT" placeholder="XUSDT"
						class="w-100% h-100% outline-none border-none font-pingfang font-400 text-[12px]" />
				</div> -->
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
			<!-- <div class="text-[#000] text-[14px] mb-16">
				<div class="font-pingfang font-400 mb-8">提现币种</div>
				
			</div> -->

			<div class="body_content px-15 mb-16">
				<div class="flex items-center mb-6">
					<div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
					<div class="text-[#000] text-[14px] font-pingfang ml-6">转账地址</div>
				</div>
				<div
					class="font-700 text-[#000] border-c0 rounded-[8px] px-10 py-12 font-rroboto flex items-center justify-between">
					<input type="text" v-model="address" placeholder="请输入转账地址"
						class="w-100% h-100% outline-none border-none font-pingfang font-400 text-[12px]" />
				</div>
			</div>


			<div class="body_content px-15">
				<div class="flex items-center mb-6">
					<div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
					<div class="text-[#000] text-[14px] font-pingfang ml-6">转账数量</div>
				</div>
				<div
					class="font-700 text-[#000] border-c0 rounded-[8px] px-10 py-12 font-rroboto flex items-center justify-between">
					<input type="text" v-model="amount" @input="handleAmountInput" placeholder="请输入转账数量"
						class="w-100% h-100% outline-none border-none font-pingfang font-400 text-[12px]" />
				</div>
				<div class="flex items-center justify-between text-[#7A7777] text-[10px] font-pingfang mt-[10px]">
					<!-- <div>汇率:1JU={{ Number(order?.price).toFixed(2) || '-' }}USDT</div> -->
					<div>当前可用 {{ getTokenName(selectIndex) }}：{{ Number(tokens?.[total_type()] || 0.00).toFixed(3) }}</div>
				</div>
			</div>
			<div class="body_content px-15 mt-[16px]">
				<div
					class=" h-46 rounded-[14px] bg-[#00C18D] text-[#fff] text-[18px] flex items-center justify-center mb-16 van-haptics-feedback"
					@click="handleClick">
					转账</div>
			</div>
			<div class="body_content px-15">
				<!-- <div class="flex items-center mb-6">
					<div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
					<div class="text-[#000] text-[14px] font-pingfang ml-6">转账记录</div>
				</div> -->
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

				<div class="mb-[8px] h-[84px] rounded-[14px] px-14 bg-[#F5F8F8] flex items-center justify-between"
					v-for="(item, index) in list">
					<div class="flex items-center">
						<!-- <div class="img text-[14px] text-[#000] font-roboto flex items-center justify-center">
							<template v-if="index == 0">
								<img src="./../../assets/icon/1.png" alt="">
							</template>
<template v-if="index == 1"></template>
<template v-if="index != 0 && index != 1">{{ index - 0 + 1 }}</template>
</div> -->
						<div class="content ml-10">
							<div class="text-[16px] text-[#000]">{{ item.o_address }}</div>
							<div class="text-[10px] mt-[10px] text-[#8F8F8F]">{{ item.created_at }}</div>
						</div>
					</div>
					<div>{{ Number(item.num).toFixed(2) }} {{ getTokenName(item.coin_id) }}</div>
				</div>
				<div class="flex items-center justify-center mt-20" v-if="!list.length">
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

		&__content {}
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

.img {
	width: 60px;
	height: 38px;

	img {
		width: 100%;
		height: 100%;
	}
}

input {
	width: 100%;

	&::placeholder {
		color: #7A7777;
		font-size: 12px !important;
		font-family: PingFang SC;
		font-weight: 400;
	}
}

.border-D9 {
	border: 1px solid #D9D9D9;
}

.border-c0 {
	border: 0.5px solid #C0C0C0;
}
</style>
