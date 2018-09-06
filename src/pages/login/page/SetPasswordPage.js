import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import ColorUtil from '../../../utils/ColorUtil';
import ScreenUtils from '../../../utils/ScreenUtils';

class SetPasswordModel {
    @observable
    phoneNumber = '';
    @observable
    password = '';
    @observable
    isSecuret = true;
    @observable
    vertifyCode = '';

    @action
    savePassword(password) {
        if (!password) {
            return;
        }
        this.password = password;
    }

    @action
    saveVertifyCode(vertifyCode) {
        if (!vertifyCode) {
            return;
        }
        this.vertifyCode = vertifyCode;
    }


    @computed
    get isCanClick() {
        if (this.phoneNumber.length === 11 && this.vertifyCode.length > 0 && this.password.length >= 6) {
            return true;
        } else {
            return false;
        }
    }

}

@observer
export default class SetPasswordPage extends Component {
    setPasswordModel = new SetPasswordModel();
    // 页面配置
    static $PageOptions = {
        navigationBarOptions: {
            title: '设置账号及密码',
            show: true
            // show: false // 是否显示导航条 默认显示
        },
        renderByPageState: false
    };

    render() {
        return (
            <View style={{ backgroundColor: '#eee' }}>
                <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                    <View style={{ marginLeft: 30, marginRight: 30, marginTop: 60, flexDirection: 'row' }}>
                        <Text style={{ marginRight: 20 }}>
                            新手机
                        </Text>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.setPasswordModel.phoneNumber}
                            // onChangeText={text => {this.oldUserLoginModel.phoneNumber = text}})}
                            placeholder='请输入手机号'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                        />

                    </View>
                    <CommSpaceLine style={[Styles.lineStyle, { marginLeft: 30, marginRight: 30 }]}/>


                    <View style={{ marginTop: 40, height: 40, marginLeft: 30, marginRight: 30 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ marginRight: 20 }}>
                                    验证码
                                </Text>
                                <TextInput
                                    style={Styles.inputTextStyle}
                                    value={this.setPasswordModel.phoneNumber}
                                    // onChangeText={text => {this..phoneNumber = text}})}
                                    placeholder='请输入密码'
                                    underlineColorAndroid={'transparent'}
                                    keyboardType='default'
                                    secureTextEntry={this.setPasswordModel.isSecuret}
                                />
                            </View>
                            <TouchableOpacity onPress={() => {
                                this.setPasswordModel.isSecuret = !this.setPasswordModel.isSecuret;
                            }}>
                                <Text style={{ color: ColorUtil.mainRedColor }}>
                                    获取验证码
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/*下部输入框*/}
                <View style={{
                    marginTop: 30,
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    height: 50,
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginLeft: 30, marginRight: 30, marginTop: 18 }}>
                            新密码
                        </Text>
                        <TextInput
                            style={Styles.inputTextStyle}
                            value={this.setPasswordModel.phoneNumber}
                            // onChangeText={text => {this.oldUserLoginModel.phoneNumber = text}})}
                            placeholder='支持数字,字母,特殊符号'
                            underlineColorAndroid={'transparent'}
                            keyboardType='default'
                        />
                    </View>

                    <TouchableOpacity onPress={() => {
                        this.setPasswordModel.isSecuret = !this.setPasswordModel.isSecuret;
                    }}>
                        <Image
                            source={this.setPasswordModel.isSecuret ? LoginAndRegistRes.closeEyeImage : LoginAndRegistRes.openEyeImage}
                            style={{ marginRight: 30, marginTop: 18 }}/>

                    </TouchableOpacity>

                </View>

                <View style={[{
                    marginLeft: 30, width: ScreenUtils.width - 60, marginTop: 40, height: 45, borderRadius: 5,
                    backgroundColor: ColorUtil.mainRedColor
                }, this.setPasswordModel.isCanClick ? { opacity: 1 } : { opacity: 0.5 }]}>
                    <TouchableOpacity onPress={this.loginClick}>
                        <Text style={{
                            textAlign: 'center',
                            height: 45,
                            alignItems: 'center',
                            fontsize: 14,
                            color: '#fff',
                            paddingTop: 15,
                            fontWeight: '600'
                        }}>
                            下一步
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    loginClick = () => {

        this.setPasswordModel.phoneNumber = '333';
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
            marginBottom: -20,
            height: 200

        },
        lineBgStyle: {
            marginLeft: 30,
            marginRight: 30,
            flexDirection: 'row',
            height: 30,
            backgroundColor: '#fff',
            justifyContent: 'center'
        },
        lineStyle: {
            marginTop: 5
        }
    }
);

