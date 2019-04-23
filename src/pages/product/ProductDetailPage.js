import React from 'react';
import {
    View,
    StyleSheet,
    SectionList,
    Alert,
    Image
} from 'react-native';
import BasePage from '../../BasePage';
import DetailBottomView from './components/DetailBottomView';
import PriceExplain from './components/PriceExplain';
import SelectionPage from './SelectionPage';
import ScreenUtils from '../../utils/ScreenUtils';
import shopCartCacheTool from '../shopCart/model/ShopCartCacheTool';
import CommShareModal from '../../comm/components/CommShareModal';
import DetailNavShowModal from './components/DetailNavShowModal';
import apiEnvironment from '../../api/ApiEnvironment';
import { track, trackEvent } from '../../utils/SensorsTrack';
import user from '../../model/user';
import { PageLoadingState, renderViewByLoadingState } from '../../components/pageDecorator/PageState';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import DetailHeaderServiceModal from './components/DetailHeaderServiceModal';
import DetailPromoteModal from './components/DetailPromoteModal';
import { beginChatType, QYChatTool } from '../../utils/QYModule/QYChatTool';
<<<<<<< HEAD
import {SmoothPushPreLoadHighComponent} from '../../comm/components/SmoothPushHighComponent';
// import bridge from '../../../utils/bridge';

// const redEnvelopeBg = res.other.red_big_envelope;
=======
import ProductDetailModel, { productItemType } from './ProductDetailModel';
import { observer } from 'mobx-react';
import RouterMap from '../../navigation/RouterMap';
import {
    ContentItemView,
    HeaderItemView,
    ParamItemView,
    PromoteItemView,
    ServiceItemView, ShowTopView, SuitItemView
} from './components/ProductDetailItemView';
import DetailHeaderScoreView from './components/DetailHeaderScoreView';
import DetailParamsModal from './components/DetailParamsModal';
import { ContentSectionView, SectionLineView, SectionNullView } from './components/ProductDetailSectionView';
import ProductDetailNavView from './components/ProductDetailNavView';
>>>>>>> origin/4.25

/**
 * @author chenyangjun
 * @date on 2018/9/7
 * @describe 首页
 * @org www.sharegoodsmall.com
 * @email chenyangjun@meeruu.com
 */

<<<<<<< HEAD
// const LASTSHOWPROMOTIONTIME = 'LASTSHOWPROMOTIONTIME';
@SmoothPushPreLoadHighComponent
=======
@observer
>>>>>>> origin/4.25
export default class ProductDetailPage extends BasePage {

    productDetailModel = new ProductDetailModel();

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            goType: ''
        };
        this.productDetailModel.prodCode = this.params.productCode;
    }

    _getPageStateOptions = () => {
        const { productStatus, loadingState, netFailedInfo, requestProductDetail } = this.productDetailModel;
        return {
            loadingState: loadingState,
            netFailedProps: {
                buttonText: productStatus === 0 ? '去首页' : '重新加载',
                netFailedInfo: netFailedInfo,
                reloadBtnClick: productStatus === 0 ? this.$navigateBackToHome : requestProductDetail
            }
        };
    };

<<<<<<< HEAD
    componentDidMount() {
    }

