<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showToast, showConfirmDialog, closeToast } from 'vant'
import api from '@/apis'

const router = useRouter()
const { t } = useI18n()

// 用户余额信息
const userBalance = ref({
    x_s_balance: 0.0, // XJ余额
    x_d_balance: 0.0, // XD余额
    xbj_balance: 0.0, // XBJ余额
    xbd_balance: 0.0  // XBD余额
})

// 兑换表单数据
const exchangeForm = ref({
    fromCurrency: 'XJ', // 源币种
    amount: '', // 兑换数量
    exchangeRate: 1 // 兑换汇率 (1:1)
})

// 可选的源币种
const fromCurrencies = ref([
    { label: 'XJ', value: 'XJ', key: 'x_s_balance', targetCurrency: 'XBJ', targetKey: 'xbj_balance' },
    { label: 'XD', value: 'XD', key: 'x_d_balance', targetCurrency: 'XBD', targetKey: 'xbd_balance' }
])

// 计算可用余额
const availableBalance = computed(() => {
    const currency = fromCurrencies.value.find((c) => c.value === exchangeForm.value.fromCurrency)
    return currency ? userBalance.value[currency.key] : 0
})

// 计算目标币种信息
const targetCurrency = computed(() => {
    const currency = fromCurrencies.value.find((c) => c.value === exchangeForm.value.fromCurrency)
    return currency || { targetCurrency: 'XBJ', targetKey: 'xbj_balance' }
})

// 计算兑换后获得的目标币种数量
const exchangeAmount = computed(() => {
    const amount = parseInt(exchangeForm.value.amount) || 0
    return (amount * exchangeForm.value.exchangeRate).toFixed(2)
})

// 验证兑换金额
const validateAmount = (value) => {
    const numValue = parseInt(value)
    if (isNaN(numValue) || numValue <= 0) {
        return false
    }
    if (numValue > availableBalance.value) {
        return false
    }
    // 检查是否为整数
    if (numValue !== parseFloat(value)) {
        return false
    }
    return true
}

// 处理输入，只允许整数
const handleAmountInput = (event) => {
    let value = event.target.value

    // 移除所有非数字字符（保留负号，但在这个场景下我们不需要负数）
    value = value.replace(/[^\d]/g, '')

    // 移除前导零（除了单独的0）
    if (value.length > 1 && value.startsWith('0')) {
        value = value.replace(/^0+/, '')
    }

    // 如果清空了，保持为空字符串
    if (value === '') {
        exchangeForm.value.amount = ''
        return
    }

    // 更新值
    exchangeForm.value.amount = value
    event.target.value = value
}

// 获取用户余额
const getUserBalance = async () => {
    try {
        const res = await api.home.userInfo()
        if (res) {
            userBalance.value = {
                x_s_balance: parseFloat(res.balance_list.x_s_balance || 0),
                x_d_balance: parseFloat(res.balance_list.x_d_balance || 0),
                xbj_balance: parseFloat(res.balance_list.xbj_balance || 0),
                xbd_balance: parseFloat(res.balance_list.xbd_balance || 0)
            }
        }
    } catch (error) {
        console.error('获取余额失败:', error)
    }
}

// 设置最大金额（取整数部分）
const setMaxAmount = () => {
    const maxAmount = Math.floor(availableBalance.value)
    exchangeForm.value.amount = maxAmount.toString()
}

// 执行兑换
const handleExchange = async () => {
    if (!validateAmount(exchangeForm.value.amount)) {
        showToast('请输入有效的兑换金额')
        return
    }

    try {
        await showConfirmDialog({
            title: '确认兑换',
            message: `确定将 ${exchangeForm.value.amount} ${exchangeForm.value.fromCurrency} 兑换为 ${exchangeAmount.value} ${targetCurrency.value.targetCurrency} 吗？`,
            confirmButtonText: '确认兑换',
            cancelButtonText: '取消'
        })

        // 调用兑换API
        const coinIdMap = {
            'XJ': 2,  // XJ -> XBJ
            'XD': 3   // XD -> XBD
        }
        
        const result = await api.exchange.doExchange({
            coin_id: coinIdMap[exchangeForm.value.fromCurrency],
            exchange_num: parseInt(exchangeForm.value.amount)
        })

        // 检查API返回结果 - axios拦截器已经处理了响应，成功时返回data字段
        // 如果到达这里说明请求成功（code=200），因为失败的请求会在拦截器中被reject
        // 确保关闭加载提示，然后显示成功提示
        closeToast()
        setTimeout(() => {
            showToast('兑换成功')
        }, 100)
        // 重置表单
        exchangeForm.value.amount = ''

        // 刷新余额
        await getUserBalance()
    } catch (error) {
        console.log('兑换失败', error)
        if (error !== 'cancel') {
            showToast(error.message || '兑换失败，请稍后重试')
        }
    }
}

