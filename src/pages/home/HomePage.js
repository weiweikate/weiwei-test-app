import React from 'react';
import {
    View,
    StyleSheet,
    DeviceEventEmitter, InteractionManager,
    RefreshControl,
    NativeEventEmitter,
    NativeModules,
    ActivityIndicator
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import { homeModule } from './model/Modules';
import { homeType } from './HomeTypes';
import HomeSearchView from './view/HomeSearchView';
import HomeChannelView from './view/HomeChannelView';
import HomeTodayView, { todayHeight } from './view/HomeTodayView';
import HomeRecommendView, { recommendHeight } from './view/HomeRecommendView';
import HomeSubjectView from './view/HomeSubjectView';
import HomeBannerView, { bannerHeight } from './view/HomeBannerView';
import GoodsCell, { kHomeGoodsViewHeight } from './view/HomeGoodsView';
import HomeUserView from './view/HomeUserView';
import HomeCategoryView, { categoryHeight } from './view/HomeCategoryView';
import { categoryModule } from './model/HomeCategoryModel';
import MessageApi from '../message/api/MessageApi';
import EmptyUtils from '../../utils/EmptyUtils';
import VersionUpdateModalView from './view/VersionUpdateModalView';
import DesignRule from '../../constants/DesignRule';
import homeModalManager from './manager/HomeModalManager';
import { withNavigationFocus } from 'react-navigation';
import user from '../../model/user';
import { homeTabManager } from './manager/HomeTabManager';
import { MRText as Text } from '../../components/ui';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { homeFocusAdModel } from './model/HomeFocusAdModel';
import { todayModule } from './model/HomeTodayModel';
import { recommendModule } from './model/HomeRecommendModel';
import { subjectModule } from './model/HomeSubjectModel';
import { homeExpandBnnerModel } from './model/HomeExpandBnnerModel';
import HomeTitleView from './view/HomeTitleView';
import LuckyIcon from '../guide/LuckyIcon';
import HomeMessageModalView, { HomeAdModal, GiftModal } from './view/HomeMessageModalView';
import { channelModules } from './model/HomeChannelModel';
import { bannerModule } from './model/HomeBannerModel';
import HomeLimitGoView from './view/HomeLimitGoView';
import { limitGoModule } from './model/HomeLimitGoModel';
import HomeExpandBannerView from './view/HomeExpandBannerView';
import HomeFocusAdView from './view/HomeFocusAdView';
import PraiseModel from './view/PraiseModel';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

const { JSPushBridge } = NativeModules;
const JSManagerEmitter = new NativeEventEmitter(JSPushBridge);

const HOME_REFRESH = 'homeRefresh';
const HOME_SKIP = 'activitySkip';

/**
 * @author zhangjian
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email zhangjian@meeruu.com
 */

const { px2dp, height, headerHeight } = ScreenUtils;
const scrollDist = height / 2 - headerHeight;
import BasePage from '../../BasePage';
import { TrackApi } from '../../utils/SensorsTrack';
import taskModel from './model/TaskModel';
import TaskVIew from './view/TaskVIew';
import intervalMsgModel, { IntervalMsgView, IntervalType } from '../../comm/components/IntervalMsgView';
import { UserLevelModalView } from './view/TaskModalView';
import { routePush } from '../../navigation/RouterMap';

const Footer = ({ errorMsg, isEnd, isFetching }) => <View style={styles.footer}>
    <ActivityIndicator style={{ marginRight: 6 }} animating={errorMsg ? false : (isEnd ? false : true)} size={'small'}
                       color={DesignRule.mainColor}/>
    <Text style={styles.text}
          allowFontScaling={false}>{errorMsg ? errorMsg : (isEnd ? '我也是有底线的~' : (isFetching ? '加载中...' : '加载更多中...'))}</Text>
</View>;
@observer
class HomeList extends React.Component {
    dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    layoutProvider = new LayoutProvider((i) => {
        return this.dataProvider.getDataForIndex(i).type || 0;
    }, (type, dim) => {
        dim.width = ScreenUtils.width;
        const { todayList } = todayModule;
        const { recommendList } = recommendModule;
        const { subjectHeight, subjectList } = subjectModule;
        const { foucusHeight } = homeFocusAdModel;

        switch (type) {
            case homeType.category:
                dim.height = categoryModule.categoryList.length > 0 ? categoryHeight : 0;
                break;
            case homeType.swiper:
                dim.height = bannerModule.bannerList.length > 0 ? bannerHeight : 0;
                break;
            case homeType.user:
                dim.height = user.isLogin ? (bannerModule.bannerList.length > 0 ? px2dp(44) : px2dp(31)) : 0;
                break;
            case homeType.task:
                dim.height = taskModel.homeHeight;
                break;
            case homeType.channel:
                dim.height = channelModules.channelList.length > 0 ? px2dp(90) : 0;
                break;
            case homeType.expandBanner:
                dim.height = homeExpandBnnerModel.bannerHeight;
                break;
            case homeType.focusGrid:
                dim.height = foucusHeight > 0 ? (foucusHeight + (homeExpandBnnerModel.banner.length > 0 ? px2dp(20) : px2dp(10))) : 0;
                break;
            case homeType.limitGo:
                dim.height = limitGoModule.spikeList.length > 0 ? limitGoModule.limitHeight : 0;
                break;
            case homeType.today:
                dim.height = todayList.length > 0 ? todayHeight : 0;
                break;
            case homeType.fine:
                dim.height = recommendList.length > 0 ? recommendHeight : 0;
                break;
            case homeType.homeHot:
                dim.height = subjectList.length > 0 ? subjectHeight : 0;
                break;
            case homeType.goodsTitle:
                dim.height = px2dp(52);
                break;
            case homeType.goods:
                dim.height = kHomeGoodsViewHeight;
                break;
            default:
                dim.height = 0;
        }
    });

    constructor(props) {
        super(props);
        // 重置
        homeModule.initHomeParams();
        homeTabManager.setAboveRecommend(false);
        this.offsetY = 0;
    }


    _keyExtractor = (item, index) => item.id + '';

    _renderItem = (type, item, index) => {
        let data = item;
        if (type === homeType.category) {
            return <HomeCategoryView navigate={routePush}/>;
        } else if (type === homeType.swiper) {
            return <HomeBannerView navigate={routePush}/>;
        } else if (type === homeType.user) {
            return <HomeUserView navigate={routePush}/>;
        } else if (type === homeType.task) {
            return <TaskVIew type={'home'} style={{marginTop: ScreenUtils.autoSizeWidth(10)}}/>;
        } else if (type === homeType.channel) {
            return <HomeChannelView navigate={routePush}/>;
        } else if (type === homeType.expandBanner) {
            return <HomeExpandBannerView navigate={routePush}/>;
        } else if (type === homeType.focusGrid) {
            return <HomeFocusAdView navigate={routePush}/>;
        } else if (type === homeType.limitGo) {
            return <HomeLimitGoView navigate={routePush}/>;
        } else if (type === homeType.today) {
            return <HomeTodayView navigate={routePush}/>;
        } else if (type === homeType.fine) {
            return <HomeRecommendView navigate={routePush}/>;
        } else if (type === homeType.homeHot) {
            return <HomeSubjectView navigate={routePush}/>;
        } else if (type === homeType.goods) {
            return <GoodsCell data={data} goodsRowIndex={index} otherLen={homeModule.goodsOtherLen}
                              navigate={routePush}/>;
        } else if (type === homeType.goodsTitle) {
            return <View style={styles.titleView}
                         ref={e => this.toGoods = e}
                         onLayout={event => {
                             // 保留，不能删除
                         }}>
                <HomeTitleView title={'为你推荐'}/>
            </View>;
        }
        return <View/>;
    };

    _onEndReached() {
        homeModule.loadMoreHomeList();
    }

    _onRefresh() {
        homeModule.isRefreshing = true;
        homeModule.loadHomeList(true);
        taskModel.getData();
        this.luckyIcon && this.luckyIcon.getLucky(1, '');
    }

    _onListViewScroll = (event) => {
        if (!homeModule.isFocused) {
            return;
        }
        this.offsetY = event.nativeEvent.contentOffset.y;
        this.toGoods && this.toGoods.measure((fx, fy, w, h, left, top) => {
            if (this.offsetY > height && top < scrollDist) {
                homeTabManager.setAboveRecommend(true);
            } else {
                homeTabManager.setAboveRecommend(false);
            }
        });
    };

    homeTabChange = () => {
        this.toGoods && this.toGoods.measure((fx, fy, w, h, left, top) => {
            if (top) {
                if (top < 0) {
                    if (!homeTabManager.isAboveRecommend) {
                        homeTabManager.setAboveRecommend(true);
                    }
                } else {
                    if (this.offsetY > height && top < scrollDist) {
                        if (!homeTabManager.isAboveRecommend) {
                            homeTabManager.setAboveRecommend(true);
                        }
                    } else {
                        if (homeTabManager.isAboveRecommend) {
                            homeTabManager.setAboveRecommend(false);
                        }
                    }
                }
            }
        });
    };


    render() {
        const { homeList } = homeModule;
        this.dataProvider = this.dataProvider.cloneWithRows(homeList);
        return (
                <RecyclerListView
                    ref={(ref) => {
                        this.recyclerListView = ref;
                    }}
                    style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1 }}
                    refreshControl={<RefreshControl refreshing={homeModule.isRefreshing}
                                                    onRefresh={this._onRefresh.bind(this)}
                                                    colors={[DesignRule.mainColor]}/>}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={ScreenUtils.height / 3}
                    dataProvider={this.dataProvider}
                    rowRenderer={this._renderItem.bind(this)}
                    layoutProvider={this.layoutProvider}
                    onScrollBeginDrag={this.props.onScrollBeginDrag}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    onScroll={this._onListViewScroll}
                    renderFooter={() => <Footer
                        isFetching={homeModule.isFetching}
                        errorMsg={homeModule.errorMsg}
                        isEnd={homeModule.isEnd}/>
                    }
                />
        );
    }

    componentDidMount() {
        this.listenerRetouchHome = DeviceEventEmitter.addListener('retouch_home', this.retouchHome);
        this.listenerHomeRefresh = JSManagerEmitter.addListener(HOME_REFRESH, this.homeTypeRefresh);
        this.listenerSkip = JSManagerEmitter.addListener(HOME_SKIP, this.homeSkip);
        // 修复首页图标不准确
        this.homeTabChange();
    }

    componentWillUnmount() {
        this.listenerRetouchHome && this.listenerRetouchHome.remove();
        this.listenerHomeRefresh && this.listenerHomeRefresh.remove();
        this.listenerSkip && this.listenerSkip.remove();
    }

    retouchHome = () => {
        if (homeTabManager.aboveRecommend) {
            this.recyclerListView && this.recyclerListView.scrollToTop(true);
        }
    };

    homeTypeRefresh = (type) => {
        homeModule.refreshHome(type);
    };

    homeSkip = (data) => {
        // 跳标
        const content = JSON.parse(data) || {};
        intervalMsgModel.setMsgData(content);
    };

}


