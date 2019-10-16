import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { MRText } from '../../../../components/ui';
import UIImage from '@mr/image-placeholder';
import DesignRule from '../../../../constants/DesignRule';
import shopRes from '../../res';
import LinearGradient from 'react-native-linear-gradient';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import RouterMap, { routePush } from '../../../../navigation/RouterMap';
import { homeModule } from '../../../home/model/Modules';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import CommShareModal from '../../../../comm/components/CommShareModal';
import user from '../../../../model/user';
import apiEnvironment from '../../../../api/ApiEnvironment';
import spellStatusModel from '../../SpellStatusModel';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';

const { myShop } = shopRes;
const { shopProduct, shopProductShare, shop_card, xjt_03, tutor } = myShop;

const { px2dp, width } = ScreenUtils;
const itemImgSize = px2dp(100);
const progressWidth = px2dp(60);

@observer
export class ShopProductItemView extends Component {

    state = {
        selectedItem: {}
    };

    _renderItem = ({ item, index }) => {
        const { image, title, content, shareMoney, promotionMinPrice, price, progressBar, salesVolume, linkTypeCode, linkType } = item || {};
        /*进度条显示*/
        let salesVolumeS = (salesVolume || 0) / 100;
        if (salesVolumeS > 1) {
            salesVolumeS = 1;
        }
        salesVolumeS = salesVolumeS * progressWidth;
        if (salesVolumeS < 10) {
            salesVolumeS = 10;
        }
        /*钱显示*/
        let shareMoneyS = (shareMoney && shareMoney !== '?') ? `${shareMoney.split('-').shift()}` : null;
        if (shareMoneyS == 0) {
            shareMoneyS = null;
        }
        const { MyShopDetailModel } = this.props;
        const { productList } = MyShopDetailModel;
        return (
            <NoMoreClick
                style={[ProductItemViewStyles.itemView, {
                    marginLeft: index === 0 ? 15 : 10,
                    marginRight: (productList.length - 1 === index) ? 15 : 0
                }]}
                onPress={
                    () => {
                        if (!spellStatusModel.storeCode) {
                            bridge.$toast('只有拼店用户才能进行分享操作哦~');
                            return;
                        }
                        const router = homeModule.homeNavigate(linkType, linkTypeCode);
                        let params = homeModule.paramsNavigate(item);
                        if (router) {
                            routePush(router, params);
                        }
                    }
                }>
                <UIImage source={{ uri: image || '' }}
                         style={ProductItemViewStyles.itemImg}>
                    <LinearGradient style={ProductItemViewStyles.LinearGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        {shareMoneyS ? <MRText
                            style={ProductItemViewStyles.LinearGradientText}>赚{shareMoneyS}</MRText> : null}
                    </LinearGradient>
                </UIImage>
                <MRText style={ProductItemViewStyles.itemTittle}
                        numberOfLines={1}>{title || ''}</MRText>
                <MRText style={ProductItemViewStyles.itemSubTittle}
                        numberOfLines={1}>{content || ''}</MRText>
                <View style={ProductItemViewStyles.bottomView}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MRText style={{ fontSize: 10, color: DesignRule.mainColor, paddingTop: 1 }}>¥</MRText>
                            <MRText style={ProductItemViewStyles.itemPrice}
                                    numberOfLines={1}>{promotionMinPrice || price || ''}</MRText>
                        </View>
                        {progressBar === 1 && <View style={ProductItemViewStyles.progressBgView}>
                            <LinearGradient
                                style={[ProductItemViewStyles.progressView, { width: salesVolumeS }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FC5D39', '#FF0050']}/>
                            <View style={ProductItemViewStyles.progressTextView}>
                                <MRText style={ProductItemViewStyles.progressText}>{salesVolume || 0}%</MRText>
                            </View>
                        </View>}
                    </View>
                    <NoMoreClick onPress={() => {
                        if (!spellStatusModel.storeCode) {
                            bridge.$toast('只有拼店用户才能进行分享操作哦~');
                            return;
                        }
                        this.setState({
                            selectedItem: item
                        }, () => {
                            this.shareModal.open();
                        });
                    }}>
                        <Image style={ProductItemViewStyles.shareImg} source={shopProductShare}/>
                    </NoMoreClick>
                </View>
            </NoMoreClick>
        );
    };
    _keyExtractor = (item, index) => {
        return item + index;
    };

    render() {
        const { image, title, linkTypeCode, linkType, shareMoney } = this.state.selectedItem || {};
        const { MyShopDetailModel } = this.props;
        const { productList } = MyShopDetailModel;
        console.log(linkTypeCode);
        if (!productList || productList.length === 0) {
            return null;
        }
        let linkUrl = `${apiEnvironment.getCurrentH5Url()}/product/99/${linkTypeCode}?upuserid=${user.code || ''}`;
        if (linkType === 5) {
            linkUrl = `${apiEnvironment.getCurrentH5Url()}/product/3/${linkTypeCode}?upuserid=${user.code || ''}`;
        }

        return (
            <View style={ProductItemViewStyles.container}>
                <View style={ProductItemViewStyles.headerView}>
                    <Image style={ProductItemViewStyles.headerImg} source={shopProduct}/>
                    <MRText style={ProductItemViewStyles.headerText}>推荐商品</MRText>
                </View>
                <FlatList data={productList}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}/>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'miniProgramWithCopyUrl'}
                                imageJson={{
                                    shareMoney: shareMoney
                                }}
                                webJson={{
                                    title: title,
                                    dec: '商品详情',
                                    linkUrl: linkUrl,
                                    thumImage: image
                                }}/>
            </View>
        );
    }
}

const ProductItemViewStyles = StyleSheet.create({
    container: {
        marginBottom: 10
    },
    /*标题*/
    headerView: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 25, marginBottom: 10
    },
    headerImg: {
        marginRight: 6,
        width: 14, height: 14
    },
    headerText: {
        fontSize: 14, color: DesignRule.textColor_mainTitle
    },

    /*item*/
    itemView: {
        backgroundColor: 'white', width: itemImgSize, borderRadius: 5, overflow: 'hidden'
    },
    itemImg: {
        height: itemImgSize, width: itemImgSize, alignItems: 'flex-end', justifyContent: 'flex-end'
    },
    LinearGradient: {
        marginRight: 3,
        borderRadius: 2
    },
    LinearGradientText: {
        padding: 2,
        fontSize: 10, color: DesignRule.white
    },

    itemTittle: {
        paddingTop: 7, paddingHorizontal: 5,
        fontSize: 12, color: DesignRule.textColor_mainTitle
    },
    itemSubTittle: {
        paddingTop: 1.5, paddingHorizontal: 5,
        fontSize: 10, color: DesignRule.textColor_instruction
    },

    bottomView: {
        height: 37, marginHorizontal: 5,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },

    itemPrice: {
        fontSize: 12, color: DesignRule.mainColor, fontWeight: '600'
    },
    /*进度条*/
    progressBgView: {
        backgroundColor: '#FFCCDC', borderRadius: 5, width: progressWidth, height: 10
    },
    progressView: {
        backgroundColor: DesignRule.mainColor, borderRadius: 5, height: 10
    },
    progressTextView: {
        justifyContent: 'center',
        position: 'absolute', top: 0, bottom: 0, left: 5, right: 0
    },
    progressText: {
        fontSize: 8, color: DesignRule.textColor_white
    },

    shareImg: {
        marginRight: 9,
        width: 16, height: 16
    }
});

