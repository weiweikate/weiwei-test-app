import React from 'react';
import {
    StyleSheet,
    View, FlatList
} from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import bridge from '../../../utils/bridge';
import GoodsItem from '../components/confirmOrder/GoodsItem';
import { confirmOrderModel } from '../model/ConfirmOrderModel';
import { observer } from 'mobx-react/native';
import BasePage from '../../../BasePage';
import { NavigationActions } from 'react-navigation';
import DesignRule from '../../../constants/DesignRule';
import ConfirmAddressView from '../components/confirmOrder/ConfirmAddressView';
import ConfirmPriceView from '../components/confirmOrder/ConfirmPriceView';
import ConfirmBottomView from '../components/confirmOrder/ConfirmBottomView';
// import { renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import SelectOneTicketModel from '../components/confirmOrder/SelectOneTicketModel';
import SelectTicketModel from '../components/confirmOrder/SelectTicketModel';

@observer
export default class ConfirmOrderPage extends BasePage {
    constructor(props) {
        super(props);
        confirmOrderModel.clearData();
    }

    $navigationBarOptions = {
        title: '确认订单',
        show: true // false则隐藏导航
    };


    //**********************************ViewPart******************************************
    _renderContent = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: ScreenUtils.safeBottom }}>
                <FlatList
                    ref={(e) => this.listView = e}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    data={confirmOrderModel.orderProductList}
                    ListHeaderComponent={() => {
                        return (<ConfirmAddressView selectAddress={() => this.selectAddress()}/>);
                    }}
                    ListFooterComponent={() => {
                        return (<ConfirmPriceView
                            jumpToCouponsPage={(params) => this.jumpToCouponsPage(params)}
                            inputFocus={() => {
                                this.listView.scrollToEnd();
                            }}/>);
                    }}
                    renderItem={this._renderItem}
                />
                <ConfirmBottomView commitOrder={() => this.commitOrder()}/>
                <SelectOneTicketModel ref={(ref)=>{this.oneTicketModel = ref}}/>
                <SelectTicketModel ref={(ref)=>{this.ticketModel = ref}} />
            </View>
        );
    };

    _renderItem = (item) => {
        return (<GoodsItem
            key={item.index}
            uri={item.item.specImg}
            activityCodes={item.item.activityCodes}
            goodsName={item.item.productName}
            salePrice={StringUtils.formatMoneyString(item.item.unitPrice)}
            category={item.item.spec}
            goodsNum={'x' + item.item.quantity}
            onPress={() => {
            }}
        />);
    };

    componentWillUnmount() {
        confirmOrderModel.clearData();
        clearTimeout();
    }

    _render() {
        return (
            <View style={styles.container}>
                {this._renderContent()}
            </View>
        );
    }

    componentDidMount() {
        bridge.showLoading('加载中');
        setTimeout(() => {
            this.loadPageData();
        }, 0);
    }

    loadPageData = (params) => {
        // 获取订单数据
        confirmOrderModel.makeSureProduct(this.params.orderParamVO, params);
    };

    // 地址重新选择
    selectAddress = () => {
        this.$navigate('mine/address/AddressManagerPage', {
            from: 'order',
            currentId: confirmOrderModel.addressId,
            callBack: (json) => {
                let params = {
                    addressId: json.id,
                    tokenCoin: 0,
                    userCouponCode: confirmOrderModel.userCouponCode
                };
                confirmOrderModel.tokenCoinText = '选择使用1元券',
                    confirmOrderModel.tokenCoin = 0;
                // confirmOrderModel.addressId = json.id;
                setTimeout(() => {
                    this.loadPageData(params);
                }, 0);
            }
        });
    };

    // 提交订单
    commitOrder = () => {
        if (!confirmOrderModel.canCommit) {
            bridge.hiddenLoading();
            return;
        }
        confirmOrderModel.canCommit = false;
        confirmOrderModel.submitProduct(this.params.orderParamVO, {

            callback: (data) => {
                console.log('submitProduct', data)

                let replace = NavigationActions.replace({
                    key: this.props.navigation.state.key,
                    routeName: 'payment/PaymentPage',
                    params: {
                        orderNum: data.orderNo,
                        amounts: data.payAmount,
                        pageType: 0,
                        orderProductList: data.orderProductList,
                        outTradeNo: data.orderNo,
                        platformOrderNo: data.platformOrderNo
                    },
                });
                this.props.navigation.dispatch(replace);
            }
        });
    };

    // 选择优惠券
    jumpToCouponsPage = (params) => {
        if (params === 'justOne') {//一元券
            let payAmount = parseInt(confirmOrderModel.payAmount); //要实付钱
            let tokenCoin =  parseInt(confirmOrderModel.tokenCoin);//一元优惠的券
            let orderAmount = payAmount + tokenCoin;
            if (orderAmount < 1){//订单总价格要大于1
                this.$toastShow('订单价格大于1元才可使用一元优惠');
                return;
            }
            //打开一券选择框
            this.oneTicketModel && this.oneTicketModel.open(orderAmount, (data) => {
                //选择完以后回调
                data = parseInt(data);
                if (data >= 0) {
                    let params = {
                        tokenCoin: data,
                        userCouponCode: confirmOrderModel.userCouponCode,
                        addressId: confirmOrderModel.addressId
                    };
                    confirmOrderModel.tokenCoin = data;
                    confirmOrderModel.tokenCoinText = data !== 0 ? '-¥' + data : '选择使用1元券';
                    setTimeout(() => {
                        this.loadPageData(params);
                    }, 0);
                }
            })
        } else {
            track(trackEvent.ViewCoupon,{couponModuleSource:3});
            this.ticketModel && this.ticketModel.open(confirmOrderModel.orderParamVO, (data) => {
                console.log('CouponsPage', data);
                confirmOrderModel.couponData=data;
                if (data && data.id) {
                    let params = {
                        userCouponCode: data.code,
                        tokenCoin: 0,
                        addressId: confirmOrderModel.addressId
                    };
                    confirmOrderModel.userCouponCode = data.code;
                    confirmOrderModel.couponName = data.name;
                    confirmOrderModel.tokenCoin = 0;
                    confirmOrderModel.tokenCoinText = '选择使用1元券';
                    setTimeout(() => {
                        this.loadPageData(params);
                    }, 0);
                } else if (data === 'giveUp') {
                    confirmOrderModel.giveUpCou= true;
                    confirmOrderModel.userCouponCode = null;
                    confirmOrderModel.couponName = null;
                    // confirmOrderModel.tokenCoin = 0;
                    // confirmOrderModel.tokenCoinText = '选择使用1元券';
                    setTimeout(() => {
                        this.loadPageData({
                            userCouponCode: null,
                            tokenCoin: confirmOrderModel.tokenCoin ,
                            addressId: confirmOrderModel.addressId
                        });
                    }, 0);
                }
            });
            return;
            // this.$navigate('mine/coupons/CouponsPage', {
            //     fromOrder: 1,
            //     orderParam: confirmOrderModel.orderParamVO, callBack:
            // });
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    }
});