// 返回上一页
const goBack = () => {
    router.back()
}

// 跳转到兑换记录页面
const goToExchangeRecord = () => {
    router.push('/exchangeList')
}

onMounted(() => {
    getUserBalance()
})
</script>

<template>
    <div class="exchange-container">
        <!-- 头部 -->
        <div class="header">
            <div class="flex items-center justify-between p-16">
                <div class="flex items-center" @click="goBack">
                    <div class="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12.5 15L7.5 10L12.5 5" stroke="#666" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <span class="header-title">币币兑换</span>
                </div>
            </div>
        </div>

        <!-- 兑换卡片 -->
        <div class="exchange-card mx-16 mt-20 mb-20">
            <div class="exchange-card-inner">
                <!-- 兑换说明 -->
                <div class="text-center mb-28">
                    <div class="card-title">币币兑换</div>
                    <div class="card-subtitle">
                        支持 XJ 兑换为 XBJ、XD 兑换为 XBD<br />
                        兑换比例：1:1
                    </div>
                </div>

                <!-- 源币种选择 -->
                <div class="mb-24">
                    <div class="section-label">选择兑换币种</div>
                    <div class="flex gap-12">
                        <div v-for="currency in fromCurrencies" :key="currency.value"
                            @click="exchangeForm.fromCurrency = currency.value" :class="[
                                'currency-option',
                                { 'currency-option--active': exchangeForm.fromCurrency === currency.value }
                            ]">
                            <div class="text-center">
                                <div class="currency-name"
                                    :class="{ 'currency-name--active': exchangeForm.fromCurrency === currency.value }">
                                    {{ currency.label }}
                                </div>
                                <div class="currency-balance">余额: {{ userBalance[currency.key].toFixed(2) }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 兑换数量输入 -->
                <div class="mb-14">
                    <div class="flex items-center justify-between mb-14">
                        <div class="section-label">兑换数量</div>
                        <div class="available-balance">
                            可用: {{ availableBalance.toFixed(2) }} {{ exchangeForm.fromCurrency }}
                        </div>
                    </div>
                    <div class="input-container">
                        <input v-model="exchangeForm.amount" type="text" inputmode="numeric" placeholder="请输入兑换数量（整数）"
                            class="amount-input" @input="handleAmountInput" @keydown="(e) => {
                                // 只允许数字、退格、删除、方向键等
                                if (!/[\d]/.test(e.key) &&
                                    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) &&
                                    !(e.ctrlKey || e.metaKey)) {
                                    e.preventDefault()
                                }
                            }" />
                        <div class="input-actions">
                            <button @click="setMaxAmount" class="max-button">
                                MAX
                            </button>
                            <span class="currency-label">{{ exchangeForm.fromCurrency }}</span>
                        </div>
                    </div>
                </div>

                <!-- 兑换箭头 -->
                <div class="flex justify-center">
                    <div class="exchange-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="url(#arrowGradient)" stroke-width="1.8"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <defs>
                                <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:#00C18D;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#00A878;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                <!-- 目标币种显示 -->
                <div class="mb-28">
                    <div class="section-label mb-14">兑换为</div>
                    <div class="target-currency">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="target-currency-name">{{ targetCurrency.targetCurrency }}</div>
                                <div class="target-currency-balance">
                                    余额: {{ userBalance[targetCurrency.targetKey].toFixed(2) }}
                                </div>
                            </div>
                            <div class="exchange-result">
                                {{ exchangeAmount }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 兑换按钮 -->
                <button @click="handleExchange" :disabled="!exchangeForm.amount || !validateAmount(exchangeForm.amount)"
                    :class="['exchange-button', { 'exchange-button--disabled': !exchangeForm.amount || !validateAmount(exchangeForm.amount) }]">
                    {{
                        exchangeForm.amount && validateAmount(exchangeForm.amount)
                            ? '确认兑换'
                            : '请输入有效金额'
                    }}
                </button>

                <!-- 兑换记录按钮 -->
                <button @click="goToExchangeRecord" class="record-button mt-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="mr-8">
                        <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M3 5L8 2L13 5M13 11L8 14L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    查看兑换记录
                </button>
            </div>
        </div>

        <!-- 兑换说明 -->
        <div class="mx-16 mt-24">
            <div class="info-card">
                <div class="info-title">兑换说明</div>
                <div class="info-content">
                    <div class="info-item">• 支持 XJ 兑换为 XBJ、XD 兑换为 XBD</div>
                    <div class="info-item">• 兑换比例固定为 1:1</div>
                    <div class="info-item">• 兑换后无法逆向兑换</div>
                    <div class="info-item">• 兑换立即到账，请谨慎操作</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.exchange-container {
    min-height: 100vh;
    background: linear-gradient(135deg,
            #fef7f0 0%,
            /* 温暖的米色 */
            #f8fffe 25%,
            /* 淡绿色 */
            #f0f9ff 50%,
            /* 淡蓝色 */
            #fefce8 75%,
            /* 淡黄色 */
            #ffffff 100%
            /* 纯白 */
        );
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 50%, rgba(0, 193, 141, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(240, 171, 252, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.02) 0%, transparent 50%);
        pointer-events: none;
    }
}

.header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(240, 240, 240, 0.8);
    position: relative;
    z-index: 10;

    .back-button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: translateY(0);
        }
    }

    .header-title {
        font-size: 18px;
        font-weight: 600;
        color: #374151;
        margin-left: 12px;
        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
        letter-spacing: 0.5px;
    }
}

