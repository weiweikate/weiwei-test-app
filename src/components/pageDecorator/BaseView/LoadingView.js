/**
 * 后期可根据项目中使用的
 * loading展示页面
 * 使用示例：
 * <LoadingView style={'这里是style，可以自定义'}/>
 * <LoadingView style={'这里是style，可以自定义'} source={GifImg} imgStyle={{width: 100, height: 100}}/>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    ActivityIndicator, Easing, Animated
} from 'react-native';
import DesignRule from 'DesignRule';
import res from '../../../comm/res/other/loading_bar.png';

const { loading_bar } = res;

export default class LoadingView extends Component {

    static propTypes = {
        style: PropTypes.any,    // 样式
        source: PropTypes.any,   // loading-gif动图图片
        imgStyle: PropTypes.any // gif样式
    };

    constructor(props) {
        super(props);
        this.state = {
            rotateValue: new Animated.Value(0)
        };
    }

    componentDidMount() {
        this.startLoading();
    }


    // 渲染Gif图片或者系统自带的loading图片
    _renderLoading = (source, imgStyle) => {
        if (source) {
            return (<Image style={imgStyle} source={source}/>);
        } else {
            // return (<ActivityIndicator
            //     animating={true}
            //     color={'gray'}
            //     size={'small'}
            // />);
            return (<Image style={{ width: 100, height: 100, backgroundColor: 'red' }} source={loading_bar}/>);
        }
    };

    // 开始动画
    startLoading = () => {
        const animate = Animated.timing(this.state.rotateValue, {
            toValue: 1,      //角度从0变1
            duration: 1000,  //从0到1的时间
            easing: Easing.linear
        });

        Animated.loop(animate, { useNativeDriver: true }).start();
        // this.state.rotateValue.setValue(0);//首先至为0位置
        // Animated.parallel([
        //     Animated.timing(this.state.rotateValue, {
        //         toValue: 1,      //角度从0变1
        //         duration: 700,  //从0到1的时间
        //         easing: Easing.out(Easing.linear),//线性变化，匀速旋转
        //     }),
        // ]).start();
    };

    judgeWhetherReload = () => {
        this.startLoading();
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{width:70,height:70,borderRadius:5,backgroundColor:'rgba(0,0,0,1)',justifyContent:'center',alignItems:'center'}}>
                    <Animated.Image style={{
                        width: 54,
                        height: 54,
                        transform: [{
                            rotateZ: this.state.rotateValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })
                        }]
                    }} source={res}/>
                </View>
            </View>);
        const {
            style,
            source,
            imgStyle
        } = this.props;
        return (<View style={[styles.container, style]}>
            {/*{this._renderLoading(source,imgStyle)}*/}
            {/*<Image style={{width:100,height:100}} source={res}/>*/}
            (<Animated.Image style={{
            transform: [{
                rotateZ: this.state.rotateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                })
            }]
        }} source={res}/>);
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.bgColor
    }
});

