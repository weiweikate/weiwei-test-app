import React, { Component } from 'react';
import LoginTopView from '../components/LoginTopView';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import loginAndRegistRes from '../res/LoginAndRegistRes';
import ScreenUtils from '../../../utils/ScreenUtils';
import ColorUtil from '../../../utils/ColorUtil';

export default class LoginPage extends Component {
    constructor() {
        super();
    }

    /*页面配置*/
    static $PageOptions = {
        navigationBarOptions: {
            title: null
            // show: false // 是否显示导航条 默认显示
        },
        renderByPageState: false
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.registBtnClick}>
                注册
            </Text>
        );
    };

    render() {
        return (
            <View style={Styles.contentStyle}>
                <LoginTopView
                    oldUserLoginClick={this.oldUserLoginClick.bind(this)}
                    forgetPasswordClick={this.forgetPasswordClick}
                />
                <View style={Styles.otherLoginBgStyle}>
                    <View style={Styles.lineBgStyle}>
                        <CommSpaceLine style={{ marginTop: 7, width: 80, marginLeft: 5 }}/>
                        <Text style={Styles.otherLoginTextStyle}>
                            其他登陆方式
                        </Text>
                        <CommSpaceLine style={{ marginTop: 7, width: 80, marginLeft: 5 }}/>
                    </View>
                    <View style={{
                        marginLeft: 0,
                        marginRight: 0,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={this.weChatLoginClick}>
                            <Image style={{ width: 50, height: 50 }} source={loginAndRegistRes.weixinImage}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <Image
                    style={{
                        width: ScreenUtils.width,
                        position: 'absolute',
                        bottom: 0,
                        height: 80
                    }}
                    source={loginAndRegistRes.loginBottomImage}
                    resizeMode='cover'/>
            </View>
        );
    }

    /*忘记密码*/
    forgetPasswordClick = () => {
        this.$navigate('login/login/ForgetPasswordPage');
    };
    /*微信登陆*/
    weChatLoginClick = () => {

    };
    /*老用户登陆*/
    oldUserLoginClick = () => {
        this.props.navigation.navigate('login/login/OldUserLoginPage');
    };
    /*注册*/
    registBtnClick = () => {
        this.$navigate('login/login/RegistPage');
    };
}

const Styles = StyleSheet.create(
    {
        contentStyle: {
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: '#fff'
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: '#666'
        },
        otherLoginBgStyle: {
            left: 30,
            position: 'absolute',
            bottom: 10,
            height: 170

        },
        lineBgStyle: {
            marginLeft: 30,
            marginRight: 30,
            flexDirection: 'row',
            height: 30,
            backgroundColor: '#fff',
            justifyContent: 'center'
        },
        otherLoginTextStyle: {
            color: ColorUtil.Color_666666
        }
    }
);

