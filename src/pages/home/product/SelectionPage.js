import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    ScrollView
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import SelectionHeaderView from './components/SelectionHeaderView';
import SelectionSectionView from './components/SelectionSectionView';
import SelectionAmountView from './components/SelectionAmountView';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';


export default class SelectionPage extends Component {

    static propTypes = {
        selectionViewConfirm: PropTypes.func.isRequired,
        selectionViewClose: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const { specMap = {}, priceList = [] } = this.props.data;
        let specMapTemp = { ...specMap };
        let priceListTemp = [...priceList];
        //修改specMapTemp每个元素首尾增加'，'
        for (let key in specMapTemp) {
            specMapTemp[key].forEach((item) => {
                if (String(item.id).indexOf(',') === -1) {
                    item.id = `,${item.id},`;
                }
            });
        }
        //修改priceListTemp中的specIds首尾增加','
        priceListTemp.forEach((item) => {
            item.specIds = `,${item.specIds},`;
        });

        //提取规格处理id
        let tittleList = [];
        for (let key in specMapTemp) {
            tittleList.push(key);
        }

        this.state = {
            specMap: specMapTemp,
            priceList: priceListTemp,
            tittleList: tittleList,
            selectList: [],//选择的id数组
            selectStrList: [],//选择的名称值
            selectSpecList: [],//选择规格所对应的库存,
            maxStock: 0,//最大库存
            amount: 1
        };
    }

    componentDidMount() {
        this._indexCanSelectedItems();
    }

    _clickItemAction = (item, indexOfProp) => {
        if (item.isSelected) {
            this.state.selectList[indexOfProp] = undefined;
            this.state.selectStrList[indexOfProp] = undefined;
        } else {
            this.state.selectList[indexOfProp] = item.id;
            this.state.selectStrList[indexOfProp] = item.specValue;
        }
        this._indexCanSelectedItems();
    };

    //获取各个列表数据 刷新页面状态
    _indexCanSelectedItems = () => {
        //afterPrice
        //type
        const { afterPrice, type } = this.props;
        let tempArr = [];
        this.state.tittleList.forEach((item, index) => {
            tempArr[index] = this._indexCanSelectedItem(index);
        });
        const { specMap = {} } = this.state;
        let index = 0, isFirst = true, needUpdate = false;
        //总
        for (let key in specMap) {
            //每行
            specMap[key].forEach((item) => {
                //item 每个
                item.isSelected = this.state.selectList.indexOf(item.id) !== -1;
                item.canSelected = false;
                //tempArr[index] 每行符合的数据
                tempArr[index].forEach((item1) => {
                    //库存中有&&剩余数量不为0
                    if (item1.specIds.indexOf(item.id) !== -1 && item1.stock !== 0) {
                        //如果是退换货多一次判断
                        if (type === 'after' && afterPrice === item.originalPrice) {
                            item.canSelected = true;
                        } else {
                            item.canSelected = true;
                        }
                        //单规格默认选中
                        //可以被选择 && 单规格 && 目前没被选择 && 当前总循环第一次
                        if (item.canSelected && specMap[key].length === 1 && !item.isSelected && isFirst) {
                            isFirst = false;
                            needUpdate = true;
                            this.state.selectList[index] = item.id;
                            this.state.selectStrList[index] = item.specValue;
                        }

                    }
                });
            });
            index++;
        }
        if (needUpdate) {
            this._indexCanSelectedItems();
        } else {
            this._selelctSpe();
            this.forceUpdate();
        }
    };
    //获取总库存
    _selelctSpe = () => {
        this.state.selectSpecList = this._indexCanSelectedItem();
        let stock = 0;
        this.state.selectSpecList.forEach((item) => {
            //总库存库存遍历相加
            stock = stock + item.stock;
        });
        this.state.maxStock = stock;
    };

