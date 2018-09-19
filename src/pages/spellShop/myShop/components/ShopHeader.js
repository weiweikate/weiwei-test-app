/**
 * 我的店铺-店铺头
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    Dimensions,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import storeModel from '../../model/storeModel';

const SCREEN_WIDTH = Dimensions.get('window').width;
const headerWidth = 65 / 375 * SCREEN_WIDTH;
import HeaderBarBgImg from '../res/txbg_02.png';
import WhiteBtImg from '../res/dz_03-02.png';
import RingImg from '../res/headBg.png';
import StarImg from '../res/dj_03.png';
import CCZImg from '../res/ccz_03.png';
import ProgressImg from '../res/jdt_05.png';

export default class ShopHeader extends Component {

    static propTypes = {
        onPressShopAnnouncement: PropTypes.func//点击公告
    };


    render() {

        const progress = (storeModel.storeBonusDto.storeThisTimeBonus || 0) / (storeModel.store.groupMoney || 0) || 0;
        const marginLeft = 315 / 375 * SCREEN_WIDTH * progress;

        const radius = marginLeft > 4 ? 0 : 4;

        const storeStar = storeModel.storeStar;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        //店铺尚未分红的钱-new  storeThisTimeBonus
        const gap = (storeModel.store.groupMoney || 0) - (storeModel.storeBonusDto.storeThisTimeBonus || 0);

        return <View style={styles.container}>
            <ImageBackground source={HeaderBarBgImg} style={styles.imgBg}>
                <ImageBackground source={RingImg}
                                 style={styles.headerBg}>
                    {
                        storeModel.store.headUrl ? <Image style={styles.headerImg}
                                                          source={{ uri: storeModel.store.headUrl }}/> : null
                    }
                </ImageBackground>
                <View style={styles.shopInContainer}>
                    <Text style={styles.shopName}>{storeModel.store.name || ''}</Text>
                    <Text style={styles.shopId}>ID：{storeModel.store.id || ''}</Text>
                    <View style={styles.starRow}>
                        <Text style={styles.shopName}>店铺星级：</Text>
                        {
                            starsArr.map((item, index) => {
                                return <Image key={index} source={StarImg}/>;
                            })
                        }
                    </View>
                </View>
                <TouchableOpacity onPress={this.props.onPressShopAnnouncement} style={styles.announcementContainer}>
                    <Text style={styles.announcementTitle}>查看公告</Text>
                </TouchableOpacity>
            </ImageBackground>

            <ImageBackground source={WhiteBtImg} style={styles.whiteBg}>
                <View style={styles.whiteBgTopRow}>
                    <Image source={CCZImg} style={styles.whiteBgTopRowIcon}/>
                    <Text style={styles.chengzhangzhi}>成长值</Text>
                    <Text style={styles.gongxian}>
                        (贡献度：{`${((storeModel.storeBonusDto.dealerThisTimeBonus || 0) / (storeModel.storeBonusDto.storeThisTimeBonus || 0) * 100 || 0).toFixed(2)}`}%)
                    </Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.progress}>{storeModel.storeBonusDto.storeThisTimeBonus || 0}<Text style={{
                        color: '#666666'
                    }}>
                        /{storeModel.store.groupMoney || 0}
                    </Text></Text>

                    <ImageBackground source={ProgressImg} style={{
                        overflow: 'hidden',
                        marginTop: 5,
                        height: 8,
                        width: 315 / 375 * SCREEN_WIDTH
                    }}>
                        <View style={[styles.progressBg, {
                            marginLeft: marginLeft,
                            borderBottomLeftRadius: radius,
                            borderTopLeftRadius: radius
                        }]}/>
                    </ImageBackground>

                    <Text style={styles.chaju}>距离分红还差<Text style={{
                        color: '#000',
                        fontSize: 15
                    }}>
                        {gap}
                    </Text>元</Text>


                    <Text style={styles.fenghong}>预计该次分红金可得<Text style={{ color: 'rgb(236,10,10)' }}>
                        {storeModel.storeBonusDto.dealerThisTimeBonus || 0}
                    </Text>元</Text>

                </View>
            </ImageBackground>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        height: 182 / 375 * SCREEN_WIDTH + 115
    },
    imgBg: {
        width: SCREEN_WIDTH,
        height: 182 / 375 * SCREEN_WIDTH,
        flexDirection: 'row'
    },
    headerBg: {
        marginTop: 16,
        marginLeft: 16,
        marginRight: 23,
        width: 105 / 375 * SCREEN_WIDTH,
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerImg: {
        width: headerWidth,
        height: headerWidth,
        borderRadius: headerWidth / 2
    },
    shopInContainer: {
        marginTop: 16,
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center'
    },
    shopName: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#ffffff'
    },
    shopId: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#ffffff',
        marginVertical: 12
    },

    whiteBg: {
        width: SCREEN_WIDTH - 22,
        height: 153 / 375 * (SCREEN_WIDTH - 22),
        position: 'absolute',
        bottom: 11,
        left: 11,
        backgroundColor: 'transparent',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        overflow: 'hidden',
        shadowRadius: 10,
        shadowOpacity: 1,
        borderRadius: 12
    },
    whiteBgTopRow: {
        height: 43,
        marginHorizontal: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    whiteBgTopRowIcon: {
        marginLeft: 17,
        marginRight: 6
    },
    chengzhangzhi: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#000000'
    },
    gongxian: {
        marginLeft: 3,
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#e60012'
    },
    //0/10000
    progress: {
        marginTop: 10,
        color: '#e60012',
        fontSize: 10,
        fontFamily: 'PingFang-SC-Medium'
    },
    progressBg: {
        marginRight: -1,
        height: 8.5,
        borderRadius: 4.25,
        backgroundColor: '#dddddd'
    },
    chaju: {
        marginTop: 10,
        color: '#222222',
        fontSize: 11,
        fontFamily: 'PingFang-SC-Medium'
    },
    fenghong: {
        marginTop: 5,
        color: 'rgb(34,34,34)',
        fontSize: 12,
        fontFamily: 'PingFang-SC-Medium'
    },
    // 公告
    announcementContainer: {
        position: 'absolute',
        top: 13,
        right: 17,
        width: 55,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    announcementTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 10,
        color: '#ffffff'
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

