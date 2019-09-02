/**
 * 超值热卖
 */

import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ScreenUtil from '../../../utils/ScreenUtils';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { observer } from 'mobx-react';
import { homeModule } from '../model/Modules';
import { homeLinkType, homePoint, homeRoute } from '../HomeTypes';
import { subjectModule } from '../model/HomeSubjectModel';
import DesignRule from '../../../constants/DesignRule';
import { getShowPrice, getTopicJumpPageParam } from '../../topic/model/TopicMudelTool';
import ImageLoad from '@mr/image-placeholder';
import EmptyUtils from '../../../utils/EmptyUtils';
import { MRText as Text } from '../../../components/ui/index';
import res from '../res/index';

const { px2dp, onePixel } = ScreenUtil;

const MoneyItems = ({ money }) => {
    if (EmptyUtils.isEmpty(money)) {
        return null;
    }
    let unitStr = '￥';
    let moneyStr = '';
    let index = money.indexOf('￥');
    if (index !== -1) {
        moneyStr = money.substring(index + 1, money.length);
    }
    return <Text style={styles.unit}>{unitStr}<Text style={styles.money}>{moneyStr}</Text> 起</Text>;
};

const GoodItems = ({ img, title, money, press }) => {
    return <TouchableWithoutFeedback onPress={() => {
        press && press();
    }}>
        <View style={styles.goodsView}>
            <ImageLoad style={styles.goodImg} source={{ uri: img ? encodeURI(img) : '' }}/>
            <Text style={styles.goodsTitle} numberOfLines={2} allowFontScaling={false}>{title}</Text>
            <View style={{ flex: 1 }}/>
            <MoneyItems money={money}/>
        </View>
    </TouchableWithoutFeedback>;
};

const MoreItem = ({ press }) => <TouchableOpacity style={styles.moreView} onPress={() => {
    press && press();
}}>
    <Image source={res.home_right} style={{ width: 18, height: 18 }}/>
    <View style={{ height: px2dp(10) }}/>
    <Text style={styles.seeMore} allowFontScaling={false}>查看更多</Text>
</TouchableOpacity>;

const ActivityItem = ({ data, press, goodsPress }) => {
    const { image, topicBannerProductDTOList } = data;
    let goodsItem = [];
    topicBannerProductDTOList && topicBannerProductDTOList.map((value, index) => {
        if (index >= 8) {
            return;
        }
        let price = getShowPrice(value);
        goodsItem.push(
            <GoodItems
                key={index}
                title={value.productName}
                money={price}
                img={value.specImg ? value.specImg : ''}
                press={() => {
                    goodsPress && goodsPress(value);
                }}
            />
        );
    });
    return <View style={{
        backgroundColor: 'white', marginHorizontal: px2dp(15),
        borderBottomRightRadius: px2dp(5),
        borderBottomLeftRadius: px2dp(5)
    }}>
        <TouchableWithoutFeedback onPress={() => {
            press && press();
        }}>
            <View style={styles.bannerView}>
                <ImageLoad style={styles.banner}
                           source={{ uri: image ? encodeURI(image) : '' }}/>
            </View>
        </TouchableWithoutFeedback>
        {
            topicBannerProductDTOList && topicBannerProductDTOList.length > 0
                ?
                <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{ width: px2dp(7.5) }}/>
                    {goodsItem}
                    {
                        topicBannerProductDTOList.length >= 8 ?
                            <MoreItem press={() => {
                                press && press();
                            }}/>
                            : null
                    }
                    <View style={{ width: topicBannerProductDTOList.length < 8 ? px2dp(7.5) : px2dp(5) }}/>
                </ScrollView>
                :
                <View style={{ height: px2dp(15) }}/>
        }
    </View>;
};

@observer
export default class HomeSubjectView extends Component {
    _subjectActions(item, index) {
        track(trackEvent.bannerClick, homeModule.bannerPoint(item, homePoint.homeSubject, index));
        const { navigate } = this.props;
        let params = homeModule.paramsNavigate(item);
        const router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
        navigate(router, params);
    }

    _goodAction(good, item, index) {
        const { navigate } = this.props;
        if (item.linkType === homeLinkType.exp) {
            if (good.endTime >= good.currTime) {
                const router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
                navigate(router, { activityCode: item.linkTypeCode, productCode: good.prodCode });
            } else {
                const router = homeRoute[homeLinkType.good];
                navigate(router, { productCode: good.prodCode });
            }
        } else {
            const pageObj = getTopicJumpPageParam(good);
            navigate(pageObj.pageRoute, { ...pageObj.params });
        }
        // 首页超值热卖商品点击
        track(trackEvent.homeTopicProdClick, {
            'specialTopicId': item.linkTypeCode,
            'productIndex': index,
            'spuCode': good.prodCode,
            'spuName': good.productName
        });
    }

    render() {
        const { subjectList } = subjectModule;
        if (!subjectList) {
            return null;
        }
        if (subjectList.length <= 0) {
            return null;
        }
        let item = this.props.data && this.props.data.itemData;
        if (!item) {
            return null;
        }

        return (<ActivityItem data={item} key={item.id}
                              press={() => this._subjectActions(item, item.itemIndex)}
                              goodsPress={(good) => {
                                  this._goodAction(good, item, item.itemIndex);
                              }}/>);
    }
}

const bannerWidth = ScreenUtil.width - px2dp(50);
const bannerHeight = bannerWidth * (240 / 650);

let styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: px2dp(15),
        width: ScreenUtil.width - px2dp(30),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: 5
    },
    bannerView: {
        marginLeft: px2dp(10),
        marginRight: px2dp(10),
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    banner: {
        width: bannerWidth,
        height: bannerHeight
    },
    scroll: {
        height: px2dp(170),
        marginTop: px2dp(5),
        marginBottom: px2dp(10)
    },
    goodsView: {
        marginTop: px2dp(5),
        width: px2dp(100),
        height: px2dp(170),
        marginHorizontal: px2dp(2.5)
    },
    goodImg: {
        width: px2dp(100),
        height: px2dp(100)
    },
    goodsTitle: {
        marginHorizontal: px2dp(2.5),
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(12),
        marginTop: px2dp(5)
    },
    money: {
        fontSize: px2dp(16),
        fontWeight: '500'
    },
    unit: {
        marginHorizontal: px2dp(2.5),
        color: DesignRule.mainColor,
        fontSize: px2dp(12),
        marginBottom: px2dp(2)
    },
    moreView: {
        width: px2dp(100),
        height: px2dp(170),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: px2dp(5),
        backgroundColor: DesignRule.bgColor,
        borderRadius: (5),
        marginRight: px2dp(5)
    },
    seeMore: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(11)
    },
    seeMoreEn: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(9)
    },
    line: {
        height: onePixel,
        width: px2dp(43),
        backgroundColor: '#e3e3e3',
        margin: px2dp(2.5)
    }
});
