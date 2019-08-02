import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import BasePage from '../../../BasePage';
// import VideoView from '../../../components/ui/video/VideoView';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
// import StringUtils from '../../../utils/StringUtils';
import { MRText as Text } from '../../../components/ui/UIText';
// import DesignRule from '../../../constants/DesignRule';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import pRes from '../res/product';
import VideoView from '../../../components/ui/video/VideoView';
import DesignRule from '../../../constants/DesignRule';
import MRBannerView from '../../../components/ui/bannerView/MRBannerView';

const { swiper_cancel } = pRes.productScore;


const { width, height } = ScreenUtils;

export default class P_ScoreSwiperPage extends BasePage {
    $navigationBarOptions = {
        show: false
    };

    state = {
        index: this.params.index ? this.params.index + 1 : 1
    };

    _renderViewPageItem = (item) => {
        if (item.videoUrl) {
            return <VideoView videoUrl={item.videoUrl} videoCover={item.videoCover}/>;
        } else {
            return (
                <UIImage style={{ width: width, height: height }} source={{ uri: item }}
                         resizeMode={'contain'}/>
            );
        }
    };

    componentDidMount() {
        setTimeout(() => {
            this.MRBannerView.scrollToIndexWithAnimate(this.params.index, false);
        }, 0);
    }

    _render() {
        const { images, content } = this.params;

        this.videoImageList = [...images];
        //去掉视频
        // if (StringUtils.isNoEmpty(video)) {
        //     this.videoImageList.unshift({ videoUrl: video, videoCover: videoImg });
        // }
        return (
            <View style={styles.containerView}>
                <MRBannerView style={{ height: ScreenUtils.height, width: ScreenUtils.width + 0.5 }}
                              ref={(ref) => {
                                  this.MRBannerView = ref;
                              }}
                              resizeMode='contain'
                              itemWidth={ScreenUtils.width + 0.5}
                              imgUrlArray={this.videoImageList}
                              itemSpace={0}
                              onDidScrollToIndex={(e) => {
                                  let index = e.nativeEvent.index;
                                  this.setState({
                                      index: index + 1
                                  });
                              }}
                              autoLoop={false}
                />
                <View style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    height: 44,
                    top: ScreenUtils.statusBarHeight,
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: DesignRule.textColor_instruction
                    }}>{`${this.state.index}/${this.videoImageList.length}`}</Text>
                </View>

                <View style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 48,
                    width: width,
                    bottom: 0, left: 0, right: 0
                }}>
                    <Text style={{
                        fontSize: 12,
                        marginHorizontal: 15,
                        color: DesignRule.white
                    }}
                          numberOfLines={3}>{content}</Text>

                </View>

                <NoMoreClick style={{
                    position: 'absolute',
                    width: 44,
                    height: 44,
                    top: ScreenUtils.statusBarHeight,
                    left: 14,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onPress={() => {
                    this.$navigateBack();
                }}>
                    <Image source={swiper_cancel}/>
                </NoMoreClick>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)'
    }
});

