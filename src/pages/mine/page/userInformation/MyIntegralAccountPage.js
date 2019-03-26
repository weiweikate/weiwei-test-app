import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    ImageBackground,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
import AccountItem from '../../components/AccountItem';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge' ;
import { observer } from 'mobx-react/native';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';

const { px2dp } = ScreenUtils;

const singInImg = res.userInfoImg.qdaojianli_icon;
const taskImg = res.userInfoImg.rwujianli_icon;
const yiyuanImg = res.userInfoImg.xiudozhanghu_icon_xjaingquan;
const zensong = res.userInfoImg.xiudozhanghu_icon_zengsong;
const xiugou_reword = res.myData.xiugou_reword;
const account_bg = res.bankCard.account_bg;
const account_bg_white = res.bankCard.account_bg_white;
@observer
export default class MyIntegralAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            id: user.code,
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [],
            currentPage: 1,
            isEmpty: false
        };
        this.currentPage = 1;
    }

    $navigationBarOptions = {
        title: '我的秀豆',

        show: false // false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <RefreshList
                    ListFooterComponent={this.renderFootder}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据！'}
                />
                {this._accountInfoRender()}
            </View>
        );
    }

    _accountInfoRender() {
        return (
            <ImageBackground source={account_bg_white} resizeMode={'stretch'} style={{
                position: 'absolute',
                top: px2dp(80),
                height: px2dp(140),
                width: ScreenUtils.width,
                left: 0,
                paddingHorizontal: DesignRule.margin_page
            }}>

                <View style={styles.withdrawWrapper}>
                    <Text style={styles.countTextStyle}>
                        秀豆账户（枚）
                    </Text>
                    <NoMoreClick style={styles.withdrawButtonWrapper}
                                 onPress={() => this.$navigate('home/signIn/SignInPage')}>
                        <Text style={{
                            fontSize: DesignRule.fontSize_threeTitle,
                            color: DesignRule.mainColor
                        }}>兑换1元现金劵</Text>
                    </NoMoreClick>
                </View>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 48,
                    marginLeft: DesignRule.margin_page,
                    marginTop: px2dp(15),
                    marginBottom: px2dp(30)
                }}>{user.userScore ? user.userScore : 0}</Text>
            </ImageBackground>
        );
    }

    renderHeader = () => {
        return (
            <ImageBackground resizeMode={'stretch'} source={account_bg} style={styles.container}>
                <View style={styles.headerWrapper}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={res.button.white_back}/>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    };

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity>
                <AccountItem
                    type={item.type}
                    time={item.time}
                    serialNumber={item.serialNumber}
                    capital={item.capital}
                    iconImage={item.iconImage}
                    clickItem={() => {
                        this.clickItem(index);
                    }}
                    capitalRed={item.capitalRed}
                />
            </TouchableOpacity>
        );
    };
    renderLine = () => {
        return (
            <View style={{
                height: 0.5,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginLeft: 48,
                marginRight: 48
            }}/>

        );
    };

    //**********************************BusinessPart******************************************
    componentDidMount() {

        this.onRefresh();
    }

    clickItem = (index) => {
        // alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ['', '注册赠送', '活动赠送', '其他', '兑换1元现金券', '签到奖励', '任务奖励', '秀购奖励', '抽奖奖励', '秀购奖励'];

        let use_type_symbol = ['', '+', '-'];
        let use_let_img = ['', singInImg, taskImg, taskImg, yiyuanImg, singInImg, taskImg, zensong, xiugou_reword, zensong];
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        if (this.currentPage > 1) {
            Toast.showLoading();
        }
        MineApi.userScoreQuery({
            page: this.currentPage,
            size: 10

        }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;
                data.data.map((item, index) => {
                    arrData.push({
                        type: use_type[item.useType],
                        time: DataUtils.getFormatDate(item.createTime / 1000),
                        serialNumber: item.serialNo || '',
                        capital: use_type_symbol[item.usType] + (item.userScore ? item.userScore : 0),
                        iconImage: use_let_img[item.useType],
                        capitalRed: use_type_symbol[item.usType] === '+'


                    });
                });
                this.setState({ viewData: arrData, isEmpty: data.data && data.data.length !== 0 ? false : true });
            } else {
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
            this.setState({ viewData: arrData, isEmpty: true });

        });
    };
    onRefresh = () => {
        this.currentPage = 1;
        if (user.isLogin) {
            MineApi.getUser().then(resp => {
                let data = resp.data;
                user.saveUserInfo(data);
            }).catch(err => {
                if (err.code === 10009) {
                    this.gotoLoginPage();
                }
            });
        }
        this.getDataFromNetwork();
    };
    onLoadMore = () => {
        if (!this.state.isEmpty) {
            this.currentPage++;
            this.getDataFromNetwork();
        }
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    },
    imageBackgroundStyle: {
        position: 'absolute',
        height: 95,
        backgroundColor: '#F2D4A2',
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15
    },
    rectangleStyle: {
        width: 120,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3
    },
    viewStyle: {
        height: 95,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15
    },
    container: {
        height: px2dp(188),
        width: ScreenUtils.width
    },
    withdrawButtonWrapper: {
        height: px2dp(28),
        borderRadius: px2dp(14),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.white,
        borderColor: DesignRule.mainColor,
        borderWidth: 1,
        paddingHorizontal: px2dp(7)
    },
    withdrawWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: DesignRule.margin_page,
        marginTop: px2dp(22)
    },
    countTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: DesignRule.margin_page,
        marginTop: ScreenUtils.statusBarHeight,
        height: 44
    }
});


