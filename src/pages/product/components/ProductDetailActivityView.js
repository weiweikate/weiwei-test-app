import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';
import res from '../res/product';

const { arrow_right_black } = res.button;

/*
* 秒杀未开始
* */
export class ActivityWillBeginView extends Component {
    render() {
        return (
            <View style={WillBeginStyles.bgView}>
                <View style={WillBeginStyles.leftView}>
                    <MRText style={WillBeginStyles.leftPriceText}>¥69</MRText>
                    <View style={WillBeginStyles.leftExplainView}>
                        <MRText style={WillBeginStyles.leftExplainText}>秒杀价</MRText>
                    </View>
                </View>
                <View style={WillBeginStyles.rightView}>
                    <MRText style={WillBeginStyles.rightText}>距开抢59:24.9</MRText>
                    <Image source={arrow_right_black}/>
                </View>
            </View>
        );
    }
}

const WillBeginStyles = StyleSheet.create({
    bgView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 38, backgroundColor: DesignRule.bgColor_light_yellow
    },
    leftView: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 15
    },
    leftPriceText: {
        fontSize: 17, color: DesignRule.textColor_green
    },
    leftExplainView: {
        marginLeft: 10, justifyContent: 'center', alignItems: 'center',
        borderRadius: 2, backgroundColor: DesignRule.bgColor_green, width: 40, height: 16
    },
    leftExplainText: {
        fontSize: 11, color: DesignRule.white
    },
    rightView: {
        flexDirection: 'row', alignItems: 'center', marginRight: 15
    },
    rightText: {
        paddingRight: 5,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    }
});

/*
* 秒杀开始
* */
export class ActivityDidBeginView extends Component {
    render() {
        return (
            <View style={DidBeginViewStyles.bgView}>
                <View style={DidBeginViewStyles.leftView}>
                    <MRText style={DidBeginViewStyles.priceText}>¥<MRText style={{ fontSize: 36 }}>69</MRText></MRText>
                    <View style={{ flex: 1 }}>
                        <View style={DidBeginViewStyles.skillView}>
                            <MRText style={DidBeginViewStyles.skillText}>秒杀价</MRText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <MRText style={[DidBeginViewStyles.amountText]}>原价¥123</MRText>
                            <MRText
                                style={[DidBeginViewStyles.amountText, { textDecorationLine: 'none' }]}> 已抢222件</MRText>
                        </View>
                    </View>
                </View>
                <View style={DidBeginViewStyles.rightView}>
                    <View style={{ marginLeft: 13, marginRight: 8 }}>
                        <MRText style={DidBeginViewStyles.timeText}>距结束23:23:24.9</MRText>
                        <View style={DidBeginViewStyles.leaveView}>
                            <View style={[DidBeginViewStyles.progressView, { width: 0.4 * 90 }]}/>
                            <View style={DidBeginViewStyles.leaveAmountView}>
                                <MRText style={DidBeginViewStyles.leaveAmountText}>还剩50件</MRText>
                            </View>
                        </View>
                    </View>
                    <Image source={arrow_right_black} style={{ marginRight: 13 }}/>
                </View>
            </View>
        );
    }
}

const DidBeginViewStyles = StyleSheet.create({
    bgView: {
        flexDirection: 'row', height: 56
    },
    leftView: {
        flexDirection: 'row', flex: 1, alignItems: 'center',
        backgroundColor: DesignRule.bgColor_redCard
    },
    priceText: {
        paddingLeft: 15, paddingRight: 10, paddingTop: (36 - 20) / 2,
        fontSize: 20, color: DesignRule.white
    },
    skillView: {
        justifyContent: 'center', alignItems: 'center', marginBottom: 3,
        borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.1)', width: 40, height: 16
    },
    skillText: {
        fontSize: 11, color: DesignRule.white
    },
    amountText: {
        fontSize: 12, color: DesignRule.white, textDecorationLine: 'line-through'
    },

    rightView: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: DesignRule.bgColor_yellow
    },
    timeText: {
        fontSize: 10, color: DesignRule.textColor_mainTitle
    },
    leaveView: {
        marginTop: 5,
        backgroundColor: '#FFA186', borderRadius: 6, width: 90, height: 12
    },
    progressView: {
        backgroundColor: DesignRule.bgColor_redCard, borderRadius: 6, height: 12
    },
    leaveAmountView: {
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
    },
    leaveAmountText: {
        fontSize: 10, color: DesignRule.textColor_white
    }
});
