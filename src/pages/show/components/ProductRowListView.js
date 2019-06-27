/**
 * @author xzm
 * @date 2019/5/7
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import EmptyUtils from '../../../utils/EmptyUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import ImageLoad from '@mr/image-placeholder';
import { MRText } from '../../../components/ui';
import res from '../res';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtils;
const { addCarIcon } = res;

@observer
export default class ProductRowListView extends PureComponent {
    constructor(props) {
        super(props);
    }

    renderItem = (data, index, fullWidth) => {
        let width = ScreenUtils.width - px2dp(55);
        if (fullWidth) {
            width = ScreenUtils.width - px2dp(30);
        }
        let showPrice = 0;
        const { singleActivity = {}, groupActivity = {} } = data.promotionResult || {};
        const { endTime: endTimeT, startTime: startTimeT, currentTime =  Date.parse( new Date())} = groupActivity && groupActivity.type ? groupActivity : singleActivity;
        if (currentTime > startTimeT && currentTime < endTimeT + 500) {
            showPrice = data.promotionMinPrice;
        } else {
            showPrice = data.minPrice;
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.pressProduct && this.props.pressProduct(data);
            }}>
                <View key={'product' + index} style={[{ width }, styles.itemWrapper]}>
                    <ImageLoad style={styles.productIcon} source={{ uri: data.imgUrl }}/>
                    <View style={styles.itemInfoWrapper}>
                        <MRText style={styles.nameText}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}>
                            {data.name}
                        </MRText>

                        <View style={styles.priceWrapper}>
                            {showPrice ? <MRText style={styles.curPrice}>
                                ￥{showPrice}
                            </MRText> : null}

                            <MRText style={styles.oriPrice}>
                                ￥{data.originalPrice}
                            </MRText>
                            <View style={{ flex: 1 }}/>
                            <NoMoreClick onPress={() => {
                                this.props.addCart(data);
                            }}>
                                <Image source={addCarIcon} style={styles.carIcon}/>
                            </NoMoreClick>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        if (EmptyUtils.isEmptyArr(this.props.products)) {
            return null;
        }

        if (this.props.products.length === 1) {
            return (<View style={[this.props.style, { marginLeft: DesignRule.margin_page }]}>
                {this.renderItem(this.props.products[0], 0, true)}
            </View>);
        }

        let itemWidth = ScreenUtils.width - px2dp(55);
        let length = this.props.products.length;
        let totalWidth = itemWidth * length + px2dp(10) * (length - 1) + DesignRule.margin_page * 2;

        let snapArr = [];
        for (let i = 0; i < length; i++) {
            if (i === 0) {
                snapArr.push(0);
            }else if (i === length - 1) {
                snapArr.push(totalWidth - ScreenUtils.width);
            }else {
                let width = DesignRule.margin_page+px2dp(10)*(i-1)+itemWidth*i-((ScreenUtils.width-itemWidth)/2)+px2dp(10);
                snapArr.push(width);
            }
        }

        return (
            <View style={this.props.style}>
                <ScrollView showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            snapToOffsets={snapArr}
                >
                    <View style={{ width: DesignRule.margin_page }}/>
                    {this.props.products.map((data, index) => {
                        return this.renderItem(data, index);
                    })}
                </ScrollView>
            </View>
        );


        // return [1].map((data, index) => {
        //     return this.renderItem(data, index);
        // });
    }

}

var styles = StyleSheet.create({
    itemWrapper: {
        height: px2dp(70),
        borderRadius: 5,
        backgroundColor: DesignRule.bgColor,
        flexDirection: 'row',
        marginRight: px2dp(10)
    },
    productIcon: {
        width: px2dp(60),
        height: px2dp(60),
        marginVertical: px2dp(5),
        marginLeft: px2dp(5),
        marginRight: px2dp(10)
    },
    itemInfoWrapper: {
        paddingVertical: px2dp(5),
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: px2dp(5)
    },
    nameText: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_24,
        marginRight: DesignRule.margin_page
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    carIcon: {
        width: px2dp(20),
        height: px2dp(20),
        marginRight: px2dp(10)
    },
    curPrice: {
        color: DesignRule.mainColor,
        fontSize: px2dp(15)
    },
    oriPrice: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(10),
        marginLeft: px2dp(5),
        textDecorationLine: 'line-through'
    }
});

