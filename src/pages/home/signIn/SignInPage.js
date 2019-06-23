/**
 * @author xzm
 * @date 2018/10/12
 */
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import SignInCircleView from './components/SignInCircleView';

const { px2dp } = ScreenUtils;
import ImageLoader from '@mr/image-placeholder';
import HomeAPI from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import user from '../../../model/user';
import { observer } from 'mobx-react';
import EmptyUtils from '../../../utils/EmptyUtils';
import MineApi from '../../mine/api/MineApi';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import apiEnvironment from '../../../api/ApiEnvironment';
import { track, TrackApi, trackEvent } from '../../../utils/SensorsTrack';

import { MRText as Text } from '../../../components/ui';
import CommModal from '../../../comm/components/CommModal';
import { homeModule } from '../model/Modules';
import RouterMap from '../../../navigation/RouterMap';

const {
    sign_in_bg: signInImageBg,
    showbean_icon: showBeanIcon,
    coupons_bg: couponBackground,
    modal_close: modalClose
} = res.signIn;

@observer
export default class SignInPage extends BasePage {
    constructor(props) {
        super(props);
        this.first = true; //初次进入
        this.signinRequesting = false;
        this.exchangeing = false;
        this.state = {
            loadingState: PageLoadingState.loading,
            signInData: null,
            exchangeData: null,
            showModal: false,
            modalInfo: null
        };
    }

