import { observable, action, flow } from "mobx"
import PaymentApi from './PaymentApi'
import user from '../../model/user'
import balanceImg from './res/balance.png'
import bankImg from './res/bank.png'
import wechatImg from './res/wechat.png'
import alipayImg from './res/alipay.png'
import Toast from '../../utils/bridge'
import PayUtil from './PayUtil'

export const paymentType = {
    balance: 1, //余额支付
    wechat: 4,  //微信
    alipay: 8,  //支付宝
    bank: 16,    //银行卡支付
    section: 5
}

export class Payment {
    @observable availableBalance = user.availableBalance ? user.availableBalance : 0
    @observable balancePayment = {
        type: paymentType.balance,
        name: '余额支付',
        icon: balanceImg,
        hasBalance: true
    }
    @observable paymentList = [
        {
            type: paymentType.section,
            name: '第三方支付'
        },
        {
            type: paymentType.bank,
            name: '银行卡支付',
            icon: bankImg,
            hasBalance: false,
            isEnable: false
        },
        {
            type: paymentType.wechat,
            name: '微信支付',
            icon: wechatImg,
            hasBalance: false,
            isEnable: true
        },
        {
            type: paymentType.alipay,
            name: '支付宝支付',
            icon: alipayImg,
            hasBalance: false,
            isEnable: true
        }
    ]
    @observable selectedTypes = null
    @observable selectedBalace = false
    @action selectBalancePayment = () => {
        this.selectedBalace = !this.selectedBalace
    }
    @action selectPaymentType = (data) => {
        if (this.selectedTypes && data.type === this.selectedTypes.type) {
            this.selectedTypes = null
        } else {
            this.selectedTypes = data
        }
    }
    //余额支付
    balancePay = flow(function * (params) {
        try {
            Toast.showLoading()
            params.type = paymentType.balance
            params.balance = this.availableBalance - params.amounts
            const res = yield this.perpay(params)
            const outTradeNo = res.data.outTradeNo
            const checkRes = yield this.checkPayStatus({outTradeNo: outTradeNo})
            Toast.hiddenLoading()
            return checkRes
        } catch (error) {
            console.log(error)
        }
    })

    //预支付
    perpay  = flow(function * (params) {
        try {
            const res = yield PaymentApi.prePay(params)
            return res
        } catch (error) {
            console.log(error)
        }
    })

    //检查是否支付成功
    checkPayStatus = flow(function * (params) {
        try {
            const res = yield PaymentApi.continueToPay(params)
            return res
        } catch (error) {
            console.log(error)
        }
    })

    //支付宝支付
    alipay = flow(function * (params) {
        try {
            Toast.showLoading()
            params.type = paymentType.alipay
            params.balance = this.availableBalance
            const preStr = yield this.perpay(params)
            const prePayStr = preStr.data.prePayStr
            const resultStr = yield PayUtil.appAliPay(prePayStr)
            console.log('appAliPay:' + JSON.stringify(resultStr))
            Toast.hiddenLoading()
            return {resultStr, preStr}
        } catch (error) {
            console.log(error)
        }
    })

    //微信支付
    appWXPay = flow(function * (params) {
        try {
            Toast.showLoading()
            params.type = paymentType.wechat
            params.balance = this.availableBalance
            const preStr = yield this.perpay(params)
            const prePay = JSON.parse(preStr.data.prePayStr)
            console.log('prePayStr', prePay)
            const resultStr = yield PayUtil.appWXPay(prePay)
            console.log('wechat:' + JSON.stringify(resultStr))
            if (parseInt(resultStr.sdkCode, 0) !== 0) {
                Toast.$toast(resultStr.msg)
                Toast.hiddenLoading()
                return
            }

            Toast.hiddenLoading()
            return {resultStr, preStr}
        } catch (error) {
            console.log(error)
        }
    })
}
