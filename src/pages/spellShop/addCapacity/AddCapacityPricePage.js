import React from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import BasePage from '../../../BasePage';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import PickTicketModal from './components/PickTicketModal';
import res from '../res';
import SpellShopApi from '../api/SpellShopApi';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import StringUtils from '../../../utils/StringUtils';
import RouterMap from '../../../navigation/RouterMap';
import spellStatusModel from '../model/SpellStatusModel';
import user from '../../../model/user';

const ArrowImg = res.shopSetting.xjt_03;
const { isNoEmpty } = StringUtils;

export class AddCapacityPricePage extends BasePage {
    $navigationBarOptions = {
        title: '我的扩容'
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            dataList: [],
            amount: 0,
            selectedItem: {}
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState
        };
    };

    componentDidMount() {
        SpellShopApi.store_expend({ storeCode: spellStatusModel.storeCode }).then((data) => {
            const dataTemp = data.data || {};
            let selectedItem = {};
            if (dataTemp.length > 0) {
                const itemDic = dataTemp[0];
                const { invalid } = itemDic;
                if (!invalid) {
                    //能选  默认第一个选中
                    itemDic.isSelected = true;
                    selectedItem = itemDic;
                }
            }
            this.setState({
                loadingState: PageLoadingState.success,
                dataList: dataTemp || [],
                selectedItem
            });
        }).catch(() => {
            this.setState({
                loadingState: PageLoadingState.fail
            });
        });
    }

    _addBtnAction = () => {
        const { id } = this.state.selectedItem || {};
        const { amount } = this.state;
        if (!id) {
            this.$toastShow('请选择扩容人数');
        } else {
            SpellShopApi.store_save({
                expandId: id,
                tokenCoinCount: amount
            }).then((data) => {

                //假支付
                // const dataTemp = data.data || {};
                // SpellShopApi.user_pay({ orderNo: dataTemp.orderNo, tokenCoin: 1 }).then(() => {
                //     this.$navigate(RouterMap.AddCapacitySuccessPage, { storeData: this.params.storeData });
                // }).catch(() => {
                //     this.$toastShow('支付失败');
                // });

                const { orderNo, price } = data.data || {};
                this.$navigate(RouterMap.PaymentPage, {
                    platformOrderNo: orderNo,
                    amounts: price,
                    orderProductList: [{ productName: '拼店扩容' }],
                    bizType: 1,
                    modeType: 1,
                    oneCoupon: amount
                });
            }).catch((e) => {
                this.$toastShow(e.msg);
            });
        }
    };

    _itemBtnAction = (selectedIndex) => {
        let selectedItem = {};
        let tempArr = [...this.state.dataList];
        tempArr.forEach((item, index) => {
            if (selectedIndex === index) {
                item.isSelected = true;
                selectedItem = item;
            } else {
                item.isSelected = false;
            }
        });
        this.setState({
            selectedItem,
            dataList: tempArr
        });
    };

    _oneMoneyAction = () => {
        const { id } = this.state.selectedItem;
        if (StringUtils.isEmpty(id)) {
            this.$toastShow('请选择扩容人数');
            return;
        }
        this.PickTicketModal.show(this.state.amount,(amount) => {
            let tempArr = [...this.state.dataList];
            this.setState({
                amount,
                dataList: tempArr
            });
        });
    };

    _listHeaderComponent = () => {
        return (
            <View>
                <Text style={styles.headerText}>请选择扩容人数</Text>
            </View>
        );
    };

    _renderItem = ({ item, index }) => {
        const { isSelected, personNum, discountPrice, price, invalid } = item;
        const itemColor = isSelected ? DesignRule.white : DesignRule.textColor_mainTitle;
        const bgStyle = invalid ? { backgroundColor: DesignRule.bgColor_grayHeader } :
            (isSelected ? { backgroundColor: DesignRule.mainColor } :
                    {
                        borderWidth: 1,
                        borderColor: DesignRule.lineColor_inWhiteBg
                    }
            );
        return (
            <View>
                <NoMoreClick style={[styles.itemBtn, bgStyle]} onPress={() => this._itemBtnAction(index)}
                             disabled={invalid}>
                    <Text style={[styles.itemLeftText, { color: itemColor }]}>{`${personNum}人`}</Text>
                    <View style={styles.itemRightView}>
                        {isNoEmpty(discountPrice) ?
                            <Text
                                style={[styles.itemOriginText, { color: itemColor }]}>{`¥${discountPrice}`}</Text> : null}
                        <Text style={[{
                            fontSize: isNoEmpty(discountPrice) ? 12 : 17,
                            color: itemColor
                        }, isNoEmpty(discountPrice) ? { textDecorationLine: 'line-through' } : {}]}>{`¥${price}`}</Text>
                    </View>
                </NoMoreClick>
            </View>
        );
    };

    _keyExtractor = (item, index) => {
        return index + item.id + '';
    };

    _listFooterComponent = () => {
        let { amount } = this.state;
        const { discountPrice, price } = this.state.selectedItem;
        let discountPriceS = StringUtils.isNoEmpty(discountPrice) ? parseFloat(discountPrice || 0) : parseFloat(price || 0);
        amount = parseFloat(amount || 0);
        //券大于钱
        if (amount > discountPriceS) {
            //券设置成钱的正数量
            amount = Math.floor(discountPriceS);
        }
        //钱减去券的数量
        let money = discountPriceS - amount;
        this.state.amount = amount;

        return (
            <View style={styles.footerView}>
                <NoMoreClick style={styles.footerItemView} onPress={this._oneMoneyAction}>
                    <Text style={styles.footerItemLeftText}>1元现金券</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={styles.footerOneMoneyText}>{user.tokenCoin ? (amount ? `-¥${amount}` : '请选择') : '暂无可用'}</Text>
                        <Image source={ArrowImg}/>
                    </View>
                </NoMoreClick>
                <View style={styles.footerItemView}>
                    <Text style={styles.footerItemLeftText}>实际付款</Text>
                    <Text style={styles.footerPayMoneyText}>¥{money}</Text>
                </View>
            </View>
        );
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={this.state.dataList}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          ListHeaderComponent={this._listHeaderComponent}
                          ListFooterComponent={this._listFooterComponent}/>
                <NoMoreClick style={styles.payBtn} onPress={this._addBtnAction}>
                    <Text style={styles.payText}>去支付</Text>
                </NoMoreClick>
                <PickTicketModal ref={(ref) => {
                    this.PickTicketModal = ref;
                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        paddingHorizontal: 15, paddingTop: 15,
        fontSize: 13, color: DesignRule.textColor_instruction
    },
    itemBtn: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginHorizontal: 15, marginTop: 10,
        borderRadius: 5,
        height: 40
    },
    itemLeftText: {
        fontSize: 13, marginLeft: 15
    },
    itemRightView: {
        flexDirection: 'row', marginRight: 15, alignItems: 'center'
    },
    itemOriginText: {
        fontSize: 17, marginRight: 5
    },
    footerView: {
        marginTop: 15,
        backgroundColor: DesignRule.white
    },
    footerItemView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 15,
        height: 40
    },
    footerItemLeftText: {
        color: DesignRule.textColor_mainTitle, fontSize: 13
    },
    footerOneMoneyText: {
        marginRight: 8,
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    footerPayMoneyText: {
        color: DesignRule.textColor_redWarn, fontSize: 17
    },
    payBtn: {
        justifyContent: 'center', alignItems: 'center',
        marginBottom: ScreenUtils.safeBottom + 10, marginHorizontal: 15,
        borderRadius: 20, height: 40, backgroundColor: DesignRule.bgColor_btn
    },
    payText: {
        color: DesignRule.textColor_white, fontSize: 15
    }
});

export default AddCapacityPricePage;
