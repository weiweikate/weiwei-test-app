/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/8/7.
 *
 */


'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    ImageBackground,
    ScrollView,
    Image
} from 'react-native';

import {
    MRText
} from '../../../components/ui';
import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import LinearGradient from 'react-native-linear-gradient';
import { topicAdOnPress } from '../HomeTypes';
import res from '../res'
import user from '../../../model/user';
const shouye_icon_gengduo = res.shouye_icon_gengduo
const icon_shopCar = res.icon_shopCar;
const autoSizeWidth = ScreenUtils.autoSizeWidth;

export default class GoodsCustomView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {
    }

    renderGoods(data)
    {
        let height = GoodsCustomViewGetItemHeight(data);
        switch (data.layout){
            case 1:
                return this.renderGoodsList(data,height)
            case 2:
            case 3:
                return this.renderTwoGoods(data,height)
            case 8:
                return this.renderGoodsScrollView(data,height)
        }
    }

    renderGoodsScrollView(data, height){
        let style = GoodsCustomViewGetItemStyle(data, height);
        let products = data.data || [];
        let showMore = data.showMore || {}
        return(
            <View style={{}}>
            <ScrollView horizontal = {true}
                        showsHorizontalScrollIndicator={false}
            >
                {products.map(((item, i) => {
                    return(
                        <TouchableWithoutFeedback onPress={()=> {this.gotoProduceDetail(item, i)}}>
                            <View style = {style}>
                                {this.renderImage(data,item, style.width)}
                                {this.renderTitle(data, item)}
                                {this.rederDetail(data, item)}
                                {this.renderCommission(data, item)}
                                {this.renderPrice(data, item)}
                                {this.renderOldPrice(data, item)}
                                {this.renderBtn(data, item)}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }))}
                {
                    showMore.visible ?
                        <TouchableWithoutFeedback onPress={()=> {
                            let {sgscm, sgspm} = data;
                            sgspm = sgspm+ '_'+ (products.length+1);
                                topicAdOnPress(data,showMore, null, '', {sgscm, sgspm} )
                        }}>
                            <View style = {[style,{alignItems: 'center', justifyContent: 'center'}]}>
                                <Image source={shouye_icon_gengduo}
                                       style={{height: autoSizeWidth(18), width: autoSizeWidth(18), marginBottom: 10}}/>
                                <MRText style={{fontSize: autoSizeWidth(12), color: '#666666'}}>查看更多</MRText>
                            </View>
                        </TouchableWithoutFeedback> : null
                }
            </ScrollView>
            </View>
        )
    }

    renderGoodsList(data, height)
    {
        let style = GoodsCustomViewGetItemStyle(data, height);
        let products = data.data || []
        let {commissionVisible, priceHasInvalidVisible } = data;
        if (!user.isLogin) {
            commissionVisible = false;
        }
        return products.map(((item, i) => {
            let style2 = {}
            if (i === 0){
                style2.marginTop = 0;
            }
            return(
                <TouchableWithoutFeedback onPress={()=> {this.gotoProduceDetail(item, i)}}>
                    <View style = {[style, style2]}>
                        {this.renderImage(data, item, style.height)}
                        <View style={{flex: 1, marginHorizontal: autoSizeWidth(10)}}>
                            {this.renderTitle(data, item)}
                            {this.rederDetail(data, item)}
                            { commissionVisible ?   <MRText style={{fontSize: autoSizeWidth(12),
                                color: DesignRule.mainColor}}>{item.minPriceY ? '佣金¥' + item.minPriceY : ''}</MRText> : null}
                            <View style={{flex: 1}}/>
                            <View style={{flexDirection: 'row'}}>
                                <MRText style={styles.tip}>{'拼店价'}</MRText>
                                {priceHasInvalidVisible ?
                                    <MRText style={[styles.oldPrice, {marginLeft: 5}]}>{'¥' + item.originalPrice}</MRText>
                                    : null}
                            </View>
                            <MRText style={{fontSize: autoSizeWidth(12),
                                color: DesignRule.mainColor,
                                marginBottom: autoSizeWidth(5),
                                marginTop: autoSizeWidth(5)
                            }}>
                                ¥<MRText  style={{fontSize: autoSizeWidth(18),
                                color: DesignRule.mainColor, fontWeight: '600'}}>{item.minPrice}</MRText>起
                            </MRText>
                            {this.renderBtn(data, item)}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }))
    }




    renderTwoGoods(data, height){
        let style = GoodsCustomViewGetItemStyle(data, height);
        let products = data.data || [];
        let Views = []
        if (data.layout === 3){
            if (products.length % 3){
                if (products.length % 3 === 1){
                    Views = [<View style={[style, {backgroundColor: null}]}/>,
                        <View style={[style, {backgroundColor: null}]}/>
                    ]
                } else {
                    Views = [<View style={[style, {backgroundColor: null}]}/>]
                }
            }
        } else {
            if (products.length % 2){
                if (products.length % 2 === 1){
                    Views = [<View style={[style, {backgroundColor: null}]}/>
                    ]
                }
            }
        }

        return (
            <View style={{flexDirection: 'row',
                flexWrap: 'wrap',
                width: ScreenUtils.width - ScreenUtils.autoSizeWidth(30),
                justifyContent: 'space-between',
            }}>
                {products.map(((item,i) => {
                    let style2 = {}
                    if (i < data.layout){
                        style2.marginTop = 0;
                    }
                    return(
                        <TouchableWithoutFeedback onPress={()=> {this.gotoProduceDetail(item, i)}}>
                            <View style = {[style,style2]}>
                                {this.renderImage(data,item, style.width)}
                                {this.renderTitle(data, item)}
                                {this.rederDetail(data, item)}
                                {this.renderCommission(data, item)}
                                {this.renderPrice(data, item)}
                                {this.renderOldPrice(data, item)}
                                {this.renderBtn(data,item)}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }))}
                {Views}
            </View>
        )
    }

    renderImage(data, item, width){

        let marginBottom = 0;
        let {cornerVisible, cornerImgSrc, cornerPosition, layout, mainPicBorderVisible, mainPicBorderUrl, priceInMainPicVisible} = data;
        let cornerStyle = {width: autoSizeWidth(28), height: autoSizeWidth(14), position: 'absolute', overflow: 'hidden'};

        switch (layout){
            case 1:
                break;
            case 2:
                marginBottom = autoSizeWidth(5);
                break;
            case 3:
                marginBottom = autoSizeWidth(5);
                break;
        }

        switch (cornerPosition){
            case 'left-top':
                cornerStyle.left = 0
                cornerStyle.top = 0
                cornerStyle.borderBottomRightRadius = 5;
                break;
            case 'left-bottom':
                cornerStyle.left = 0
                cornerStyle.bottom = 0
                cornerStyle.borderTopRightRadius = 5;
                break;
            case 'right-top':
                cornerStyle.right = 0
                cornerStyle.top = 0
                cornerStyle.borderTopRightRadius = 5;
                break;
            case 'right-bottom':
                cornerStyle.right = 0
                cornerStyle.bottom = 0
                cornerStyle.borderTopLeftRadius = 5;
                break;
        }

        let minPrice = item.minPrice + '';
        let length = minPrice.length
        let fontSize = autoSizeWidth(13)
        if (length > 3 && length < 5){
            fontSize = autoSizeWidth(11);
        }else if (length >= 5) {
            fontSize = autoSizeWidth(9);
        }
        const fixWidth =  autoSizeWidth(100);
        let scale = width / fixWidth;
        return (
            <ImageLoader style={{height: width, width: width, marginBottom: marginBottom }}
                         source={{uri: item.imgUrl}}
                         showPlaceholder={false}
            >
                {mainPicBorderVisible ? <ImageLoader source={{uri: mainPicBorderUrl}} style={{position: 'absolute', top: 0, left: 0,height: width, width: width}}
                                                    showPlaceholder={false}
                >
                        {priceInMainPicVisible ?
                            <View style={{
                                position: 'absolute', bottom: 0, left: 0, height: fixWidth / 4,
                                width: fixWidth / 3,
                                transform: [{ scale: scale},{translateX: (scale - 1) * fixWidth / 6.0 / scale},{translateY: -(scale - 1) * fixWidth / 8.0 / scale}],
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <MRText style={{ fontSize, color: 'white' }}>{minPrice}</MRText>
                            </View> : null
                        }
                    </ImageLoader>
                    : null}
                {
                    cornerVisible ? <ImageLoader source={{uri: cornerImgSrc}} style={cornerStyle}
                                               showPlaceholder={false}
                    /> : null
                }
            </ImageLoader>)
    }

    renderTitle(data, item){
        let {titleVisible, layout} = data
        if (!titleVisible) {return null;}
        switch (layout){
            case 3:
            case 2:
                return  <MRText style={{fontSize: autoSizeWidth(14),
                    color: DesignRule.textColor_mainTitle,
                    height: autoSizeWidth(20),
                    marginHorizontal: autoSizeWidth(5)
                }}
                                numberOfLines={1}>{item.name}</MRText>
            case 1:
                return  <MRText style={{fontSize: autoSizeWidth(14),
                    color: DesignRule.textColor_mainTitle,
                    marginTop: autoSizeWidth(4)}}
                                numberOfLines={1}>{item.name}</MRText>
            case 8:
                return  <MRText style={{fontSize: autoSizeWidth(12),
                    color: DesignRule.textColor_mainTitle,
                    marginHorizontal: autoSizeWidth(5),
                    marginTop: autoSizeWidth(0)}}
                                numberOfLines={1}>{item.name}</MRText>
        }
    }

    rederDetail(data, item){
        let {subtitleVisible, layout} = data
        if (!subtitleVisible) {return null;}
        switch (layout){
            case 1:
                return  <MRText style={{fontSize: autoSizeWidth(12),
                    color: DesignRule.textColor_instruction}}
                                numberOfLines={1}
                >{item.secondName}
                </MRText>
            case 2:
                return <MRText style={{fontSize: autoSizeWidth(12),
                    color: DesignRule.textColor_instruction,
                    height: autoSizeWidth(33 / 2),
                    marginHorizontal: autoSizeWidth(5)
                }}
                               numberOfLines={1}
                >{item.secondName}
                </MRText>
            case 3:
                return <MRText style={{fontSize: autoSizeWidth(11),
                    color: DesignRule.textColor_instruction,
                    height: autoSizeWidth(15),
                    marginHorizontal: autoSizeWidth(5)
                }}
                               numberOfLines={1}
                >{item.secondName}
                </MRText>
            case 8:
                return <MRText style={{fontSize: autoSizeWidth(10),
                    color: DesignRule.textColor_instruction,
                    height: autoSizeWidth(14),
                    marginHorizontal: autoSizeWidth(5)
                }}
                               numberOfLines={1}
                >{item.secondName}
                </MRText>
        }
    }

    renderCommission(data, item){
        let {commissionVisible, layout,priceNameVisible,
            priceNameAlias} = data
        if (!user.isLogin) {
            commissionVisible = false;
        }
        if (!commissionVisible &&  !priceNameVisible) {return null;}
        let style = {
            marginLeft: autoSizeWidth(5)}
        let textStyle = {
            fontSize: autoSizeWidth(10),
            color: DesignRule.mainColor,
            height: autoSizeWidth(14),
        }
        switch (layout){
            case 2:
                style.marginTop = autoSizeWidth(5)
                style.flexDirection = 'row';
                style.alignItems = 'center';
                textStyle.marginLeft = 4;
                break
            case 3:
                textStyle.fontSize = autoSizeWidth(10)
                break
            case 8:
                textStyle.fontSize = autoSizeWidth(10)
                break
        }
        return  <View style={style}>
            {priceNameVisible ? <View style={{flexDirection: 'row'}}>
                    <MRText style={[styles.tip,{  height: autoSizeWidth(14)}]}>{priceNameAlias || '价格'}</MRText>
                {layout === 2 ? null : <View style={{flex: 1}}/>}
                </View>
                : null}
            {commissionVisible ? <MRText style={textStyle}>{item.minPriceY ? '佣金¥' + item.minPriceY : ''}</MRText> : null}
        </View>
    }

    renderPrice(data, item){
        let {priceVisible,layout, buyButtonVisible, buyButtonType, priceHasInvalidVisible, priceBelowTitleVisible} = data
        if (priceHasInvalidVisible) {
            priceHasInvalidVisible = false;
            if (layout === 2 || layout === 3){
                if (!buyButtonVisible || (buyButtonVisible && buyButtonType === 2)) {
                    priceHasInvalidVisible = true;
                }
            }
        }
        if (!priceBelowTitleVisible) {
            priceVisible = false;
        }
        if (!priceVisible && !priceHasInvalidVisible){
            return null;
        }
        let container = {flexDirection: 'row',
            height: autoSizeWidth(20),
            marginTop: autoSizeWidth(5),
            marginLeft: autoSizeWidth(5)}
        let oldPrice = {marginLeft: 5,
            marginTop: 2};
        let priceStyle = {fontSize: autoSizeWidth(18),
            color: DesignRule.mainColor, fontWeight: '600'}
        let textStyle = {fontSize: autoSizeWidth(12),
            color: DesignRule.mainColor,
        }
        switch (layout){
            case 2:
                break
            case 3:
                priceStyle.fontSize = autoSizeWidth(14)
                container.height = autoSizeWidth(33 / 2)
                container.marginTop = autoSizeWidth(0)
                break
            case 8:
                priceStyle.fontSize = autoSizeWidth(12)
                container.height = autoSizeWidth(33 / 2)
                container.marginTop = autoSizeWidth(0)
                break
        }
        return <View style={container}>
            {(priceVisible && priceBelowTitleVisible) ? <MRText style={textStyle}>¥
                <MRText style={priceStyle}>{item.minPrice}
                </MRText>起
            </MRText> : null}
            {
                priceHasInvalidVisible ?
                    <MRText style={[styles.oldPrice, oldPrice]}>{'¥' + item.originalPrice}</MRText> : null
            }
        </View>


    }

    renderOldPrice(data, item){
        let {layout, buyButtonVisible, buyButtonType, priceHasInvalidVisible} = data
        if (priceHasInvalidVisible){
            if (layout === 2 || layout === 3){
                priceHasInvalidVisible = false;
                if (buyButtonVisible && buyButtonType === 1) {
                    priceHasInvalidVisible = true;
                }
            }
        }


        if (!priceHasInvalidVisible){
           return null;
        }

        switch (layout){
            case 2:
            case 3:
            case 8:
                return  <MRText style={[styles.oldPrice, {marginLeft: 5, height: autoSizeWidth(14)}]}>{'￥' + item.originalPrice}</MRText>

        }
    }

    renderBtn(data, item){
        if (!data.buyButtonVisible) {
            return;
        }
        let shopCarStyle = {}
        let buyBtnStyle = {}
        let buyTextStyle = {}
        switch (data.layout){
            case 1:
                shopCarStyle = {
                    width: autoSizeWidth(20),
                    height: autoSizeWidth(20),
                    position: 'absolute',
                    right: autoSizeWidth(5),
                    bottom: autoSizeWidth(10)}
                buyBtnStyle = {
                    borderRadius: 14,
                    overflow: 'hidden',
                    paddingHorizontal: autoSizeWidth(14),
                    height: autoSizeWidth(28),
                    position: 'absolute',
                    right: autoSizeWidth(0),
                    bottom: autoSizeWidth(10),
                    justifyContent: 'center'
                }
                buyTextStyle = {fontSize: autoSizeWidth(14), color: 'white'}
                break;
            case 2:
                shopCarStyle = {
                    width: autoSizeWidth(20),
                    height: autoSizeWidth(20),
                    position: 'absolute',
                    right: autoSizeWidth(10),
                    bottom: autoSizeWidth(10)}
                buyBtnStyle = {borderRadius: 14, overflow: 'hidden',
                    height: autoSizeWidth(28),
                    marginTop: autoSizeWidth(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: autoSizeWidth(5),
                }

                buyTextStyle = {fontSize: autoSizeWidth(14), color: 'white'}
                break;
            case 3:
                shopCarStyle = {
                    width: autoSizeWidth(20),
                    height: autoSizeWidth(20),
                    position: 'absolute',
                    right: autoSizeWidth(5),
                    bottom: autoSizeWidth(5)}

                buyBtnStyle = {borderRadius: autoSizeWidth(12), overflow: 'hidden',
                    height: autoSizeWidth(24),
                    marginTop: autoSizeWidth(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: autoSizeWidth(5),
                }

                buyTextStyle = {fontSize: autoSizeWidth(14), color: 'white'}
                break;

            case 8:
                shopCarStyle = {
                    width: autoSizeWidth(20),
                    height: autoSizeWidth(20),
                    position: 'absolute',
                    right: autoSizeWidth(5),
                    bottom: autoSizeWidth(5)}

                buyBtnStyle = {borderRadius: autoSizeWidth(12), overflow: 'hidden',
                    height: autoSizeWidth(24),
                    marginTop: autoSizeWidth(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: autoSizeWidth(5),
                }

                buyTextStyle = {fontSize: autoSizeWidth(12), color: 'white'}
                break;
        }
        if (data.buyButtonType === 1){
            return (
                    <ImageBackground style={shopCarStyle} source={icon_shopCar}/>
            )
        }else if(data.buyButtonType === 2){
            return (
                    <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}
                                    style={buyBtnStyle}
                    >
                        <MRText style={buyTextStyle}>{data.buyButtonText}</MRText>
                    </LinearGradient>
            )
        }
    }

    gotoProduceDetail(item, i){
        let {sgscm, sgspm} = this.props.data;
        sgspm = sgspm+ '_'+ (i+1);
        topicAdOnPress({},{ linkType: 1, linkValue:[item.prodCode]}, this.props.p, item.name,  {sgscm, sgspm})

    }
    //添加购物车
    addShopCar(item){
        topicAdOnPress({},{ linkType: 1, linkValue:[item.prodCode]}, this.props.p, item.name)
    }



    render() {
        let data = this.props.data;
        let marginBottom = data.marginBottom || 0;
        let height = data.itemHeight - marginBottom;
        if (height === 0){
            return <View />;
        }
        return (
            <View style={{height: (height - autoSizeWidth(15) ),
                width: ScreenUtils.width - autoSizeWidth(30),
                marginLeft: autoSizeWidth(15),
                marginTop: autoSizeWidth(15),
                marginBottom: data.marginBottom,
            }}>
                {this.renderGoods(data)}
            </View>
        );
    }
}

export function GoodsCustomViewGetItemHeight(data) {
    if (!data || !data.data || data.data.length === 0){
        return 0;
    }
    let height = 0;
    let {buyButtonVisible, buyButtonType,
        titleVisible, subtitleVisible, priceNameVisible,
        priceHasInvalidVisible,commissionVisible} = data;
    switch (data.layout) {
        case  1 :
            return ScreenUtils.autoSizeWidth(120)
        case  2 :
            height = ScreenUtils.autoSizeWidth(335 / 2);
            height += ScreenUtils.autoSizeWidth(5)//间距
            if (titleVisible){ height += ScreenUtils.autoSizeWidth(20)}//title
            if (subtitleVisible){ height += ScreenUtils.autoSizeWidth(33 / 2)}//detail
            height += ScreenUtils.autoSizeWidth(5)//间距
            if (commissionVisible || priceNameVisible){ height += ScreenUtils.autoSizeWidth(14)}//拼店
            if (isShowPrice(data)){
                height += ScreenUtils.autoSizeWidth(20)//价格
            }
            if (buyButtonVisible) {
                if (buyButtonType === 1 && priceHasInvalidVisible) {
                    height += ScreenUtils.autoSizeWidth(14)//老价格
                } else if (buyButtonType === 2) {
                    height += ScreenUtils.autoSizeWidth(5)//间距
                    height += ScreenUtils.autoSizeWidth(28)//立即购买
                }
            }
            height +=  ScreenUtils.autoSizeWidth(10)//间距
            return height
        case  3 :

            height = ScreenUtils.autoSizeWidth(224 / 2);
            height +=  ScreenUtils.autoSizeWidth(5)//间距
            if (titleVisible){ height += ScreenUtils.autoSizeWidth(20)}//title
            if (subtitleVisible){ height += ScreenUtils.autoSizeWidth(15)}//detail
            if (priceNameVisible){ height += ScreenUtils.autoSizeWidth(14)}//拼店
            if (commissionVisible){ height += ScreenUtils.autoSizeWidth(14)}//佣金
            if (isShowPrice(data)){
                height += ScreenUtils.autoSizeWidth(33 / 2)//价格
            }
            if (buyButtonVisible) {
                if (buyButtonType === 1 && priceHasInvalidVisible) {
                    height +=  ScreenUtils.autoSizeWidth(14)//老价格
                } else if (buyButtonType === 2){
                    height += ScreenUtils.autoSizeWidth(5)//间距
                    height += ScreenUtils.autoSizeWidth(24)//立即购买
                }
            }
            height +=  ScreenUtils.autoSizeWidth(10)//间距
            return height
        case  8 :
            height = ScreenUtils.autoSizeWidth(100);
            if (titleVisible){ height += ScreenUtils.autoSizeWidth(33 / 2)}//title
            if (subtitleVisible){ height += ScreenUtils.autoSizeWidth(14)}//detail
            if (priceNameVisible){ height += ScreenUtils.autoSizeWidth(14)}//拼店
            if (commissionVisible){ height += ScreenUtils.autoSizeWidth(14)}//佣金
            if (isShowPrice(data)){
                height += ScreenUtils.autoSizeWidth(33 / 2)//价格
            }
            if (priceHasInvalidVisible) {
                height +=  ScreenUtils.autoSizeWidth(14)//老价格
            }
            if (buyButtonVisible) {
                if (buyButtonType === 1) {
                } else if (buyButtonType === 2){
                    height += ScreenUtils.autoSizeWidth(5)//间距
                    height += ScreenUtils.autoSizeWidth(24)//立即购买
                }
            }
            height +=  ScreenUtils.autoSizeWidth(10)//间距
            return height
    }
    return 0;
}

export function GoodsCustomViewGetHeight(data) {

    if (!data || !data.data || data.data.length === 0){
        return 0;
    }
    let height = GoodsCustomViewGetItemHeight(data);
    let count = data.data.length - 1;
    let itemPadding = ScreenUtils.autoSizeWidth(data.itemPadding / 2);
    switch (data.layout){
        case  1 :
            itemPadding = autoSizeWidth(10);
            count++;
            return height * count + itemPadding * (count - 1) + autoSizeWidth(15)
        case  2 :
            count = Math.floor(count / 2)+1;
            return  height * count + itemPadding * (count - 1) + autoSizeWidth(15)
        case  3 :
            count = Math.floor(count / 3)+1;
            return  height * count + itemPadding * (count - 1) + autoSizeWidth(15)
        case  8 :
            return height  + autoSizeWidth(15)
    }
    return 0;
}



export function GoodsCustomViewGetItemStyle(data, height){
    let padding = autoSizeWidth(5)
    let itemPadding = ScreenUtils.autoSizeWidth(data.itemPadding / 2);
    padding = itemPadding;
    let width = ScreenUtils.width - ScreenUtils.autoSizeWidth(30);
    switch (data.layout){
        case 1:
            itemPadding = autoSizeWidth(10);
            return {width, height, marginTop: itemPadding, flexDirection: 'row', backgroundColor: 'white', borderRadius: 5, overflow: 'hidden'}
        case 2:
            return  {width : (width - itemPadding) / 2, height, backgroundColor: 'white', marginTop: padding, borderRadius: 5, overflow: 'hidden'}
        case 3:
            return {width : (width - 2 * itemPadding) / 3, height, marginTop: padding, borderRadius: 5, overflow: 'hidden',backgroundColor: 'white'}
        case 8:
            return {width : autoSizeWidth(100), height, marginRight: itemPadding, borderRadius: 5, overflow: 'hidden',backgroundColor: 'white'}
    }
    return {};
}

function isShowPrice(data) {
    let {priceVisible,layout, buyButtonVisible, buyButtonType, priceHasInvalidVisible, priceBelowTitleVisible} = data
    if(!priceBelowTitleVisible){
        priceVisible = false;
    }
    if (priceHasInvalidVisible) {
        priceHasInvalidVisible = false;
        if (layout === 2 || layout === 3){
            if (!buyButtonVisible || (buyButtonVisible && buyButtonType === 2)) {
                priceHasInvalidVisible = true;
            }
        }
    }
    return priceVisible || priceHasInvalidVisible
}


const styles = StyleSheet.create({
    tip: {
        fontSize: autoSizeWidth(10),
        color: DesignRule.mainColor,
        backgroundColor: 'rgba(250,0,80,0.1)',
        paddingHorizontal: 3,
        borderRadius: 3,
        overflow: 'hidden'
    },
    oldPrice: {
        textDecorationLine:'line-through',
        fontSize: autoSizeWidth(10),
        color: DesignRule.textColor_instruction,
    }
});