    $navigationBarOptions = {
        title: '签到',
        show: true// false则隐藏导航
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this.loadPageData
            }
        };
    };

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.showMore}>
                <Text style={styles.rightItemStyle}>
                    签到规则
                </Text>
            </TouchableOpacity>
        );
    };

    componentWillMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                if (user.token) {
                    this.loadPageData();
                } else {
                    if (this.first) {
                        this.loadPageData();
                        this.first = false;
                    }
                }
            }
        );
    }

    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    loadPageData = () => {
        this.getSignData();
        this.reSaveUserInfo();
        this.getExchange();
        this.getModalInfo();
    };

    getModalInfo = () => {
        HomeAPI.getHomeData({ type: homeType.signIn }).then((data) => {
            this.setState({
                modalInfo: data.data
            });
        });
    };

    /**
     * 获取秀豆兑换比例
     */
    getExchange = () => {
        HomeAPI.getExchange().then((data) => {
            this.setState({
                exchangeData: data.data
            });
        }).catch((error) => {
            this.setState({
                exchangeData: null
            });
        });
    };

    getSignData = () => {
        let callback = this.loadPageData;
        HomeAPI.querySignList(null, { callback }).then((data) => {
            this.setState({
                signInData: data.data,
                // loading: false,
                refreshing: false,
                netFailedInfo: null,
                loadingState: PageLoadingState.success
            });
        }).catch((error) => {
            this.setState({
                // loading: false,
                refreshing: false,
                netFailedInfo: error,
                loadingState: PageLoadingState.fail
            });
        });
    };

    reSaveUserInfo = () => {
        MineApi.getUser({}, { nav: this.props.navigation, callback: this.loadPageData }).then(res => {
            if (res.code === 10000) {
                let data = res.data;
                user.saveUserInfo(data);
            }
        }).catch(err => {
        });
    };

    showMore = () => {
        this.$navigate(RouterMap.HtmlPage, {
            title: '签到规则',
            uri: `${apiEnvironment.getCurrentH5Url()}/static/protocol/signInRule.html`
        });
    };

    //签到
    userSign = () => {
        if (this.signinRequesting) {
            return;
        }
        this.signinRequesting = true;
        let count;
        if (this.state.signInData[3].continuous) {
            count = this.state.signInData[3].continuous;
        } else {
            count = this.state.signInData[2].continuous ? this.state.signInData[2].continuous : 0;
        }
        TrackApi.SignUpFeedback({
            continuousSignNumber: count,
            signRewardType: 1,
            signRewardAmount: this.state.signInData[3].canReward
        });
        HomeAPI.userSign().then((data) => {
            this.signinRequesting = false;
            this.$toastShow(`签到成功 +${this.state.signInData[3].canReward}秀豆`);
            this.getSignData();
            this.reSaveUserInfo();
            if (this.state.modalInfo && this.state.modalInfo.length > 0) {
                this.setState({
                    showModal: true
                });
            }
        }).catch((error) => {
            this.signinRequesting = false;
            this.$toastShow(error.msg);
        });
    };

    //兑换一元优惠券
    exchangeCoupon = () => {
        if (this.exchangeing) {
            return;
        }
        this.exchangeing = true;
        track(trackEvent.receiveshowDou, {
            showDouDeduct: 'exchange',
            showDouAmount: this.state.signInData[3].canReward
        });
        track(trackEvent.receiveOneyuan, { yiYuanCouponsAmount: 1, yiYuanCouponsGetMethod: 'exchange' });
        HomeAPI.exchangeTokenCoin().then((data) => {
            this.exchangeing = false;
            this.$toastShow('成功兑换一张1元现金券');
            this.reSaveUserInfo();
        }).catch((error) => {
            this.exchangeing = false;
            this.$toastShow(error.msg);
        });
    };

    //**********************************ViewPart******************************************
    _signInButtonRender() {
        let fontSize = px2dp(22);
        if (user.userScore) {
            let str = user.userScore + '';
            if (str.length > 4) {
                fontSize = px2dp(16);
            }
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.$toastShow('今天已签到！');
            }}>
                <View style={styles.signInButtonWrapper}>
                    <Image style={styles.showBeanIconStyle} resizeMode={'stretch'} source={showBeanIcon}/>
                    <Text style={[styles.showBeanTextStyle, { fontSize: fontSize }]}>
                        {user.userScore ? user.userScore : 0}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _smallLineRenderWithColor(color) {
        return (<View style={{ backgroundColor: color, height: px2dp(1), width: px2dp(15) }}/>);
    }

    _signInInfoRender = () => {
        let circlesView = this.state.signInData.map((item, index) => {
            let kind, count;
            count = !EmptyUtils.isEmpty(item.reward) ? item.reward : item.canReward;
            if (index < 3) {
                if (item.continuous > 0) {
                    kind = 'signedIn';
                } else {
                    kind = 'noSignIn';
                }
            } else if (index === 3) {
                if (item.continuous > 0) {
                    kind = 'signingIn';
                } else {
                    kind = 'willSignIn';
                    count = item.canReward;
                }
            } else if (index > 3) {
                kind = 'willSignIn';
            }
            if (index === 0) {
                return <SignInCircleView key={'circle' + index} count={count} kind={kind}/>;
            } else {
                return (
                    <View key={'circle' + index} style={styles.signInItemWrapper}>
                        <View style={{ backgroundColor: index < 4 ? 'white' : '#c6b478', height: px2dp(1), flex: 1 }}/>
                        <SignInCircleView count={count} kind={kind}/>
                    </View>
                );
            }
        });

        let datesView = this.state.signInData.map((item, index) => {
            return (
                <Text key={'date' + index} style={styles.dateTextStyle}>
                    {item.signDate && item.signDate.replace('-', '.')}
                </Text>
            );
        });

        return (
            <View style={styles.signInInfoWrapper}>
                <View style={styles.circleWrapper}>
                    {this._smallLineRenderWithColor('white')}
                    {circlesView}
                    {this._smallLineRenderWithColor('#c6b478')}
                </View>
                <View style={styles.dateWrapper}>
                    {datesView}
                </View>
            </View>
        );
    };

    _couponRender() {
        return (
            <ImageBackground source={couponBackground} style={styles.couponBgStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Text style={{
                        color: DesignRule.mainColor,
                        fontSize: px2dp(36),
                        marginLeft: px2dp(30),
                        includeFontPadding: false,
                        textAlignVertical: 'bottom'
                    }}>
                        1
                    </Text>
                    <Text style={{ color: DesignRule.mainColor, fontSize: px2dp(14), marginBottom: 8 }}>元</Text>
                </View>
                <View style={styles.couponTextWrapper}>
                    <Text style={styles.couponNameTextStyle}>
                        现金券
                    </Text>
                    <Text style={styles.couponTagTextStyle}>
                        全场通用/无时间限制
                    </Text>
                </View>
                <View style={{ flex: 1 }}/>
                <View style={styles.convertWrapper}>
                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: px2dp(12),
                        includeFontPadding: false
                    }}>
                        消耗秀豆
                    </Text>
                    <Text style={{ color: DesignRule.mainColor, fontSize: px2dp(12), includeFontPadding: false }}>
                        {`-- ${this.state.exchangeData} --`}
                    </Text>
                    <TouchableWithoutFeedback onPress={this.exchangeCoupon}>
                        <View style={styles.convertButtonStyle}>
                            <Text style={styles.convertTextStyle}>
                                立即兑换
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    }

    _headerIconRender() {
        let hasSign = !EmptyUtils.isEmpty(this.state.signInData[3].continuous);
        let view = hasSign ? this._hasSignRender() : this._willSignRender();
        return view;

    }

    _hasSignRender = () => {
        let count;
        if (this.state.signInData[3].continuous) {
            count = this.state.signInData[3].continuous;
        } else {
            count = this.state.signInData[2].continuous ? this.state.signInData[2].continuous : 0;
        }
        return (
            <ImageBackground
                source={signInImageBg}
                style={styles.headerImageStyle}
                resizeMode={'stretch'}>
                {this._signInButtonRender()}
                <Text style={styles.signInCountTextStyle}>
                    {`连续签到${count}天`}
                </Text>
            </ImageBackground>
        );
    };

    _willSignRender = () => {
        let count;
        if (this.state.signInData[3].continuous) {
            count = this.state.signInData[3].continuous;
        } else {
            count = this.state.signInData[2].continuous ? this.state.signInData[2].continuous : 0;
        }
        return (
            <ImageBackground
                source={signInImageBg}
                style={styles.headerImageStyle}
                resizeMode={'stretch'}>
                <TouchableWithoutFeedback onPress={this.userSign}>
                    <View style={styles.signInButtonWrapper}>
                        <Text style={styles.willSignTextStyle}>
                            签
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <Text style={styles.signInCountTextStyle}>
                    {`连续签到${count}天`}
                </Text>
            </ImageBackground>
        );
    };

    _reminderRender = () => {
        return (
            <Text style={styles.reminderStyle}>
                {`注：${this.state.exchangeData}秀豆兑换1张券，无兑换限制，点击即可兑换`}
            </Text>
        );
    };

    _modalPress = () => {
        this.setState({
            showModal: false
        });
        const item = this.state.modalInfo[0];
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
        let params = homeModule.paramsNavigate(item);
        this.$navigate(router, { ...params });
    };

    _signModalRender() {
        return (this.state.modalInfo && this.state.modalInfo.length > 0) ? (
            <CommModal onRequestClose={() => {
                this.setState({
                    showModal: false
                });
            }} visible={this.state.showModal}>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        this._modalPress();
                    }}>
                        <ImageLoader
                            source={{ uri: this.state.modalInfo[0].image }}
                            showPlaceholder={false}
                            style={styles.modalImageStyle}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            showModal: false
                        });
                    }}>
                        <Image source={modalClose} style={styles.closeIconStyle}/>
                    </TouchableWithoutFeedback>
                </View>
            </CommModal>
        ) : null;
    }

    _render() {

        return (
            <View style={styles.container}>
                {this._headerIconRender()}
                {this.state.signInData ? this._signInInfoRender() : null}
                {this.state.exchangeData ? this._couponRender() : null}
                {this.state.exchangeData ? this._reminderRender() : null}
                <View style={{ flex: 1 }}/>
                <TouchableWithoutFeedback onPress={() => this.$navigate(RouterMap.CouponsPage)}>
                    <View>
                        <Text style={styles.couponsTextStyle}>
                            已有{user.tokenCoin ? user.tokenCoin : 0}张现金券>
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                {this._signModalRender()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightItemStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(12)
    },
    headerImageStyle: {
        width: ScreenUtils.width,
        height: px2dp(178)
    },
    signInButtonWrapper: {
        backgroundColor: DesignRule.mainColor,
        width: px2dp(82),
        height: px2dp(82),
        borderRadius: px2dp(41),
        borderColor: '#e8cbd3',
        borderWidth: px2dp(4),
        alignSelf: 'center',
        marginTop: px2dp(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    signInCountTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(12),
        alignSelf: 'center',
        marginTop: px2dp(10)
    },
    signInInfoWrapper: {
        width: ScreenUtils.width - px2dp(30),
        height: px2dp(110),
        borderRadius: px2dp(5),
        backgroundColor: '#d4c59e',
        justifyContent: 'space-between',
        paddingVertical: px2dp(25),
        marginTop: px2dp(-30),
        marginLeft: px2dp(15)
    },
    circleWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    signInItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    dateWrapper: {
        flexDirection: 'row',
        paddingHorizontal: px2dp(15),
        justifyContent: 'space-between'
    },
    dateTextStyle: {
        color: 'white',
        fontSize: px2dp(11)
    },
    showBeanIconStyle: {
        width: px2dp(30),
        height: px2dp(30)
    },
    showBeanTextStyle: {
        color: 'white'
    },
    couponBgStyle: {
        height: px2dp(94),
        width: ScreenUtils.width - px2dp(30),
        marginLeft: px2dp(15),
        alignItems: 'center',
        marginTop: px2dp(15),
        flexDirection: 'row'
    },
    couponNameTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(14)
    },
    couponTagTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(12)
    },
    couponTextWrapper: {
        paddingVertical: px2dp(26),
        justifyContent: 'space-between',
        marginLeft: px2dp(30)
    },
    convertWrapper: {
        alignItems: 'center',
        marginRight: px2dp(10),
        height: px2dp(94) - px2dp(30),
        justifyContent: 'space-between'
    },
    convertButtonStyle: {
        height: px2dp(20),
        width: px2dp(68),
        borderRadius: px2dp(10),
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    convertTextStyle: {
        color: 'white',
        fontSize: px2dp(12)
    },
    reminderStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(11),
        marginTop: px2dp(10),
        marginLeft: px2dp(15)
    },
    couponsTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(11),
        alignSelf: 'center',
        marginBottom: px2dp(15),
        includeFontPadding: false
    },
    willSignTextStyle: {
        fontSize: px2dp(30),
        color: 'white'
    },
    closeIconStyle: {
        width: px2dp(38),
        height: px2dp(38),
        marginTop: px2dp(30)
    },
    modalImageStyle: {
        width: ScreenUtils.autoSizeWidth(310),
        height: ScreenUtils.autoSizeHeight(410)
    }

});
