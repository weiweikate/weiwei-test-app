/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/10/18.
 *
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText,
} from "../../../components/ui";
import CommShareModal from '../../../comm/components/CommShareModal'
import ScreenUtils from '../../../utils/ScreenUtils'

type Props = {};
export default class ShareTaskIntroducePage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: '任务说明',
        show: true// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
    }

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <UIText value = {'任务说明'} style = {styles.title}/>
                    <UIText value = {'他当时发送到发'} style = {styles.title}/>
                    <Image source = {{uri: 'http://e.hiphotos.baidu.com/zhidao/pic/item/00e93901213fb80eff53acbe34d12f2eb83894dd.jpg'}}
                           style = {styles.image}
                    />
                </ScrollView>
                <TouchableWithoutFeedback onPress = {() => {this.shareModal.open()}}>
                    <View style = {{backgroundColor: '#D51243', height: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <UIText value = {'分享好友帮你点击'} style = {{color: '#FFFFFF', fontSize: 16}}/>
                    </View>
                </TouchableWithoutFeedback>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                webJson={{
                                    title: '分享标题(当为图文分享时候使用)',
                                    dec: '内容(当为图文分享时候使用)',
                                    linkUrl: 'http://testh5.sharegoodsmall.com/#/register',
                                    thumImage: 'logo.png'
                                }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 13,
        color: '#222222',
        marginHorizontal: 15,
        marginTop: 10
    },
    detail: {
        fontSize: 12,
        color: '#222222',
        marginHorizontal: 15,
        marginTop: 10
    },
    image: {
        marginHorizontal: 15,
        marginTop: 15,
        height: ScreenUtils.autoSizeWidth(460),
    }

});
