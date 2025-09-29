<script setup>
import { ref, onMounted, computed } from 'vue'
// import Dialog from '@/components/Dialog.vue'
import { useI18n } from 'vue-i18n'
import api from '@/apis'
import { useRouter } from 'vue-router'
import { showNotify, showToast } from 'vant'
const router = useRouter()
const { t } = useI18n()
let show = ref(false)
let userInfo = ref({})
let tokens = ref({
	ju_balance: 0.0,
	usdt_balance: 0.0,
	x_s_balance: 0.0,
	x_d_balance: 0.0,
	xb_balance: 0.0,
	report_balance: 0.0
})
const getUserInfo = async () => {
	const res = await api.home.userInfo()
	userInfo.value = res
	tokens.value = res?.balance_list
}
let invitationCode = ref('')

const validateUid = (value) => {
	let cleaned = value.replace(/[^0-9]/g, '')
	if (cleaned.length > 1 && cleaned.startsWith('0')) {
		cleaned = cleaned.replace(/^0+/, '')
	}
	return cleaned
}

const handleUidInput = (event) => {
	const inputValue = event.target.value
	const validatedValue = validateUid(inputValue)
	event.target.value = validatedValue
	invitationCode.value = validatedValue
}

onMounted(() => {
	getUserInfo()
})

let handleConfirmCode = async () => {
	const numUid = parseInt(invitationCode.value)
	if (isNaN(numUid) || numUid <= 0) {
		showToast('请输入有效的UID')
		return
	}

	try {
		await api.home.updateJuUid({
			ju_uid: invitationCode.value
		})
		showToast('操作成功')
		getUserInfo()
		show.value = false
		invitationCode.value = ''
	} catch (error) {
		show.value = false
		invitationCode.value = ''
	}
}

// const dialogRef = ref(null)
const isWithdraw = ref(false)
// const showPopover = ref(false)
// const actions = ref([
// 	{ text: 'JU' },
// 	{ text: 'JU1' },
// 	{ text: 'JU2' }
// ])
// const title = computed(() => {
// 	return isWithdraw.value ? '提现' : '充值'
// })
const handleWithdrawOrRecharge = (val = true) => {
	if (val) return
	isWithdraw.value = val
	router.push('/transfer')
	// dialogRef.value.open()
}

const toWithdrawal = () => {
	router.push('/withdrawal')
}
let toInvitation = () => {
	router.push('/invitation')
}

let toExchange = () => {
	router.push('/exchange')
}
// const onSelect = () => {

// }