export class ShopCardView extends React.Component {
    _cardAction = () => {
        routePush(RouterMap.HtmlPage, {
            uri: `${apiEnvironment.getCurrentH5Url()}/activity/millions`
        });
    };

    render() {
        return (
            <NoMoreClick style={cardStyles.container} onPress={this._cardAction}>
                <Image source={shop_card} style={cardStyles.image}/>
            </NoMoreClick>
        );
    }
}

const cardStyles = StyleSheet.create({
    container: {
        marginBottom: 15
    },
    image: {
        height: px2dp(80), width: width
    }
});

@observer
export class RoleTypeView extends Component {

    onPress = (item) => {
        const { MyShopDetailModel } = this.props;
        const { storeCode } = MyShopDetailModel.storeData;
        const { roleType, userCode } = item;
        if (roleType === 0) {
            //跳店长主页 优先
            routePush('store/myShop/ShopAssistantDetailPage', { userCode, storeCode });
        } else {
            //跳导师主页
            const uri = apiEnvironment.getCurrentH5Url() + `/spellStore/tutor/homepage/${userCode}`;
            routePush(RouterMap.HtmlPage, {
                uri: uri
            });
        }
    };

    renderItem = (item, index) => {
        const { MyShopDetailModel } = this.props;
        const roleTypeStore = MyShopDetailModel.storeData.roleType;
        const { headImg, nickName, sign, tutorStatus, roleType } = item;
        return (
            <NoMoreClick style={stylesRole.itemContainer} key={index} onPress={() => this.onPress(item)}
                         disabled={roleTypeStore !== 0}>
                <View style={stylesRole.leftView}>
                    <UIImage style={stylesRole.image} isAvatar={true} source={{ uri: headImg }}/>
                    <View style={{ flex: 1 }}>
                        <MRText style={stylesRole.nameText} numberOfLines={1}>{nickName}</MRText>
                        {StringUtils.isNoEmpty(sign) &&
                        <MRText style={stylesRole.desText} numberOfLines={2}>{sign}</MRText>}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {roleType === 0 &&
                    <LinearGradient style={stylesRole.roleView}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FFCB02', '#FF9502']}>
                        <MRText style={stylesRole.roleText}>店主</MRText>
                    </LinearGradient>}
                    {tutorStatus === 1 &&
                    <LinearGradient style={stylesRole.roleView}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <MRText style={stylesRole.roleText}>导师</MRText>
                    </LinearGradient>}
                    {roleTypeStore === 0 && <Image source={xjt_03} style={{ width: 14, height: 14, marginRight: 15 }}/>}
                </View>
            </NoMoreClick>
        );
    };

