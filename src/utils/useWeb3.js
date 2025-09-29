import { ethers } from 'ethers'
import config from '@/config'
import { showToast, showLoadingToast, closeToast } from 'vant'

let provider = null
let signer = null

const isWalletInstalled = () => {
	return typeof window !== 'undefined' && !!window.ethereum
}

export const ensureReady = async (isSwitchChain = false) => {
	if (!isWalletInstalled()) {
		showToast('請安裝錢包（如 MetaMask）')
		throw new Error('Wallet not installed')
	}
	// if (window.ethereum.chainId !== config.network.chainId) {
	// 	showNotify({ type: 'warning', message: '請切換到Ju网络' })
	// 	if (!isSwitchChain){
	// 		setTimeout(() => {
	// 			switchChain()
	// 		}, 200)
	// 	}
	// 	throw new Error('Chain not supported')
	// }
	if (!provider) {
		provider = new ethers.BrowserProvider(window.ethereum)
	}
	if (!signer) {
		signer = await provider.getSigner()
	}
	return { provider, signer }
}

// 原生轉帳（使用 MetaMask）
export const transfer = async (amount, address) => {
	await ensureReady()
	const amountWei = ethers.parseUnits(amount.toString(), 18)
	return await signer.sendTransaction({ to: address, value: amountWei, gasLimit: 2000000 })
}

// 提现手续费转账（只需要用户确认发送，不等待上链）
export const transferFeeForWithdraw = async (amount, address) => {
	await ensureReady()
	const amountWei = ethers.parseUnits(amount.toString(), 18)
	// 只发送交易，不等待确认
	const tx = await signer.sendTransaction({ to: address, value: amountWei, gasLimit: 2000000 })
	// 返回交易hash，表示用户已确认发送
	return tx.hash
}

//切换网络
export const switchChain = async () => {
	try {
		window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: config.network.chainId }]
		})
	} catch (error) {
		if (error.code === 4902) {
			window.ethereum.request({
				method: 'wallet_addEthereumChain',
				params: config.network
			})
		}
	}
}



const getMainContract = async () => {
	const { signer } = await ensureReady()
	return new ethers.Contract(config.main.address, config.main.abi, signer)
}

const getCustomContract = async () => {
	const { signer } = await ensureReady()
	return new ethers.Contract(config.custom.address, config.custom.abi, signer)
}

// 调用签名
export const signMessage = async (message) => {
	await ensureReady()
	return await signer.signMessage(message)
}

// 主合约授权额度
export const getMainAllowance = async () => {
	await ensureReady()
	const mainContract = await getMainContract()
	return await mainContract.allowance(signer.address, config.custom.address)
}

// 查询主网代币余额
export const getMainBalance = async (address) => {
	await ensureReady()
	const mainContract = await getMainContract()
	return await mainContract.balanceOf(address)
}

// 支付
export const pay = async (amount, address1, address2, remark) => {
	await ensureReady()
	const amountWei = ethers.parseUnits(amount.toString(), 18)
	//获取当前地址余额
	// const currentBalance = await getMainBalance(signer.address)
	// if (currentBalance < amountWei) {
	// 	showNotify('余额不足')
	// 	return
	// }
	// const allowance = await getMainAllowance()
	// if (allowance < amountWei) {
	// 	showLoadingToast({
	// 		message: '确认授权中...',
	// 		duration: 0
	// 	})
	//   let tx = await approve()
	// 	if(tx.hash){
	// 		showLoadingToast({
	// 			message: '确认授权中...',
	// 			duration: 0
	// 		})
	// 	}
	//   await tx.wait()
	// 	showLoadingToast({
	// 		message: '授权成功...',
	// 		duration: 0
	// 	})
	// }
	try {
		showLoadingToast({
			message: '确认支付中...',
			duration: 0
		})
		const abiKey = 'buyPower'
		// const to = config.custom.address
		const abiCoder = ethers.AbiCoder.defaultAbiCoder()
		const data = abiCoder.encode(['uint256', 'address', 'address', 'string'], [amountWei, address1, address2, remark])
		const customContract = await getCustomContract()
		try {
			const tx = await customContract.recharge(abiKey, data, { gasLimit: 1000000, value: amountWei })
			if (tx.hash) {
				showLoadingToast({
					message: '链上确认中...',
					duration: 0
				})
			}
			await tx.wait()
			closeToast()
			Promise.resolve(tx)
		} catch (error) {
			showToast('支付失败')
			Promise.reject(error)
		}

	} catch (error) {
		showToast('支付失败')
		Promise.reject(error)
	}
}

// 主合约授权
export const approve = async () => {
	await ensureReady()
	const mainContract = await getMainContract()
	return await mainContract.approve(config.custom.address, ethers.MaxUint256)
}

// 监听地址变更
export const onAccountChange = (callback) => {
	if (!isWalletInstalled()) {
		showToast('請安裝錢包（如 MetaMask）')
		return
	}
	window.ethereum.on('accountsChanged', (accounts) => {
		callback(accounts?.[0] || '')
	})
}

// 监听链变更（返回十六进制且不带 0x，沿用既有逻辑）
export const onChainChange = (callback) => {
	if (!isWalletInstalled()) {
		showToast('請安裝錢包（如 MetaMask）')
		return
	}
	window.ethereum.on('chainChanged', (chainId) => {
		const numericChainId = parseInt(chainId)
		callback(numericChainId)
	})
}




export default {
	get provider() { return provider },
	get signer() { return signer },
	onAccountChange,
	onChainChange,
	signMessage,
	getMainAllowance,
	pay,
	approve,
	getMainBalance,
	ensureReady,
}
