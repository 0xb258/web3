<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '@/apis'

const router = useRouter()
const { t } = useI18n()

// 兑换记录列表
const exchangeList = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = ref(10)

// 币种映射
const coinMap = {
    2: { name: 'XJ', color: '#00C18D' },
    3: { name: 'XD', color: '#3B82F6' },
    6: { name: 'XBJ', color: '#186480' },
    7: { name: 'XBD', color: '#F59E0B' },
}

// 获取币种名称
const getCoinName = (coinId) => {
    return coinMap[coinId]?.name || 'Unknown'
}

// 获取币种颜色
const getCoinColor = (coinId) => {
    return coinMap[coinId]?.color || '#6B7280'
}

// 加载兑换记录
const loadExchangeList = async () => {
    if (loading.value || finished.value) return
    
    loading.value = true
    try {
        const res = await api.exchange.list({
            page: page.value,
            page_size: pageSize.value
        })
        
        const items = res?.list || []
        
        if (page.value === 1 && exchangeList.value.length && items.length) {
            exchangeList.value = []
        }
        
        exchangeList.value.push(...items)
        
        if (!items.length || items.length < pageSize.value) {
            finished.value = true
        } else {
            page.value += 1
        }
    } catch (error) {
        console.error('获取兑换记录失败:', error)
    } finally {
        loading.value = false
    }
}

// 重置并重新加载
const resetAndReload = () => {
    exchangeList.value = []
    page.value = 1
    finished.value = false
    loadExchangeList()
}

// 处理滚动加载更多
const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollHeight - scrollTop - clientHeight < 50) {
        loadExchangeList()
    }
}

// 返回上一页
const goBack = () => {
    router.back()
}

// 格式化时间
const formatTime = (timeStr) => {
    if (!timeStr) return '--'
    const date = new Date(timeStr)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    loadExchangeList()
})
</script>

<template>
    <div class="exchange-record-container">
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
                    <span class="header-title">兑换记录</span>
                </div>
            </div>
        </div>

        <!-- 记录列表 -->
        <div class="record-list mx-16 mt-20" @scroll.passive="handleScroll">
            <!-- 记录项 -->
            <div v-for="(item, index) in exchangeList" :key="index" class="record-item mb-16">
                <div class="record-card">
                    <div class="record-header">
                        <div class="flex items-center">
                            <div class="coin-badge" :style="{ backgroundColor: getCoinColor(item.coin_id) + '15', color: getCoinColor(item.coin_id) }">
                                {{ getCoinName(item.coin_id) }}
                            </div>
                            <div class="exchange-arrow-small">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#00C18D" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div class="coin-badge target-coin">
                                {{ getCoinName(item.to_coin_id) }}
                            </div>
                        </div>
                        <div class="record-time">
                            {{ formatTime(item.created_at) }}
                        </div>
                    </div>
                    
                    <div class="record-content">
                        <div class="exchange-info">
                            <div class="exchange-amount">
                                <div class="amount-label">兑换数量</div>
                                <div class="amount-value from-amount">
                                    {{ item.exchange_num }} {{ getCoinName(item.coin_id) }}
                                </div>
                            </div>
                            
                            <div class="exchange-result">
                                <div class="result-label">获得</div>
                                <div class="result-value">
                                    {{ item.exchange_num }} {{ getCoinName(item.to_coin_id) }}
                                </div>
                            </div>
                        </div>
                        
                        <div class="exchange-rate">
                            <div class="rate-info">
                                兑换比例：1:1
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="loading-indicator">
                <div class="loading-spinner"></div>
                <span>加载中...</span>
            </div>

            <!-- 加载完成 -->
            <div v-else-if="finished && exchangeList.length" class="load-finished">
                没有更多记录了
            </div>

            <!-- 空状态 -->
            <div v-if="!exchangeList.length && !loading" class="empty-state">
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="4 4"/>
                        <path d="M32 20V44M20 32H44" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="24" cy="24" r="3" fill="#D1D5DB"/>
                        <circle cx="40" cy="24" r="3" fill="#D1D5DB"/>
                        <circle cx="24" cy="40" r="3" fill="#D1D5DB"/>
                        <circle cx="40" cy="40" r="3" fill="#D1D5DB"/>
                    </svg>
                </div>
                <div class="empty-title">暂无兑换记录</div>
                <div class="empty-subtitle">您还没有进行过兑换操作</div>
                <button @click="goBack" class="back-to-exchange">
                    去兑换
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.exchange-record-container {
    min-height: 100vh;
    background: linear-gradient(135deg,
            #fef7f0 0%,
            #f8fffe 25%,
            #f0f9ff 50%,
            #fefce8 75%,
            #ffffff 100%
        );
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 50%, rgba(0, 193, 141, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(240, 171, 252, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.02) 0%, transparent 50%);
        pointer-events: none;
    }
}

.header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(240, 240, 240, 0.8);
    position: sticky;
    top: 0;
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

.record-list {
    position: relative;
    z-index: 5;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    padding-bottom: 20px;

    /* 隐藏滚动条 */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
}

.record-item {
    .record-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04),
            0 1px 2px rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
    }

    .record-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .coin-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
        letter-spacing: 0.5px;

        &.target-coin {
            background: rgba(0, 193, 141, 0.1);
            color: #059669;
        }
    }

    .exchange-arrow-small {
        margin: 0 12px;
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, rgba(0, 193, 141, 0.08) 0%, rgba(0, 168, 120, 0.05) 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(0, 193, 141, 0.15);
    }

    .record-time {
        font-size: 12px;
        color: #6b7280;
        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 400;
    }

    .record-content {
        .exchange-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        .exchange-amount,
        .exchange-result {
            flex: 1;
        }

        .amount-label,
        .result-label {
            font-size: 12px;
            color: #9ca3af;
            margin-bottom: 6px;
            font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 400;
        }

        .amount-value {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;

            &.from-amount {
                color: #dc2626;
            }
        }

        .result-value {
            font-size: 16px;
            font-weight: 700;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .exchange-rate {
            padding-top: 12px;
            border-top: 1px solid rgba(229, 231, 235, 0.6);

            .rate-info {
                font-size: 12px;
                color: #6b7280;
                font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
                font-weight: 400;
            }
        }
    }
}

.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: #6b7280;
    font-size: 14px;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;

    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(0, 193, 141, 0.2);
        border-top-color: #00C18D;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
}

.load-finished {
    text-align: center;
    padding: 20px;
    color: #9ca3af;
    font-size: 14px;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 400;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;

    .empty-icon {
        margin-bottom: 20px;
        opacity: 0.6;
    }

    .empty-title {
        font-size: 18px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .empty-subtitle {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 24px;
        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 400;
    }

    .back-to-exchange {
        padding: 12px 24px;
        background: linear-gradient(135deg, #00C18D 0%, #00A878 100%);
        color: white;
        border: none;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(0, 193, 141, 0.3);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
