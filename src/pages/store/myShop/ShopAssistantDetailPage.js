//店员详情页面
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import UIImage from '@mr/image-placeholder';
import { MRText as Text } from '../../../components/ui';
import BasePage from '../../../BasePage';
import DateUtils from '../../../utils/DateUtils';
import SpellShopApi from '../api/SpellShopApi';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';
import resCommon from '../../../comm/res';
//Source
const SCREEN_WIDTH = ScreenUtils.width;

const RingImg = res.myShop.headBg;
const HeaderBarBgImg = res.myShop.txbg_03;
const NameIcon = res.myShop.icon_03;
const StarIcon = res.myShop.icon_03_02;
const CodeIcon = res.myShop.icon_03_03;
const PhoneIcon = res.myShop.icon_03_04;
const QbIcon = res.myShop.dzfhj_03_03;
const MoneyIcon = res.myShop.ccz_03;
const NavLeft = resCommon.button.back_white;

export default class ShopAssistantDetailPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }

    $navigationBarOptions = {
        show: false
    };

    _NavBarRenderRightItem = () => {
        return (<View style={styles.transparentView}>
                <View style={styles.leftBarItemContainer}>

                    <TouchableOpacity onPress={() => {
                        this.$navigateBack();
                    }} style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={NavLeft} style={{ width: 30, height: 30 }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        const { userCode, storeCode } = this.params;
        SpellShopApi.findUserDetail({ userCode, storeCode }).then((data) => {
            this.setState({
                userInfo: data.data || {}
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    }

    _renderDescRow = (icon, title, style = { marginBottom: 15 }) => {
        return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
            <Image source={icon} style={{ width: 15, height: 15 }}/>
            <Text style={styles.rowTitle} allowFontScaling={false}>{title}</Text>
        </View>;
    };

    _renderRow = (icon, title, desc) => {
        return (<View style={styles.row}>
            <Image style={styles.icon} source={icon}/>
            <Text style={styles.title} allowFontScaling={false}>{title}</Text>
            <Text style={styles.desc} allowFontScaling={false}>{desc}</Text>
        </View>);
    };

    renderSepLine = () => {
        return (<View style={styles.line}/>);
    };

    renderContent = () => {
        const { userInfo } = this.state;
        const { updateTime, userBonus } = this.state.userInfo;
        return (
            <ScrollView style={{ flex: 1 }}>
                <ImageBackground source={HeaderBarBgImg} style={styles.imgBg}>
                    <View style={{
                        marginTop: ScreenUtils.headerHeight,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <ImageBackground source={RingImg}
                                         style={styles.headerBg}>
                            <UIImage
                                style={styles.headImg}
                                source={{ uri: userInfo.headImg }}
                                borderRadius={34}/>
                        </ImageBackground>
                        <View style={styles.shopInContainer}>
                            {this._renderDescRow(NameIcon, `名称：${userInfo.nickName || ''}`)}
                            {this._renderDescRow(StarIcon, `级别：${userInfo.levelName || ''}`)}
                            {this._renderDescRow(CodeIcon, `会员号：${userInfo.code || ''}`)}
                            {this._renderDescRow(PhoneIcon, `手机号：${userInfo.phone || ''}`, null)}
                        </View>
                    </View>
                </ImageBackground>
                {this._renderRow(QbIcon, '加入店铺时间', updateTime ? DateUtils.formatDate(updateTime, 'yyyy年MM月dd日') : '')}
                {this.renderSepLine()}
                {this._renderRow(MoneyIcon, '每月分红总额', `${userBonus || 0}元`)}
            </ScrollView>);
    };

    _render() {
        return (
            <View style={styles.container}>
                {this._NavBarRenderRightItem()}
                {this.renderContent()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    transparentView: {
        top: ScreenUtils.statusBarHeight,
        height: 44,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 5,
        right: 15,
        zIndex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 88
    },
    imgBg: {
        width: SCREEN_WIDTH,
        height: ScreenUtils.autoSizeWidth(162) + ScreenUtils.headerHeight,
        marginBottom: 11
    },
    headerBg: {
        marginLeft: 16,
        marginRight: 23,
        width: 105 / 375 * SCREEN_WIDTH,
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headImg: {
        width: 68,
        height: 68,
        borderRadius: 34
    },
    shopInContainer: {
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center'
    },
    rowTitle: {
        fontSize: 13,
        color: 'white',
        marginLeft: 5
    },
    line: {
        height: StyleSheet.hairlineWidth,
        borderColor: '#fdfcfc'
    },
    row: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    icon: {
        marginLeft: 25, width: 14, height: 14
    },
    title: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 4
    },
    desc: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle,
        flex: 1,
        textAlign: 'right',
        marginRight: 21
    }
});