let openView = () => {
	router.push('/list')
}
let openHash = () => {
	router.push('/computing')
}
let openIncomeList = (token) => {
	router.push({ name: 'incomeList', query: { token } })
}
// 复制内容到剪贴板
const copyContent = async (content, type) => {
	try {
		// 复制普通文本
		await navigator.clipboard.writeText(content)
		showNotify({ type: 'success', message: '复制成功' })
		return true
	} catch (err) {
		// 如果不支持Clipboard API，使用备用方法
		if (type === 'html') {
			// HTML内容使用execCommand无法直接复制
			throw new Error('浏览器不支持HTML复制')
		}

		return fallbackCopyText(content)
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
	<van-popup v-model:show="show" position="bottom" round closeable @close="() => { }" safe-area-inset-bottom>
		<div class="pt-[18px] pb-[20px] px-10px">
			<div class="flex">
				<div class="mb-20 text-[14px] font-pingfang font-700" v-if="!!userInfo?.ju_uid">
					UID:{{ userInfo?.ju_uid }}
				</div>
				<div class="mb-20 text-[14px] font-pingfang font-700" v-else>添加UID</div>
				<div class="text-[#ccc] ml-[10px]" v-if="!!userInfo?.ju_uid" @click="copyContent(userInfo?.ju_uid)">
					<svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
						<path
							d="M4.88757 3.625V1.9375C4.88757 1.78832 4.94684 1.64524 5.05233 1.53975C5.15781 1.43426 5.30089 1.375 5.45007 1.375H12.2001C12.3493 1.375 12.4923 1.43426 12.5978 1.53975C12.7033 1.64524 12.7626 1.78832 12.7626 1.9375V9.8125C12.7626 9.96168 12.7033 10.1048 12.5978 10.2102C12.4923 10.3157 12.3493 10.375 12.2001 10.375H10.5126V12.0625C10.5126 12.373 10.2594 12.625 9.94614 12.625H3.20401C3.12983 12.6254 3.0563 12.6112 2.98763 12.5832C2.91896 12.5551 2.85652 12.5137 2.80388 12.4615C2.75125 12.4092 2.70946 12.3471 2.68092 12.2786C2.65238 12.2101 2.63765 12.1367 2.63757 12.0625L2.63926 4.1875C2.63926 3.877 2.89239 3.625 3.20514 3.625H4.88757ZM6.01257 3.625H10.5126V9.25H11.6376V2.5H6.01257V3.625ZM4.88757 6.4375V7.5625H8.26257V6.4375H4.88757ZM4.88757 8.6875V9.8125H8.26257V8.6875H4.88757Z"
							fill="black" />
					</svg>
				</div>
			</div>
			<div class="bg-[#F2F6F6] px-14 py-20 rounded-[8px] mb-20">
				<input type="text" v-model="invitationCode" @input="handleUidInput"
					class="outline-none border-none bg-[#fff]/0 color-[#000]/80 font-pingfang text-[18px]"
					:placeholder="!!userInfo?.ju_uid ? '重新输入可修改UID' : '请输入绑定的UID'" />
			</div>
			<div @click="handleConfirmCode" :class="invitationCode ? 'opacity-100' : 'opacity-50'"
				class="van-haptics-feedback disabled:opacity-50 py-16 text-[16px] font-roboto bg-[#000] text-[#fff] rounded-[2px] flex items-center justify-center">
				确定{{ !!userInfo?.ju_uid ? '修改' : '添加' }}
			</div>
		</div>
	</van-popup>
	<div class="container">
		<div class="body">
			<div class="body_top h-244 mb-20 px-16 pt-[26px] pb-[20px] text-[#fff]">
				<div class="flex items-center justify-between mb-20">
					<div>
						<div class="text-[28px] font-roboto font-700 mb-8">
							{{ Number(tokens?.totalAsset || 0).toFixed(2) }}
						</div>
						<div class="text-[12px] font-pingfang">资产总额（$）</div>
					</div>
					<div class="bg-[#FFFFFF1A] rounded-[88px] py-10 px-16 text-[12px] font-pingfang van-haptics-feedback"
						@click="show = true">
						查看UID
					</div>
				</div>
				<div class="flex items-center justify-between">
					<div class="font-roboto font-500 w-50% flex items-center justify-center rounded-[10px] h-52 bg-[#000000] van-haptics-feedback"
						@click="() => toWithdrawal()">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
							<g clip-path="url(#clip0_3_596)">
								<path
									d="M1.28844 13.4316C0.922585 13.4316 0.608426 13.2964 0.345964 13.026C0.0835016 12.7556 -0.0477295 12.4374 -0.0477295 12.0716V10.2582C-0.0477295 9.89235 0.0835016 9.57819 0.345964 9.31572C0.608426 9.05326 0.922585 8.92203 1.28844 8.92203H18.8018C18.5632 8.98566 18.3326 9.06917 18.1099 9.17256C17.8872 9.27596 17.6883 9.439 17.5134 9.6617C17.0044 10.2343 16.4953 10.8507 15.9863 11.5109C15.4773 12.171 14.9921 12.8112 14.5308 13.4316H1.28844ZM4.27097 7.39498C3.90511 7.39498 3.59095 7.25977 3.32849 6.98936C3.06603 6.71894 2.93479 6.40081 2.93479 6.03495V4.36474C2.93479 3.99888 3.06603 3.68472 3.32849 3.42226C3.59095 3.1598 3.90511 3.02856 4.27097 3.02856H22.4286C22.7944 3.02856 23.1126 3.1598 23.383 3.42226C23.6534 3.68472 23.7886 3.99888 23.7886 4.36474V6.03495C23.7886 6.40081 23.6534 6.71894 23.383 6.98936C23.1126 7.25977 22.7944 7.39498 22.4286 7.39498H4.27097ZM16.3204 17.8696V18.0605C16.3204 18.1559 16.3243 18.311 16.3323 18.5258C16.3402 18.7405 16.3442 19.0547 16.3442 19.4682H1.28844C0.922585 19.4682 0.608426 19.337 0.345964 19.0745C0.0835016 18.8121 -0.0477295 18.49 -0.0477295 18.1082V16.3187C-0.0477295 15.9528 0.0835016 15.6387 0.345964 15.3762C0.608426 15.1138 0.922585 14.9825 1.28844 14.9825H13.3378C13.2901 15.0143 13.2464 15.0581 13.2066 15.1138C13.1668 15.1694 13.1311 15.2132 13.0992 15.245C12.9402 15.4677 12.8447 15.7301 12.8129 16.0324C12.7811 16.3346 12.8129 16.6249 12.9084 16.9033C13.0038 17.1816 13.1589 17.4163 13.3736 17.6071C13.5884 17.798 13.8548 17.8935 14.1729 17.8935H15.2944L16.3204 17.8696ZM23.4307 15.1973L23.7886 15.7938C23.884 15.9528 23.9318 16.0801 23.9318 16.1755C23.9318 16.271 23.8721 16.3386 23.7528 16.3783C23.6335 16.4181 23.4387 16.438 23.1682 16.438H21.8798C21.5298 16.438 21.2674 16.5255 21.0924 16.7005C20.9174 16.8754 20.8299 17.1061 20.8299 17.3924V19.7068C20.8299 19.9773 20.7106 20.2477 20.472 20.5181C20.2334 20.7885 19.9471 20.9237 19.6131 20.9237H18.6825C18.4439 20.9237 18.2332 20.8322 18.0502 20.6493C17.8673 20.4664 17.7758 20.1443 17.7758 19.683C17.7758 19.4762 17.7798 19.345 17.7878 19.2893C17.7957 19.2336 17.7997 19.162 17.7997 19.0745C17.7997 18.9871 17.8037 18.8399 17.8116 18.6331C17.8196 18.4263 17.8236 18.0684 17.8236 17.5594C17.8236 17.1618 17.756 16.8754 17.6207 16.7005C17.4855 16.5255 17.243 16.438 16.893 16.438H15.6046C15.2387 16.438 15.0081 16.3624 14.9126 16.2113C14.8172 16.0602 14.8967 15.8256 15.1512 15.5074C15.3898 15.1893 15.6563 14.8195 15.9505 14.3979C16.2448 13.9764 16.547 13.539 16.8572 13.0856C17.1674 12.6323 17.4696 12.1909 17.7639 11.7614C18.0582 11.3319 18.3405 10.9501 18.6109 10.6161C18.7223 10.4889 18.8654 10.3894 19.0404 10.3179C19.2154 10.2463 19.3983 10.2065 19.5892 10.1986C19.7801 10.1906 19.9551 10.2105 20.1141 10.2582C20.2732 10.3059 20.3925 10.3855 20.472 10.4968C20.6629 10.8308 20.8816 11.2007 21.1282 11.6063C21.3747 12.0119 21.6332 12.4215 21.9036 12.8351C22.1741 13.2487 22.4405 13.6583 22.703 14.0639C22.9654 14.4695 23.208 14.8473 23.4307 15.1973Z"
									fill="white" />
								<path
									d="M23.4308 15.1972L23.7887 15.7937C23.8842 15.9528 23.9319 16.0801 23.9319 16.1755C23.9319 16.2709 23.8722 16.3385 23.7529 16.3783C23.6336 16.4181 23.4388 16.438 23.1684 16.438H21.8799C21.53 16.438 21.2675 16.5254 21.0925 16.7004C20.9175 16.8754 20.8301 17.106 20.8301 17.3924V19.7068C20.8301 19.9772 20.7108 20.2476 20.4722 20.5181C20.2336 20.7885 19.9472 20.9237 19.6132 20.9237H18.6826C18.444 20.9237 18.2333 20.8322 18.0503 20.6493C17.8674 20.4664 17.776 20.1442 17.776 19.6829C17.776 19.4762 17.7799 19.3449 17.7879 19.2893C17.7958 19.2336 17.7998 19.162 17.7998 19.0745C17.7998 18.987 17.8038 18.8399 17.8117 18.6331C17.8197 18.4263 17.8237 18.0684 17.8237 17.5594C17.8237 17.1617 17.7561 16.8754 17.6209 16.7004C17.4857 16.5254 17.2431 16.438 16.8931 16.438H15.6047C15.2388 16.438 15.0082 16.3624 14.9127 16.2113C14.8173 16.0602 14.8968 15.8255 15.1513 15.5074C15.3899 15.1893 15.6564 14.8194 15.9506 14.3979C16.2449 13.9764 16.5472 13.5389 16.8573 13.0856C17.1675 12.6323 17.4697 12.1908 17.764 11.7614C18.0583 11.3319 18.3406 10.9501 18.6111 10.6161C18.7224 10.4888 18.8656 10.3894 19.0405 10.3178C19.2155 10.2462 19.3984 10.2065 19.5893 10.1985C19.7802 10.1906 19.9552 10.2104 20.1143 10.2582C20.2733 10.3059 20.3926 10.3854 20.4722 10.4968C20.663 10.8308 20.8818 11.2006 21.1283 11.6063C21.3749 12.0119 21.6334 12.4215 21.9038 12.8351C22.1742 13.2486 22.4406 13.6582 22.7031 14.0639C22.9655 14.4695 23.2081 14.8473 23.4308 15.1972Z"
									fill="#19A55F" />
							</g>
							<defs>
								<clipPath id="clip0_3_596">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<div class="ml-10">提现</div>
					</div>
					<div class="font-roboto font-500 w-50% flex items-center justify-center rounded-[10px] h-52 bg-[#00C18D] ml-10 van-haptics-feedback"
						@click="() => handleWithdrawOrRecharge(false)">
						<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
							<g clip-path="url(#clip0_3_605)">
								<path
									d="M1.78399 13.7941C1.42357 13.7941 1.11947 13.6702 0.871681 13.4224C0.623894 13.1746 0.5 12.863 0.5 12.4876V10.7981C0.5 10.4527 0.623894 10.1524 0.871681 9.89709C1.11947 9.6418 1.42357 9.51415 1.78399 9.51415H18.2956C18.4158 9.51415 18.5359 9.53667 18.6561 9.58173C18.0554 9.65681 17.4809 9.81074 16.9328 10.0435C16.3847 10.2763 15.8853 10.5766 15.4348 10.9446C14.9843 11.3125 14.5901 11.7405 14.2522 12.2285C13.9143 12.7166 13.6477 13.2385 13.4525 13.7941H1.78399ZM13.1146 15.2358C13.0996 15.3559 13.0921 15.4686 13.0921 15.5737V15.889C13.0921 16.5648 13.1897 17.2031 13.3849 17.8038C13.5802 18.4045 13.8505 18.9601 14.1959 19.4707H1.78399C1.42357 19.4707 1.11947 19.3468 0.871681 19.099C0.623894 18.8512 0.5 18.5471 0.5 18.1867V16.4972C0.5 16.1518 0.623894 15.8553 0.871681 15.6075C1.11947 15.3597 1.42357 15.2358 1.78399 15.2358H13.1146ZM4.57723 8.095C4.23183 8.095 3.93523 7.97111 3.68745 7.72332C3.43966 7.47553 3.31577 7.17143 3.31577 6.81101V5.25671C3.31577 4.89629 3.43966 4.58844 3.68745 4.33314C3.93523 4.07784 4.23183 3.9502 4.57723 3.9502H21.7196C22.065 3.9502 22.3616 4.07784 22.6094 4.33314C22.8572 4.58844 22.9811 4.89629 22.9811 5.25671V6.81101C22.9811 7.17143 22.8572 7.47553 22.6094 7.72332C22.3616 7.97111 22.065 8.095 21.7196 8.095H4.57723ZM19.5346 10.9783C20.2104 10.9783 20.8486 11.1097 21.4493 11.3726C22.05 11.6354 22.5756 11.9883 23.0261 12.4313C23.4766 12.8743 23.8333 13.3962 24.0961 13.9968C24.3589 14.5975 24.4903 15.2358 24.4903 15.9116C24.4903 16.6024 24.3589 17.2481 24.0961 17.8488C23.8333 18.4495 23.4766 18.9751 23.0261 19.4256C22.5756 19.8762 22.05 20.2291 21.4493 20.4844C20.8486 20.7397 20.2104 20.8673 19.5346 20.8673C18.8588 20.8673 18.2206 20.7397 17.6199 20.4844C17.0192 20.2291 16.4935 19.8762 16.043 19.4256C15.5925 18.9751 15.2358 18.4495 14.973 17.8488C14.7102 17.2481 14.5788 16.6024 14.5788 15.9116C14.5788 15.2358 14.7102 14.5975 14.973 13.9968C15.2358 13.3962 15.5925 12.8743 16.043 12.4313C16.4935 11.9883 17.0192 11.6354 17.6199 11.3726C18.2206 11.1097 18.8588 10.9783 19.5346 10.9783ZM22.3278 16.7225C22.478 16.7225 22.6019 16.6437 22.6995 16.486C22.7971 16.3283 22.8459 16.1443 22.8459 15.9341C22.8459 15.7238 22.7971 15.5474 22.6995 15.4047C22.6019 15.2621 22.478 15.1907 22.3278 15.1907H20.2104V13.2084C20.2104 13.0883 20.1465 12.9832 20.0189 12.8931C19.8912 12.803 19.7148 12.7579 19.4895 12.7579C19.2492 12.7579 19.0728 12.803 18.9602 12.8931C18.8475 12.9832 18.7912 13.0883 18.7912 13.2084V15.6863C18.7912 15.7314 18.7875 15.7727 18.7799 15.8102C18.7724 15.8477 18.7687 15.889 18.7687 15.9341C18.7687 16.1443 18.8175 16.3283 18.9151 16.486C19.0127 16.6437 19.1366 16.7225 19.2868 16.7225H22.3278Z"
									fill="white" />
								<path
									d="M19.5346 10.9784C20.2104 10.9784 20.8486 11.1098 21.4493 11.3726C22.05 11.6354 22.5756 11.9883 23.0261 12.4313C23.4766 12.8744 23.8333 13.3962 24.0961 13.9969C24.3589 14.5976 24.4903 15.2359 24.4903 15.9116C24.4903 16.6024 24.3589 17.2482 24.0961 17.8489C23.8333 18.4496 23.4766 18.9752 23.0261 19.4257C22.5756 19.8762 22.05 20.2291 21.4493 20.4844C20.8486 20.7397 20.2104 20.8674 19.5346 20.8674C18.8588 20.8674 18.2205 20.7397 17.6199 20.4844C17.0192 20.2291 16.4935 19.8762 16.043 19.4257C15.5925 18.9752 15.2358 18.4496 14.973 17.8489C14.7102 17.2482 14.5788 16.6024 14.5788 15.9116C14.5788 15.2359 14.7102 14.5976 14.973 13.9969C15.2358 13.3962 15.5925 12.8744 16.043 12.4313C16.4935 11.9883 17.0192 11.6354 17.6199 11.3726C18.2205 11.1098 18.8588 10.9784 19.5346 10.9784ZM22.3278 16.7226C22.478 16.7226 22.6019 16.6437 22.6995 16.4861C22.7971 16.3284 22.8459 16.1444 22.8459 15.9342C22.8459 15.7239 22.7971 15.5475 22.6995 15.4048C22.6019 15.2621 22.478 15.1908 22.3278 15.1908H20.2104V13.2085C20.2104 13.0884 20.1465 12.9832 20.0189 12.8931C19.8912 12.803 19.7148 12.758 19.4895 12.758C19.2492 12.758 19.0728 12.803 18.9602 12.8931C18.8475 12.9832 18.7912 13.0884 18.7912 13.2085V15.6864C18.7912 15.7314 18.7875 15.7727 18.7799 15.8103C18.7724 15.8478 18.7687 15.8891 18.7687 15.9342C18.7687 16.1444 18.8175 16.3284 18.9151 16.4861C19.0127 16.6437 19.1366 16.7226 19.2868 16.7226H22.3278Z"
									fill="white" />
							</g>
							<defs>
								<clipPath id="clip0_3_605">
									<rect width="24" height="24" fill="white" transform="translate(0.5 0.375)" />
								</clipPath>
							</defs>
						</svg>
						<div class="ml-10">转账</div>
					</div>
				</div>
				<!-- 兑换按钮 -->
				<div class="px-8 mt-6 cursor-pointer">
					<div 
						@click="toExchange"
						class="w-100% flex items-center justify-center py-16 rounded-[10px] bg-gradient-to-r from-[#00C18D] to-[#00A878] van-haptics-feedback shadow-md transform transition-all duration-200 active:scale-98"
					>
						<div class="flex items-center">
							<span class="text-white text-[16px] font-pingfang font-600">兑换</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" class="ml-6 opacity-80">
								<path d="M5 3.5L8.5 7L5 10.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div class="body_content px-15">
				<div class="flex items-center justify-between mb-12">
					<div class="w-50% font-roboto py-10 px-16 rounded-[12px] bg-[#F2F6F6]" @click="toInvitation">
						<div class="mb-6">
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"
								fill="none">
								<path
									d="M13 4.49957C13.3283 4.49957 13.6537 4.56435 13.957 4.69C14.2602 4.81562 14.5355 4.99997 14.7676 5.23199C14.9997 5.46417 15.1839 5.74018 15.3096 6.04352C15.4351 6.34667 15.5 6.67146 15.5 6.99957C15.5 7.32785 15.4352 7.6533 15.3096 7.9566C15.1839 8.25995 14.9997 8.53596 14.7676 8.76813C14.5355 9.00016 14.2602 9.18451 13.957 9.31012C13.8093 9.37132 13.6559 9.41695 13.5 9.44879V13.2525L17.1143 9.63824C16.9379 9.43516 16.7936 9.20585 16.6904 8.9566C16.5648 8.6533 16.5 8.32785 16.5 7.99957C16.5 7.67146 16.5649 7.34667 16.6904 7.04352C16.8161 6.74018 17.0003 6.46417 17.2324 6.23199C17.4645 5.99997 17.7398 5.81562 18.043 5.69C18.3463 5.56435 18.6717 5.49957 19 5.49957C19.3283 5.49957 19.6537 5.56435 19.957 5.69C20.2602 5.81562 20.5355 5.99997 20.7676 6.23199C20.9997 6.46417 21.1839 6.74018 21.3096 7.04352C21.4351 7.34667 21.5 7.67146 21.5 7.99957C21.5 8.32785 21.4352 8.6533 21.3096 8.9566C21.1839 9.25995 20.9997 9.53596 20.7676 9.76813C20.5355 10.0002 20.2602 10.1845 19.957 10.3101C19.6537 10.4358 19.3283 10.5005 19 10.5005C18.6717 10.5005 18.3463 10.4358 18.043 10.3101C17.9999 10.2923 17.9589 10.2698 17.917 10.2496L13.5 14.6666V17.4996H12.5V14.4752L8.20996 10.1851C8.12775 10.2306 8.04419 10.274 7.95703 10.3101C7.6537 10.4358 7.32833 10.5005 7 10.5005C6.67167 10.5005 6.3463 10.4358 6.04297 10.3101C5.7398 10.1845 5.46448 10.0002 5.23242 9.76813C5.00027 9.53596 4.81605 9.25995 4.69043 8.9566C4.56484 8.6533 4.49997 8.32785 4.5 7.99957C4.50003 7.67146 4.56491 7.34667 4.69043 7.04352C4.81605 6.74018 5.00027 6.46417 5.23242 6.23199C5.46448 5.99997 5.7398 5.81562 6.04297 5.69C6.3463 5.56435 6.67167 5.49957 7 5.49957C7.32833 5.49957 7.6537 5.56435 7.95703 5.69C8.2602 5.81562 8.53552 5.99997 8.76758 6.23199C8.99973 6.46417 9.18395 6.74018 9.30957 7.04352C9.43509 7.34667 9.49997 7.67146 9.5 7.99957C9.50003 8.32785 9.43516 8.6533 9.30957 8.9566C9.22379 9.16375 9.1087 9.35649 8.97168 9.53278L12.5 13.0611V9.44879C12.3441 9.41695 12.1907 9.37132 12.043 9.31012C11.7398 9.18451 11.4645 9.00016 11.2324 8.76813C11.0003 8.53596 10.8161 8.25995 10.6904 7.9566C10.5648 7.6533 10.5 7.32785 10.5 6.99957C10.5 6.67146 10.5649 6.34667 10.6904 6.04352C10.8161 5.74018 11.0003 5.46417 11.2324 5.23199C11.4645 4.99997 11.7398 4.81562 12.043 4.69C12.3463 4.56435 12.6717 4.49957 13 4.49957Z"
									fill="black" />
								<path
									d="M13 17.5001C13.2967 17.5001 13.5867 17.588 13.8334 17.7529C14.08 17.9177 14.2723 18.1519 14.3858 18.426C14.4994 18.7001 14.5291 19.0017 14.4712 19.2927C14.4133 19.5837 14.2704 19.8509 14.0607 20.0607C13.8509 20.2705 13.5836 20.4134 13.2926 20.4712C13.0017 20.5291 12.7001 20.4994 12.426 20.3859C12.1519 20.2723 11.9176 20.0801 11.7528 19.8334C11.588 19.5867 11.5 19.2967 11.5 19.0001C11.5 18.6022 11.658 18.2207 11.9393 17.9394C12.2206 17.6581 12.6022 17.5001 13 17.5001ZM13 15.5001C12.3078 15.5001 11.6311 15.7053 11.0555 16.0899C10.4799 16.4745 10.0313 17.0211 9.76642 17.6607C9.50152 18.3002 9.4322 19.0039 9.56725 19.6829C9.7023 20.3618 10.0356 20.9855 10.5251 21.4749C11.0146 21.9644 11.6383 22.2978 12.3172 22.4328C12.9961 22.5679 13.6999 22.4985 14.3394 22.2336C14.9789 21.9687 15.5256 21.5201 15.9101 20.9446C16.2947 20.369 16.5 19.6923 16.5 19.0001C16.5 18.5404 16.4095 18.0853 16.2336 17.6607C16.0577 17.236 15.7999 16.8502 15.4749 16.5252C15.1499 16.2002 14.764 15.9424 14.3394 15.7665C13.9148 15.5906 13.4596 15.5001 13 15.5001Z"
									fill="#00C18D" />
							</svg>
						</div>
						<div class="text-[#000000] text-[16px] font-700 mb-6">
							{{ Number(userInfo?.total_performance || 0).toFixed(2) }}
						</div>
						<div class="text-[#808080] text-[10px]">我的业绩</div>
					</div>
					<div class="w-50% font-roboto py-10 px-16 rounded-[12px] bg-[#F2F6F6] ml-10" @click="openHash">
						<div class="mb-6">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
								fill="none">
								<path
									d="M11.03 12.2C6.31 12.2 2.75 10.31 2.75 7.80002C2.75 5.29002 6.31 3.40002 11.03 3.40002C15.75 3.40002 19.31 5.29002 19.31 7.80002C19.31 10.31 15.75 12.2 11.03 12.2ZM11.03 5.41002C7.2 5.41002 4.75 6.83002 4.75 7.81002C4.75 8.79002 7.2 10.21 11.03 10.21C14.86 10.21 17.31 8.79002 17.31 7.81002C17.31 6.83002 14.87 5.41002 11.03 5.41002ZM11.03 17.06C7.32 17.06 4.14 15.84 3.12 14.02C3.00689 13.7907 2.98596 13.5267 3.0615 13.2824C3.13704 13.038 3.30332 12.8319 3.52614 12.7064C3.74897 12.5809 4.0114 12.5456 4.2595 12.6076C4.50759 12.6697 4.72249 12.8244 4.86 13.04C5.41 14.02 7.76 15.06 11.03 15.06C14.21 15.06 16.57 14.05 17.17 13.09C17.46 12.62 18.08 12.48 18.55 12.78C19.02 13.07 19.16 13.69 18.86 14.16C17.75 15.92 14.68 17.06 11.03 17.06ZM11.03 21.91C7.32 21.91 4.14 20.69 3.12 18.87C3.00689 18.6407 2.98596 18.3767 3.0615 18.1324C3.13704 17.888 3.30332 17.6819 3.52614 17.5564C3.74897 17.4309 4.0114 17.3956 4.2595 17.4576C4.50759 17.5197 4.72249 17.6744 4.86 17.89C5.41 18.87 7.76 19.91 11.03 19.91C14.21 19.91 16.57 18.9 17.17 17.94C17.46 17.47 18.08 17.33 18.55 17.63C19.02 17.92 19.16 18.54 18.86 19.01C17.75 20.77 14.68 21.91 11.03 21.91Z"
									fill="black" />
								<path
									d="M11.03 21.91C7.31997 21.91 4.13997 20.69 3.11997 18.87C3.00686 18.6407 2.98593 18.3767 3.06147 18.1323C3.13701 17.888 3.30329 17.6819 3.52611 17.5564C3.74893 17.4309 4.01137 17.3956 4.25946 17.4576C4.50756 17.5197 4.72245 17.6744 4.85997 17.89C5.40997 18.87 7.75997 19.91 11.03 19.91C14.21 19.91 16.57 18.9 17.17 17.94C17.46 17.47 18.08 17.33 18.55 17.63C19.02 17.92 19.16 18.54 18.86 19.01C17.75 20.77 14.68 21.91 11.03 21.91Z"
									fill="#00C18D" />
							</svg>
						</div>
						<div class="text-[#000000] text-[16px] font-700 mb-6">
							{{ userInfo?.user_power?.total_power || '0.00' }}
						</div>
						<div class="text-[#808080] text-[10px]">购买算力</div>
					</div>
				</div>
				<div class="my-14 ranking" @click="openView">
					<div class="flex flex-col px-16 py-16">
						<h6 class="text-[#000] text-[14px] font-pingfang">排行榜</h6>
						<p class="text-[#00C18D] text-[12px] font-pingfang mt-2">全网加权分红奖励</p>
					</div>
				</div>
				<div class="mb-14">
					<div class="flex items-center mb-14">
						<div class="w-4 h-16 bg-[#00C960] rounded-full"></div>
						<div class="text-[#000] text-[14px] font-pingfang ml-6">资产详情</div>
					</div>
				</div>
				<div class="flex items-center flex-col gap-16">
					<div class="flex items-center justify-between py-8 w-100% van-haptics-feedback"
						@click="openIncomeList(5)">
						<div class="flex items-center">
							<!-- <van-image width="36px" height="36px" :src="JU" /> -->
							<div class="">
								<div class="mb-4 text-[#000] text-[16px] font-pingfang">Ju</div>
								<div class="text-[#000] text-[12px] font-pingfang opacity-50">Ju余额</div>
							</div>
						</div>
						<div class="flex items-center">
							<div class="text-[#000] text-[16px] font-roboto font-800">
								{{ Number(tokens?.ju_balance || 0.0).toFixed(2) }}
							</div>
							<div class="ml-3">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17"
									fill="none">
									<g opacity="0.5">
										<path
											d="M11.3077 8.8297C11.3153 8.81449 11.3286 8.80119 11.3343 8.78599C11.4673 8.50852 11.4236 8.16644 11.1879 7.94408L5.81724 2.86414C5.52457 2.58668 5.06275 2.59998 4.78529 2.89265C4.50782 3.18532 4.52112 3.64713 4.81379 3.9246L9.63337 8.48381L4.8328 13.1095C4.54203 13.3889 4.53442 13.8507 4.81379 14.1415C4.95633 14.2897 5.14827 14.3657 5.33832 14.3657C5.52076 14.3657 5.70321 14.2973 5.84384 14.1605L11.1651 9.03115C11.1746 9.02164 11.1784 9.00644 11.1898 8.99694C11.1974 8.98934 11.2051 8.98363 11.2146 8.97603C11.2583 8.93232 11.2792 8.87911 11.3077 8.8297Z"
											fill="#272636" />
									</g>
								</svg>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between py-8 w-100% van-haptics-feedback"
						@click="openIncomeList(4)">
						<div class="flex items-center">
							<!-- <van-image width="36px" height="36px" :src="JU" /> -->
							<div class="">
								<div class="mb-4 text-[#000] text-[16px] font-pingfang">USDT</div>
								<div class="text-[#000] text-[12px] font-pingfang opacity-50">USDT余额</div>
							</div>
						</div>
						<div class="flex items-center">
							<div class="text-[#000] text-[16px] font-roboto font-800">
								{{ Number(tokens?.usdt_balance || '0.00').toFixed(2) }}
							</div>
							<div class="ml-3">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17"
									fill="none">
									<g opacity="0.5">
										<path
											d="M11.3077 8.8297C11.3153 8.81449 11.3286 8.80119 11.3343 8.78599C11.4673 8.50852 11.4236 8.16644 11.1879 7.94408L5.81724 2.86414C5.52457 2.58668 5.06275 2.59998 4.78529 2.89265C4.50782 3.18532 4.52112 3.64713 4.81379 3.9246L9.63337 8.48381L4.8328 13.1095C4.54203 13.3889 4.53442 13.8507 4.81379 14.1415C4.95633 14.2897 5.14827 14.3657 5.33832 14.3657C5.52076 14.3657 5.70321 14.2973 5.84384 14.1605L11.1651 9.03115C11.1746 9.02164 11.1784 9.00644 11.1898 8.99694C11.1974 8.98934 11.2051 8.98363 11.2146 8.97603C11.2583 8.93232 11.2792 8.87911 11.3077 8.8297Z"
											fill="#272636" />
									</g>
								</svg>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between py-8 w-100% van-haptics-feedback"
						@click="openIncomeList(1)">
						<div class="flex items-center">
							<!-- <van-image width="36px" height="36px" :src="JU" /> -->
							<div class="">
								<div class="mb-4 text-[#000] text-[16px] font-pingfang">XUSDT</div>
								<div class="text-[#000] text-[12px] font-pingfang opacity-50">XUSDT余额</div>
							</div>
						</div>
						<div class="flex items-center">
							<div class="text-[#000] text-[16px] font-roboto font-800">
								{{ Number(tokens?.report_balance || '0.00').toFixed(2) }}
							</div>
							<div class="ml-3">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17"
									fill="none">
									<g opacity="0.5">
										<path
											d="M11.3077 8.8297C11.3153 8.81449 11.3286 8.80119 11.3343 8.78599C11.4673 8.50852 11.4236 8.16644 11.1879 7.94408L5.81724 2.86414C5.52457 2.58668 5.06275 2.59998 4.78529 2.89265C4.50782 3.18532 4.52112 3.64713 4.81379 3.9246L9.63337 8.48381L4.8328 13.1095C4.54203 13.3889 4.53442 13.8507 4.81379 14.1415C4.95633 14.2897 5.14827 14.3657 5.33832 14.3657C5.52076 14.3657 5.70321 14.2973 5.84384 14.1605L11.1651 9.03115C11.1746 9.02164 11.1784 9.00644 11.1898 8.99694C11.1974 8.98934 11.2051 8.98363 11.2146 8.97603C11.2583 8.93232 11.2792 8.87911 11.3077 8.8297Z"
											fill="#272636" />
									</g>
								</svg>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between py-8 w-100% van-haptics-feedback"
						@click="openIncomeList(2)">
						<div class="flex items-center">
							<!-- <van-image width="36px" height="36px" :src="JU" /> -->
							<div class="">
								<div class="mb-4 text-[#000] text-[16px] font-pingfang">XJ</div>
								<div class="text-[#000] text-[12px] font-pingfang opacity-50">XJ余额</div>
							</div>
						</div>
						<div class="flex items-center">
							<div class="text-[#000] text-[16px] font-roboto font-800">
								{{ Number(tokens?.x_s_balance || '0.00').toFixed(2) }}
							</div>
							<div class="ml-3">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17"
									fill="none">
									<g opacity="0.5">
										<path
											d="M11.3077 8.8297C11.3153 8.81449 11.3286 8.80119 11.3343 8.78599C11.4673 8.50852 11.4236 8.16644 11.1879 7.94408L5.81724 2.86414C5.52457 2.58668 5.06275 2.59998 4.78529 2.89265C4.50782 3.18532 4.52112 3.64713 4.81379 3.9246L9.63337 8.48381L4.8328 13.1095C4.54203 13.3889 4.53442 13.8507 4.81379 14.1415C4.95633 14.2897 5.14827 14.3657 5.33832 14.3657C5.52076 14.3657 5.70321 14.2973 5.84384 14.1605L11.1651 9.03115C11.1746 9.02164 11.1784 9.00644 11.1898 8.99694C11.1974 8.98934 11.2051 8.98363 11.2146 8.97603C11.2583 8.93232 11.2792 8.87911 11.3077 8.8297Z"
											fill="#272636" />
									</g>
								</svg>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between py-8 w-100% van-haptics-feedback"
						@click="openIncomeList(3)">
						<div class="flex items-center">
							<!-- <van-image width="36px" height="36px" :src="JU" /> -->
							<div class="">
								<div class="mb-4 text-[#000] text-[16px] font-pingfang">XD</div>
								<div class="text-[#000] text-[12px] font-pingfang opacity-50">XD余额</div>
							</div>
						</div>
						<div class="flex items-center">
							<div class="text-[#000] text-[16px] font-roboto font-800">
								{{ Number(tokens?.x_d_balance || '0.00').toFixed(2) }}
							</div>
							<div class="ml-3">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17"
									fill="none">
									<g opacity="0.5">
										<path
											d="M11.3077 8.8297C11.3153 8.81449 11.3286 8.80119 11.3343 8.78599C11.4673 8.50852 11.4236 8.16644 11.1879 7.94408L5.81724 2.86414C5.52457 2.58668 5.06275 2.59998 4.78529 2.89265C4.50782 3.18532 4.52112 3.64713 4.81379 3.9246L9.63337 8.48381L4.8328 13.1095C4.54203 13.3889 4.53442 13.8507 4.81379 14.1415C4.95633 14.2897 5.14827 14.3657 5.33832 14.3657C5.52076 14.3657 5.70321 14.2973 5.84384 14.1605L11.1651 9.03115C11.1746 9.02164 11.1784 9.00644 11.1898 8.99694C11.1974 8.98934 11.2051 8.98363 11.2146 8.97603C11.2583 8.93232 11.2792 8.87911 11.3077 8.8297Z"
											fill="#272636" />
									</g>
								</svg>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between py-8 w-100% van-haptics-feedback"
						@click="openIncomeList(6)">
						<div class="flex items-center">
							<!-- <van-image width="36px" height="36px" :src="JU" /> -->
							<div class="">
								<div class="mb-4 text-[#000] text-[16px] font-pingfang">XB</div>
								<div class="text-[#000] text-[12px] font-pingfang opacity-50">XB余额</div>
							</div>
						</div>
						<div class="flex items-center">
							<div class="text-[#000] text-[16px] font-roboto font-800">
								{{ Number(tokens?.xb_balance || '0.00').toFixed(2) }}
							</div>
							<div class="ml-3">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17"
									fill="none">
									<g opacity="0.5">
										<path
											d="M11.3077 8.8297C11.3153 8.81449 11.3286 8.80119 11.3343 8.78599C11.4673 8.50852 11.4236 8.16644 11.1879 7.94408L5.81724 2.86414C5.52457 2.58668 5.06275 2.59998 4.78529 2.89265C4.50782 3.18532 4.52112 3.64713 4.81379 3.9246L9.63337 8.48381L4.8328 13.1095C4.54203 13.3889 4.53442 13.8507 4.81379 14.1415C4.95633 14.2897 5.14827 14.3657 5.33832 14.3657C5.52076 14.3657 5.70321 14.2973 5.84384 14.1605L11.1651 9.03115C11.1746 9.02164 11.1784 9.00644 11.1898 8.99694C11.1974 8.98934 11.2051 8.98363 11.2146 8.97603C11.2583 8.93232 11.2792 8.87911 11.3077 8.8297Z"
											fill="#272636" />
									</g>
								</svg>
							</div>
						</div>
					</div>
					<!-- <div class="flex items-center justify-between w-100%">
						<div class="flex items-center">
							<van-image width="36px" height="36px" :src="USDT" />
							<div class="ml-10">
								<div class="mb-4 text-[#000] text-[16px] font-pingfang">USDT</div>
								<div class="text-[#000] text-[12px] font-pingfang opacity-50">USDT余额</div>
							</div>
						</div>
						<div class="text-[#000] text-[16px] font-roboto font-800">2000.000</div>
					</div> -->
				</div>
			</div>
		</div>
		<!-- <Dialog ref="dialogRef" :title="title">
			<div class="">
				<div class="py-16 px-12 bg-[#F7F7F9] font-pingfang mb-16 rounded-[12px]">
					<div class="flex items-center text-[#000000]  text-[14px]">
						<div class="opacity-50">从</div>
						<div class="ml-40">A1</div>
					</div>
					<div class="h-1 bg-[#000000] opacity-10 my-10"></div>
					<div class="flex items-center text-[#000000]  text-[14px]">
						<div class="opacity-50">到</div>
						<div class="ml-40">JU账户</div>
					</div>
				</div>
				<div class="mb-22">
					<div class="text-[14px] text-[#000] font-pingfang mb-12">数字货币</div>
					<div class="p-10 rounded-[8px] bg-[#F7F7F9] flex justify-between items-center">
						<div class="text-[14px] text-[#7A7777] font-pingfang">JU</div>
						<div>
							<van-popover v-model:show="showPopover" :actions="actions" @select="onSelect" :offset="[-50, 0]"
								:show-arrow="false">
								<template #reference>
									<svg xmlns="http://www.w3.org/2000/svg" width="11" height="7" viewBox="0 0 11 7" fill="none">
										<path
											d="M1.375 0.892911L5.47213 4.63378L9.62308 0.843765L9.62344 0.844454C9.76395 0.720338 9.95527 0.64397 10.1661 0.64397C10.5979 0.64397 10.948 0.963663 10.948 1.35799C10.948 1.55043 10.8644 1.72509 10.7285 1.8534L10.7289 1.85374L6.03686 6.13779L6.03647 6.13744C5.89442 6.272 5.69511 6.35603 5.47403 6.35603C5.47327 6.35603 5.4729 6.35603 5.47213 6.35603C5.47135 6.35603 5.47097 6.35603 5.47059 6.35603C5.24951 6.35603 5.04981 6.272 4.90775 6.13744L4.90738 6.13779L0.215353 1.85377L0.217268 1.85201C0.0828641 1.7237 -2.30097e-07 1.54976 -2.39278e-07 1.358C-2.58156e-07 0.963674 0.35014 0.64398 0.782006 0.64398C1.01912 0.64399 1.23142 0.740555 1.375 0.892911Z"
											fill="black" />
									</svg>
								</template>
</van-popover>
</div>
</div>
</div>
<div class="mb-22">
	<div class="text-[14px] text-[#000] font-pingfang mb-12">{{ title }}数量</div>
	<div class="p-10 rounded-[8px] bg-[#F7F7F9] flex justify-between items-center">
		<div class="text-[14px] text-[#7A7777] font-pingfang">
			<input type="number" placeholder="请输入整数" class="border-none outline-none bg-[#F7F7F9] w-100%" />
		</div>
		<div class="flex items-center ml-16" v-show="isWithdraw">
			<div class="text-[#7A7777] text-[14px] font-pingfang">JU</div>
			<div class="h-16 w-1 bg-[#000000]/10 mx-6"></div>
			<div class="text-[#00C18D] text-[14px] font-pingfang">MAX</div>
		</div>
		<div class="text-[#7A7777] text-[14px] font-pingfang ml-16" v-show="!isWithdraw">USDT</div>
	</div>
</div>
</div>
</Dialog> -->
	</div>
</template>
<style lang="scss" scoped>
.container {
	width: 100%;
}

.ranking {
	height: 70px;
	flex-shrink: 0;
	background: url('./../../assets/icon/ranking_bg.png') no-repeat;
	background-size: 100%;
}

.body {
	width: 100%;
	min-height: calc(100vh - var(--van-nav-bar-height) - 28px);

	&_top {
		background: linear-gradient(192deg, #191d1c 30.36%, #237d4e 90.99%);

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
	border: 1px solid #d9d9d9;
}
</style>