.exchange-card {
    position: relative;
    z-index: 5;

    .exchange-card-inner {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06),
            0 1px 2px rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 20px;
            background: linear-gradient(135deg,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0.05) 100%);
            pointer-events: none;
        }
    }
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: 0.3px;
}

.card-subtitle {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 500;
}

.section-label {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: 0.2px;
}

.currency-option {
    flex: 1;
    padding: 16px;
    border-radius: 12px;
    border: 2px solid rgba(229, 231, 235, 0.8);
    background: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    &--active {
        border-color: rgba(0, 193, 141, 0.6);
        background: linear-gradient(135deg,
                rgba(0, 193, 141, 0.08) 0%,
                rgba(0, 168, 120, 0.05) 100%);
        box-shadow: 0 4px 16px rgba(0, 193, 141, 0.15);
    }
}

.currency-name {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    transition: color 0.3s ease;

    &--active {
        color: #059669;
    }
}

.currency-balance {
    font-size: 12px;
    color: #6b7280;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 400;
}

.available-balance {
    font-size: 12px;
    color: #6b7280;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 400;
}

.input-container {
    position: relative;

    .amount-input {
        width: 100%;
        padding: 18px 16px;
        padding-right: 120px;
        border: 2px solid rgba(229, 231, 235, 0.8);
        border-radius: 12px;
        font-size: 15px;
        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 500;
        color: #1f2937;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        outline: none;
        transition: all 0.3s ease;

        &::placeholder {
            color: #9ca3af;
            font-weight: 400;
        }

        &:focus {
            border-color: rgba(0, 193, 141, 0.6);
            box-shadow: 0 0 0 3px rgba(0, 193, 141, 0.1);
            background: rgba(255, 255, 255, 1);
        }
    }

    .input-actions {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.max-button {
    background: linear-gradient(135deg, rgba(0, 193, 141, 0.1) 0%, rgba(0, 168, 120, 0.08) 100%);
    color: #059669;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;

    &:hover {
        background: linear-gradient(135deg, rgba(0, 193, 141, 0.15) 0%, rgba(0, 168, 120, 0.12) 100%);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
}

.currency-label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

.exchange-arrow {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(248, 250, 252, 0.8) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
}

.target-currency {
    padding: 18px;
    background: linear-gradient(135deg,
            rgba(248, 250, 252, 0.9) 0%,
            rgba(241, 245, 249, 0.8) 100%);
    border-radius: 12px;
    border: 2px solid rgba(226, 232, 240, 0.8);
    backdrop-filter: blur(10px);
}

.target-currency-name {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

.target-currency-balance {
    font-size: 14px;
    color: #6b7280;
    margin-left: 12px;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 500;
}

.exchange-result {
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
}

.exchange-button {
    width: 100%;
    padding: 18px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.3px;

    background: linear-gradient(135deg, #00C18D 0%, #00A878 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(0, 193, 141, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 193, 141, 0.4);
    }

    &:active {
        transform: translateY(-1px);
    }

    &--disabled {
        background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
        color: #9ca3af;
        cursor: not-allowed;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        &:hover {
            transform: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
    }
}

.record-button {
    width: 100%;
    padding: 14px 18px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    border: 2px solid rgba(0, 193, 141, 0.2);
    background: rgba(0, 193, 141, 0.05);
    color: #059669;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);

    &:hover {
        transform: translateY(-1px);
        border-color: rgba(0, 193, 141, 0.3);
        background: rgba(0, 193, 141, 0.08);
        box-shadow: 0 4px 12px rgba(0, 193, 141, 0.15);
    }

    &:active {
        transform: translateY(0);
    }

    svg {
        transition: transform 0.3s ease;
    }

    &:hover svg {
        transform: translateX(2px);
    }
}

.info-card {
    background: linear-gradient(135deg,
            rgba(248, 250, 252, 0.9) 0%,
            rgba(241, 245, 249, 0.8) 100%);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(226, 232, 240, 0.6);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.info-title {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    letter-spacing: 0.2px;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 400;
    padding-left: 4px;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
}
</style>