=======
>>>>>>> origin/4.25
    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener('willFocus', payload => {
                const { state } = payload;
                if (state && state.routeName === 'product/ProductDetailPage') {
                    this.productDetailModel.requestProductDetail();
                }
            }
        );
    }

    componentWillUnmount() {
        this.productDetailModel.clearTime();
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    //去购物车
    _bottomViewAction = (type) => {
        switch (type) {
            case 'jlj':
                if (!user.isLogin) {
                    Alert.alert('提示', '登录后分享才能获取奖励',
                        [
                            {
                                text: '取消', onPress: () => {
                                    this.shareModal && this.shareModal.open();
                                }
                            },
                            {
                                text: '去登录', onPress: () => {
                                    this.$navigate(RouterMap.LoginPage);
                                }
                            }
                        ]
                    );
                } else {
                    this.shareModal && this.shareModal.open();
                }
                break;
            case 'keFu':
                if (!user.isLogin) {
                    this.$navigate(RouterMap.LoginPage);
                    return;
                }
                track(trackEvent.ClickOnlineCustomerService, { customerServiceModuleSource: 2 });
                const { shopId, title, name, secondName, imgUrl, prodCode, showPrice } = this.productDetailModel;
                QYChatTool.beginQYChat({
                    shopId: shopId,
                    title: title,
                    chatType: beginChatType.BEGIN_FROM_PRODUCT,
                    data: {
                        title: name,
                        desc: secondName,
                        pictureUrlString: imgUrl,
                        urlString: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}`,
                        note: showPrice
                    }
                });
                break;
            case 'buy':
                if (!user.isLogin) {
                    this.$navigate(RouterMap.LoginPage);
                    return;
                }
                this.state.goType = type;
                this.SelectionPage.show(this.productDetailModel, this._selectionViewConfirm);
                break;
            case 'gwc':
                this.state.goType = type;
                this.SelectionPage.show(this.productDetailModel, this._selectionViewConfirm);
                break;
        }
    };

    //选择规格确认
    _selectionViewConfirm = (amount, skuCode) => {
        const { prodCode, name, originalPrice } = this.productDetailModel;
        const { goType } = this.state;
        if (goType === 'gwc') {
            shopCartCacheTool.addGoodItem({
                'amount': amount,
                'skuCode': skuCode,
                'productCode': prodCode
            });
            /*加入购物车埋点*/
            track(trackEvent.AddToShoppingcart, {
                spuCode: prodCode,
                skuCode: skuCode,
                spuName: name,
                pricePerCommodity: originalPrice,
                spuAmount: amount,
                shoppingcartEntrance: 1
            });
        } else if (goType === 'buy') {
            const { type, couponId } = this.params;
            let orderProducts = [{
                skuCode: skuCode,
                quantity: amount,
                productCode: prodCode,
                spuName: name
            }];
            this.$navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 99,
                    orderProducts: orderProducts,
                    source: parseInt(type) === 9 ? 4 : 2,
                    couponsId: parseInt(couponId)
                }
            });
        }
    };

    _renderSectionHeader = ({ section: { key } }) => {
        switch (key) {
            case productItemType.headerView: {
                return null;
            }
            case productItemType.content: {
                return <ContentSectionView/>;
            }
            case productItemType.param: {
                return <SectionLineView/>;
            }
            default: {
                return <SectionNullView/>;
            }
        }
    };

    _renderItem = ({ item, index, section: { key } }) => {
        switch (key) {
            case productItemType.headerView: {
                return <HeaderItemView productDetailModel={this.productDetailModel}
                                       navigation={this.props.navigation}
                                       shopAction={() => {
                                           this.$navigateBackToStore();
                                       }}/>;
            }
            case productItemType.suit: {
                return <SuitItemView productDetailModel={this.productDetailModel}/>;
            }
            case productItemType.promote: {
                return <PromoteItemView productDetailModel={this.productDetailModel}
                                        promotionViewAction={() => {
                                            this.DetailPromoteModal.show(this.productDetailModel);
                                        }}/>;
            }
            case productItemType.service: {
                return <ServiceItemView productDetailModel={this.productDetailModel}
                                        serviceAction={() => {
                                            this.DetailHeaderServiceModal.show(this.productDetailModel);
                                        }}/>;
            }
            case productItemType.param: {
                return <ParamItemView paramAction={() => {
                    this.DetailParamsModal.show(this.productDetailModel);
                }}/>;
            }
            case productItemType.comment: {
                return <DetailHeaderScoreView pData={this.productDetailModel}
                                              navigation={this.props.navigation}/>;
            }
            case productItemType.content: {
                return <ContentItemView item={item}/>;
            }
            case productItemType.priceExplain: {
                return <PriceExplain/>;
            }
            default:
                return null;
        }
    };

    _onScroll = (event) => {
        /*实时透明度*/
        let offsetY = event.nativeEvent.contentOffset.y;
        let opacity = 1;
        if (offsetY < 44) {
            opacity = 0;
        } else if (offsetY < ScreenUtils.autoSizeWidth(375)) {
            opacity = (offsetY - 44) / (ScreenUtils.autoSizeWidth(375) - 44);
        }
        this._refHeader.setNativeProps({
            opacity: opacity
        });

        /*model相关赋值*/
        this.productDetailModel.offsetY = offsetY;
        this.productDetailModel.opacity = opacity;
    };

    _onPressToTop = () => {
        this.SectionList && this.SectionList.scrollToLocation({ sectionIndex: 0, itemIndex: 0 });
    };

    _render() {
        const { productStatus } = this.productDetailModel;
        let dic = this._getPageStateOptions();
        return (
            <View style={styles.container}>
                {dic.loadingState === PageLoadingState.fail ?
                    <NavigatorBar title={productStatus === 0 ? '暂无商品' : '商品详情'} leftPressed={() => {
                        this.$navigateBack();
                    }}/> : null}
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderContent)}
            </View>
        );
    }

    _renderContent = () => {
        const { name, imgUrl, prodCode, originalPrice, groupPrice, v0Price, shareMoney, sectionDataList } = this.productDetailModel;
        return <View style={styles.container}>
            <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
            <ProductDetailNavView productDetailModel={this.productDetailModel}
                                  showAction={() => {
                                      this.shareModal.open();
                                  }}/>
            <SectionList onScroll={this._onScroll}
                         ref={(e) => this.SectionList = e}
                         renderSectionHeader={this._renderSectionHeader}
                         renderItem={this._renderItem}
                         keyExtractor={(item, index) => {
                             return item + index;
                         }}
                         sections={sectionDataList}
                         scrollEventThrottle={10}
                         showsVerticalScrollIndicator={false}/>
            <DetailBottomView bottomViewAction={this._bottomViewAction}
                              pData={this.productDetailModel}/>
            <ShowTopView productDetailModel={this.productDetailModel}
                         toTopAction={this._onPressToTop}/>

            <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            <CommShareModal ref={(ref) => this.shareModal = ref}
                            trackParmas={{
                                spuCode: prodCode,
                                spuName: name
                            }}
                            trackEvent={trackEvent.Share}
                            type={'Image'}
                            imageJson={{
                                imageUrlStr: imgUrl,
                                titleStr: `${name}`,
                                priceStr: `￥${originalPrice}`,
                                retailPrice: `￥${v0Price}`,
                                shareMoney: shareMoney,
                                spellPrice: `￥${groupPrice}`,
                                QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`
                            }}
                            webJson={{
                                title: `${name}`,
                                dec: '商品详情',
                                linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`,
                                thumImage: imgUrl
                            }}
                            miniProgramJson={{
                                title: `${name}`,
                                dec: '商品详情',
                                thumImage: 'logo.png',
                                hdImageURL: imgUrl,
                                linkUrl: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}?upuserid=${user.code || ''}`,
                                miniProgramPath: `/pages/index/index?type=99&id=${prodCode}&inviteId=${user.code || ''}`
                            }}/>
            <DetailNavShowModal ref={(ref) => this.DetailNavShowModal = ref}/>
            <DetailHeaderServiceModal ref={(ref) => this.DetailHeaderServiceModal = ref}/>
            <DetailPromoteModal ref={(ref) => this.DetailPromoteModal = ref}/>
            <DetailParamsModal ref={(ref) => this.DetailParamsModal = ref}/>
        </View>;
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    opacityView: {
        zIndex: 1024,
        height: ScreenUtils.headerHeight, backgroundColor: 'white', opacity: 0,
        position: 'absolute', top: 0, left: 0, right: 0
    }
});

