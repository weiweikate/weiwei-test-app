import React, { Component } from "react";
import {
    StyleSheet,
    View,
    NativeModules,
    TouchableOpacity
} from "react-native";
import {
    UIText, MRText as Text, NoMoreClick, UIImage
} from "../../../../components/ui";
import StringUtils from "../../../../utils/StringUtils";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DateUtils from "../../../../utils/DateUtils";
import DesignRule from "../../../../constants/DesignRule";
import { orderDetailModel } from "../../model/OrderDetailModel";
import { observer } from "mobx-react/native";
import {QYChatTool, beginChatType} from '../../../../utils/QYModule/QYChatTool'

const { px2dp } = ScreenUtils;
import res from '../../res'
import orderApi from '../../api/orderApi';
import bridge from '../../../../utils/bridge';
const kefu_icon = res.button.kefu_icon;

@observer
export default class OrderDetailTimeView extends Component {

    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: px2dp(10), backgroundColor: DesignRule.bgColor }}/>
        );
    };

    copyOrderNumToClipboard = () => {
        StringUtils.clipboardSetString(orderDetailModel.getOrderNo());
        NativeModules.commModule.toast("订单号已经复制到剪切板");
    };

    concactKeFu(){
        let supplierCode = '';
        let desc = ''
        let pictureUrlString = '';
        let num = ''
        if (orderDetailModel.warehouseOrderDTOList && orderDetailModel.warehouseOrderDTOList[0]){
            let item = orderDetailModel.warehouseOrderDTOList[0];
            supplierCode = item.supplierCode	|| '';
            if (item.products && item.products[0]){
                let product = item.products[0];
                desc = product.productName || '';
                pictureUrlString = product.specImg || '';
                num = '共'+product.quantity +'件商品';
            }
        }
        if (this.data){
            QYChatTool.beginQYChat({
                routePath: '',
                urlString: '',
                title:this.data.title,
                shopId:this.data.shopId,
                chatType: beginChatType.BEGIN_FROM_ORDER,
                data: {
                    title: '订单号:'+orderDetailModel.getOrderNo(),
                    desc,
                    pictureUrlString,
                    urlString:'/'+orderDetailModel.getOrderNo(),
                    note: num,
                }}
            )
        } else {
            orderApi.getProductShopInfoBySupplierCode({supplierCode}).then((data)=> {
                this.data = data.data;
                QYChatTool.beginQYChat({
                    routePath: '',
                    urlString: '',
                    title: this.data.title,
                    shopId: this.data.shopId,
                    chatType: beginChatType.BEGIN_FROM_ORDER,
                    data: {
                        title: orderDetailModel.getOrderNo(),
                        desc,
                        pictureUrlString,
                        urlString:'/'+orderDetailModel.getOrderNo(),
                        note: num,
                    }}
                )
            }).catch((e) => {
                bridge.$toast(e.msg)
            })
        }

    }

    render() {
        let message = '';
        if (orderDetailModel.warehouseOrderDTOList && orderDetailModel.warehouseOrderDTOList[0]) {
            let item = orderDetailModel.warehouseOrderDTOList[0];
            message = item.message || '';
        }
        return (
            <View style={{ backgroundColor: "white", paddingTop: px2dp(10), marginTop: px2dp(10) }}>
                {message.length > 0? <View style={{  flexDirection: "row"}}>
                    <UIText value={"订单备注："}
                            style={[styles.textGoodsDownStyle]}/>
                    <View style={{flex: 1, marginRight: 10}}>
                        <UIText value={message}
                                style={[styles.textGoodsDownStyle,{marginLeft: 0}]}/>
                    </View>
                </View>: null}
                <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                    <UIText value={"订单编号：" + `${orderDetailModel.getOrderNo()}`}
                            style={[styles.textGoodsDownStyle]}/>
                    <NoMoreClick style={styles.clipStyle} onPress={() => this.copyOrderNumToClipboard()}>
                        <Text style={{ paddingLeft: px2dp(10), paddingRight: px2dp(10) }}
                              allowFontScaling={false}>复制</Text>
                    </NoMoreClick>
                </View>
                <UIText
                    value={"创建时间：" + DateUtils.getFormatDate(orderDetailModel.warehouseOrderDTOList[0].createTime / 1000)}
                    style={styles.textGoodsDownStyle}/>
                {StringUtils.isNoEmpty(orderDetailModel.warehouseOrderDTOList[0].payTime) && orderDetailModel.status > 1 ?
                    <UIText
                        value={"付款时间：" + DateUtils.getFormatDate(orderDetailModel.warehouseOrderDTOList[0].payTime / 1000)}
                        style={styles.textGoodsDownStyle}/> : null}
                {orderDetailModel.status === 5 ?
                    <UIText
                        value={"关闭时间：" + DateUtils.getFormatDate(orderDetailModel.warehouseOrderDTOList[0].subStatus < 4 ? orderDetailModel.warehouseOrderDTOList[0].cancelTime / 1000 : orderDetailModel.warehouseOrderDTOList[0].finishTime / 1000)}
                        style={styles.textGoodsDownStyle}/> : null}
                {/*{StringUtils.isNoEmpty(orderDetailModel.warehouseOrderDTOList[0].outTradeNo)&&orderDetailModel.status<5  ?*/}
                {/*<UIText value={'交易订单号：' + orderDetailModel.warehouseOrderDTOList[0].outTradeNo}*/}
                {/*style={styles.textOrderDownStyle}/> : null}*/}
                {StringUtils.isNoEmpty(orderDetailModel.warehouseOrderDTOList[0].deliverTime) && orderDetailModel.status < 5 ?
                    <UIText
                        value={"发货时间：" + DateUtils.getFormatDate(orderDetailModel.warehouseOrderDTOList[0].deliverTime / 1000)}
                        style={styles.textOrderDownStyle}/> : null}
                {StringUtils.isNoEmpty(orderDetailModel.warehouseOrderDTOList[0].finishTime) && orderDetailModel.status < 5 ?
                    <UIText
                        value={"完成时间：" + DateUtils.getFormatDate(orderDetailModel.warehouseOrderDTOList[0].autoReceiveTime ? orderDetailModel.warehouseOrderDTOList[0].autoReceiveTime / 1000 : orderDetailModel.warehouseOrderDTOList[0].finishTime / 1000)}
                        style={styles.textOrderDownStyle}/> : null}
                <TouchableOpacity style={styles.kefuContainer}
                                  onPress={()=>{this.concactKeFu()}}
                >
                    <UIImage source={kefu_icon} style={styles.kefuIcon}/>
                    <Text style={styles.kefuText}>联系客服</Text>
                </TouchableOpacity>
                {this.renderWideLine()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textOrderDownStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(16),
        marginBottom: px2dp(10)
    },
    textGoodsDownStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(16),
        marginBottom: px2dp(10)
    },
    clipStyle: {
        borderWidth: 1,
        borderColor: DesignRule.color_ddd,
        marginRight: px2dp(10),
        justifyContent: "center",
        alignItems: "center",
        height: px2dp(22),
        width: px2dp(55),
        // marginTop: px2dp(10),
        borderRadius: px2dp(2)
    },
    couponsIconStyle: {
        width: px2dp(15),
        height: px2dp(12),
        position: "absolute",
        left: px2dp(15),
        top: px2dp(12)
    },
    couponsOuterStyle: {
        height: px2dp(34),
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: px2dp(36)
    },
    couponsTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        alignSelf: "center"
    },
    couponsLineStyle: {
        marginLeft: px2dp(36),
        backgroundColor: DesignRule.bgColor,
        height: 0.5,
        width: "100%"
    },
    kefuContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderTopColor: DesignRule.bgColor,
        borderTopWidth: 1
    },
    kefuIcon: {
        height: 20,
        width: 20,
        marginRight: 5
    },
    kefuText: {
        fontSize: 13,
        color: DesignRule.textColor_instruction
    }
});