    //index?获取当前列外符合条件的数据:全部数据
    _indexCanSelectedItem = (index) => {
        let [...tempList] = this.state.selectList;
        if (index !== undefined) {
            tempList[index] = undefined;
        }

        let priceArr = [];
        tempList.forEach((item) => {
            if (StringUtils.isNoEmpty(item)) {
                priceArr.push(item.replace(/,/g, ''));
            }
        });
        //冒泡specId从小到大
        for (let i = 0; i < priceArr.length - 1; i++) {
            for (let j = 0; j < priceArr.length - 1 - i; j++) {
                if (priceArr[j] > priceArr[j + 1]) {
                    let tmp = priceArr[j + 1];
                    priceArr[j + 1] = priceArr[j];
                    priceArr[j] = tmp;
                }
            }
        }
        let priceId = priceArr.join(',');

        let tempArr = [];
        const { priceList = [] } = this.state;
        if (StringUtils.isEmpty(priceId)) {
            tempArr = priceList;
        } else {
            priceId = `,${priceId},`;
            tempArr = priceList.filter((item) => {
                return item.specIds.indexOf(priceId) !== -1;
            });
        }
        return tempArr;
    };

    //购买数量
    _amountClickAction = (amount) => {
        this.state.amount = amount;
    };

    //确认订单
    _selectionViewConfirm = () => {
        const { afterPrice, type } = this.props;

        if (this.state.amount === 0) {
            bridge.$toast('请选择数量');
            return;
        }
        if (this.state.amount > this.state.maxStock) {
            bridge.$toast('超出最大库存~');
            return;
        }
        if (type === 'after' && afterPrice > this.state.maxStock) {
            bridge.$toast('超出最大库存~');
            return;
        }
        let priceArr = [];
        let isAll = true;

        const { specMap = {} } = this.state;

        this.state.selectList.forEach((item) => {
            if (StringUtils.isEmpty(item)) {
                isAll = false;
            } else {
                priceArr.push(item.replace(/,/g, ''));
            }
        });

        if (!isAll || this.state.selectList.length !== Object.keys(specMap).length) {
            bridge.$toast('请选择规格');
            return;
        }

        //冒泡specId从小到大
        for (let i = 0; i < priceArr.length - 1; i++) {
            for (let j = 0; j < priceArr.length - 1 - i; j++) {
                if (priceArr[j] > priceArr[j + 1]) {
                    let tmp = priceArr[j + 1];
                    priceArr[j + 1] = priceArr[j];
                    priceArr[j] = tmp;
                }
            }
        }

        let priceId = priceArr.join(',');
        priceId = `,${priceId},`;
        let itemData = undefined;
        const { priceList = [] } = this.state;
        priceList.forEach((item) => {
            if (item.specIds === priceId) {
                itemData = item;
                return;
            }
        });
        if (!itemData) {
            return;
        }
        this.props.selectionViewConfirm(this.state.amount, itemData.id, itemData.spec, itemData.specImg);
        this.props.selectionViewClose();
    };

    _addSelectionSectionView = () => {
        const { specMap = {} } = this.state;
        let tagList = [];
        let index = 0;
        for (let key in specMap) {
            tagList.push(<SelectionSectionView key={key}
                                               indexOfProp={index}
                                               tittle={key}
                                               listData={specMap[key]}
                                               clickItemAction={this._clickItemAction}/>);
            index++;
        }
        return tagList;
    };

    render() {
        const { product, price } = this.props.data;
        const { afterAmount, type } = this.props;
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
                    <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                </TouchableWithoutFeedback>
                <View style={{ flex: 1 }}>
                    <SelectionHeaderView product={product}
                                         price={price}
                                         selectList={this.state.selectList}
                                         selectStrList={this.state.selectStrList}
                                         selectSpecList={this.state.selectSpecList}/>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <ScrollView>
                            {this._addSelectionSectionView()}
                            <SelectionAmountView style={{ marginTop: 30 }} amountClickAction={this._amountClickAction}
                                                 maxCount={this.state.maxStock} afterAmount={afterAmount} type={type}/>
                        </ScrollView>
                        <TouchableWithoutFeedback onPress={this._selectionViewConfirm}>
                            <View style={{
                                height: 49,
                                backgroundColor: '#D51243',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{ fontSize: 16, color: '#FFFFFF' }}>确认</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: ScreenUtils.width
    }

});