class HomePage extends BasePage {

    $navigationBarOptions = {
        title: '',
        show: false
    };

    state = {
        hasMessage: false
    };


    componentDidMount() {
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                homeModule.homeFocused(false);
                homeTabManager.setHomeFocus(false);
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    homeModalManager.leaveHome();
                }
            }
        );

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    if (homeModule.firstLoad) {
                        homeModule.loadHomeList(true);
                    }
                }
            }
        );

        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    this.luckyIcon && this.luckyIcon.getLucky(1, '');
                    homeTabManager.setHomeFocus(true);
                    homeModule.homeFocused(true);
                    homeModalManager.entryHome();
                    user.getToken().then(() => {//让user初始化完成
                        this.luckyIcon && this.luckyIcon.getLucky(1, '');
                        if (user.token) {
                            this.loadMessageCount();
                        } else {
                            this.setState({
                                hasMessage: false
                            });
                        }
                        if (!homeModule.firstLoad) {
                            taskModel.getData();
                            limitGoModule.loadLimitGo(false);
                        }
                        homeModalManager.requestData();
                        homeModalManager.refreshPrize();
                    });
                }
                TrackApi.homePage();//埋点
            }
        );
        this.listener = DeviceEventEmitter.addListener('homePage_message', this.getMessageData);
        this.listenerMessage = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);
        this.listenerLogout = DeviceEventEmitter.addListener('login_out', this.loadMessageCount);
    }
    componentWillUnmount() {
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.listener && this.listener.remove();
        this.listenerMessage && this.listenerMessage.remove();
        this.listenerLogout && this.listenerLogout.remove();
    }

    loadMessageCount = () => {
        if (user.token) {
            InteractionManager.runAfterInteractions(() => {
                MessageApi.getNewNoticeMessageCount().then(result => {
                    if (!EmptyUtils.isEmpty(result.data)) {
                        this.setState({
                            hasMessage: result.data.shopMessageCount || result.data.noticeCount || result.data.messageCount
                        });
                    }
                }).catch((error) => {
                    this.setState({
                        hasMessage: false
                    });
                });
            });
        }
    };


    render() {
        return (
            <View style={[styles.container, { minHeight: ScreenUtils.headerHeight, minWidth: 1 }]}>
                <HomeSearchView navigation={routePush}
                                hasMessage={this.state.hasMessage}
                />
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        this.setState({ selectTab: obj.i });
                    }}
                    style={styles.container}
                    renderTabBar={this._renderTabBar}
                    //进界面的时候打算进第几个
                    initialPage={0}>
                <HomeList
                    tabLabel='Tab 1'
                    onScrollBeginDrag={() => {
                    this.luckyIcon.close();
                }}/>
                    <View  tabLabel='Tab 2'/>
                </ScrollableTabView>
                <LuckyIcon ref={(ref) => {
                    this.luckyIcon = ref;
                }}/>
                <PraiseModel/>
                <GiftModal/>
                <UserLevelModalView/>
                <IntervalMsgView pageType={IntervalType.home}/>
                <HomeAdModal/>
                <HomeMessageModalView/>
                <VersionUpdateModalView/>
            </View>
        );
    }

    _renderTabBar(){
        return (
            <DefaultTabBar
                containerWidth = {50}
                underlineStyle={{
                               width: 40,
                               height: 2,
                               marginLeft: 5,
                               backgroundColor: DesignRule.mainColor,
                               borderRadius: 1,

                           }}/>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    titleView: {
        marginTop: px2dp(10),
        paddingLeft: px2dp(15),
        width: ScreenUtils.width
    },
    messageBgStyle: {
        width: px2dp(295),
        height: px2dp(390),
        marginTop: px2dp(20)
    },
    messageCloseStyle: {
        width: px2dp(24),
        height: px2dp(24),
        marginTop: px2dp(100),
        alignSelf: 'flex-end',
        marginRight: ((ScreenUtils.width) - px2dp(300)) / 2
    },
    messageIndexStyle: {
        width: px2dp(10),
        height: px2dp(10),
        borderRadius: px2dp(5)
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    text: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_24
    }
});

export default withNavigationFocus(HomePage);
