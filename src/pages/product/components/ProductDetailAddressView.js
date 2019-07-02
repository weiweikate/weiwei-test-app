import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText, NoMoreClick } from '../../../components/ui';
import res from '../res/product';
import DesignRule from '../../../constants/DesignRule';
import { observable, computed, autorun } from 'mobx';
import { observer } from 'mobx-react';
import RouterMap, { routePush } from '../../../navigation/RouterMap';
import MineAPI from '../../mine/api/MineApi';
import ProductApi from '../api/ProductApi';

const { arrow_right_black } = res.button;
const { pAddress } = res;

@observer
export class ProductDetailSetAddressView extends React.Component {
    render() {
        const { productDetailAddressModel } = this.props;
        const { showAreaText } = productDetailAddressModel;
        return (
            <NoMoreClick style={pStyles.containerView} onPress={() => {
                routePush(RouterMap.ProductAddressListPage, { productDetailAddressModel });
            }}>
                <MRText style={pStyles.nameText}>选择</MRText>
                <MRText style={pStyles.valueText}>配送至: {showAreaText}</MRText>
                <Image source={arrow_right_black}/>
            </NoMoreClick>
        );
    }
}

const pStyles = StyleSheet.create({
    containerView: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
        backgroundColor: 'white', height: 44
    },
    nameText: {
        paddingRight: 10,
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    valueText: {
        flex: 1,
        color: DesignRule.textColor_mainTitle, fontSize: 13
    }
});

@observer
export class ProductDetailSkuAddressView extends React.Component {
    render() {
        const { productDetailAddressModel } = this.props;
        const { showAreaText } = productDetailAddressModel;
        return (
            <View style={sStyles.containerView}>
                <View style={sStyles.lineView}/>
                <View style={sStyles.contentView}>
                    <View style={sStyles.content1View}>
                        <MRText style={{ color: DesignRule.textColor_mainTitle, fontSize: 14 }}>配送区域 <MRText style={{
                            color: DesignRule.textColor_instruction,
                            fontSize: 10
                        }}>(配送地可能会影响库存，请正确选择)</MRText></MRText>
                        <View style={sStyles.addressView}>
                            <Image source={pAddress} style={sStyles.addressImg}/>
                            <MRText style={{
                                color: DesignRule.textColor_instruction,
                                fontSize: 12,
                                flex: 1
                            }}>{showAreaText}</MRText>
                        </View>
                    </View>
                    <Image source={arrow_right_black}/>
                </View>
                <View style={sStyles.lineView}/>
            </View>
        );
    }
}

const sStyles = StyleSheet.create({
    containerView: {
        marginHorizontal: 15
    },
    lineView: {
        backgroundColor: DesignRule.lineColor_inWhiteBg, height: 0.5
    },
    contentView: {
        flexDirection: 'row', alignItems: 'center', marginVertical: 9
    },
    content1View: {
        flex: 1
    },
    addressView: {
        marginTop: 10,
        flexDirection: 'row', alignItems: 'center'
    },
    addressImg: {
        marginRight: 8,
        width: 11, height: 14
    }
});

export class ProductDetailAddressModel {

    @observable prodCode = null;
    /*个人地址列表*/
    @observable addressList = [];
    /*手动选择的区域*/
    @observable addressSelectedText = null;
    @observable addressSelectedCode = null;

    /*区域库存(地区变化就需要更新)*/
    @observable areaSkuList = [];

    @computed get showAreaText() {
        if (this.addressSelectedText) {
            return this.addressSelectedText;
        }
        for (const item of this.addressList) {
            if (item.defaultStatus === 1) {
                return item.province + item.city + item.area;
            }
        }
        return '杭州市萧山区';
    }

    @computed get getAreaCode() {
        if (this.addressSelectedCode) {
            return this.addressSelectedCode;
        }
        for (const item of this.addressList) {
            if (item.defaultStatus === 1) {
                return item.areaCode;
            }
        }
        return '330109';
    }

    /*地址变化自动更新库存*/
    requestSkuByAreaCode = autorun(() => {
        const { prodCode, getAreaCode } = this;
        if (!this.prodCode) {
            return;
        }
        ProductApi.getProductSkuStockByAreaCode({
            prodCode: prodCode,
            areaCode: getAreaCode
        }).then((data) => {
            this.areaSkuList = data.data || [];
        });
    });

    /*获取收货地址*/
    requestAddress = () => {
        MineAPI.queryAddrList().then((data) => {
            this.addressList = data.data || [];
        });
    };
}