    render() {
        const { MyShopDetailModel } = this.props;
        const { storeManagers } = MyShopDetailModel;
        if (storeManagers && storeManagers.length > 0) {
            return (
                <View>
                    <View style={stylesRole.topView}>
                        <Image source={tutor} style={stylesRole.topImg}/>
                        <MRText style={{ fontSize: 14, color: DesignRule.textColor_mainTitle }}>管理团队</MRText>
                    </View>
                    {
                        storeManagers.map((item, index) => {
                            return this.renderItem(item, index);
                        })
                    }
                </View>
            );
        } else {
            return null;
        }
    }
}

const stylesRole = StyleSheet.create({
    topView: {
        flexDirection: 'row', alignItems: 'center', height: 40
    },
    topImg: {
        width: 13, height: 13, marginLeft: 25, marginRight: 5
    },
    itemContainer: {
        marginHorizontal: 15, backgroundColor: 'white', marginBottom: 10, flexDirection: 'row',
        borderRadius: 10, alignItems: 'center'
    },
    leftView: {
        flexDirection: 'row', alignItems: 'center', flex: 1, marginVertical: 15
    },
    image: {
        height: 50, width: 50, borderRadius: 25, overflow: 'hidden', marginLeft: 15, marginRight: 10
    },
    nameText: {
        fontSize: 15, color: DesignRule.textColor_mainTitle
    },
    desText: {
        fontSize: 13, color: DesignRule.textColor_secondTitle, marginTop: 5
    },
    roleView: {
        alignItems: 'center', justifyContent: 'center', width: 45, height: 24, borderRadius: 12, marginRight: 13
    },
    roleText: {
        fontSize: 13, color: 'white'
    }
});
