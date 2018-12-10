import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image, DeviceEventEmitter
} from 'react-native';
import { observer } from 'mobx-react';
import BasePage from '../../../BasePage';
import CommRegistView from '../components/CommRegistView';
import ScreenUtils from '../../../utils/ScreenUtils';
import LoginApi from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import UserModel from '../../../model/user';
import DeviceInfo from 'react-native-device-info';
import DesignRule from '../../../constants/DesignRule';
import { homeModule } from '../../home/Modules'
import res from '../res';
import JPushUtils from '../../../utils/JPushUtils';

const {
    red_button_s,
    red_button_u,
} = res;
import homeRegisterFirstManager from '../../../pages/home/model/HomeRegisterFirstManager'

/**
 * @author huyufeng
 * @date on 2018/9/7
 * @describe 注册页
 * @org www.sharegoodsmall.com
 * @email huyufeng@meeruu.com
 */
@observer
export default class RegistPage extends BasePage {
    // 导航配置
    $navigationBarOptions = {
        title: '注册'
    };

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            gouxuan: true
        };
    }

    $isMonitorNetworkStatus() {
        return false;
    }

    _render() {
        // 测试环境:https://testh5.sharegoodsmall.com/static/protocol/service.html
        // 预发布环境：https://uath5.sharegoodsmall.com/static/protocol/service.html
        // 生产布环境：https://h5.sharegoodsmall.com/static/protocol/service.html

        const htmlUrl = __DEV__ ?
            'https://uath5.sharegoodsmall.com/static/protocol/service.html'
            :
            'https://uath5.sharegoodsmall.com/static/protocol/service.html';
        return (
            <View style={{
                flex: 1,
                justifyContent: 'space-between'
            }}>
                <CommRegistView
                    // config={viewType:0}
                    viewType={0}
                    phone={this.params.phone ? this.params.phone : ''}
                    loginClick={(phone, code, password) => this.clickNext(phone, code, password)}
                    ref={'topView'}
                />
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    height: 80,
                    width: ScreenUtils.width
                }}>
                    <TouchableOpacity onPress={() => {
                        this.refs.topView.changeSelectState();
                        this.setState({
                            gouxuan: !this.state.gouxuan
                        });
                    }}>
                        <Image
                            source={this.state.gouxuan ? red_button_s : red_button_u}
                            style={{ width: 11, height: 11, marginRight: 5 }}/>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, color: DesignRule.textColor_secondTitle }}>
                        阅读并接受
                    </Text>
                    <TouchableOpacity onPress={() => {
                        this.$navigate('HtmlPage', {
                            title: '用户协议内容',
                            uri: 'https://reg.163.com/agreement_mobile_ysbh_wap.shtml?v=20171127'
                        });
                    }}>
                        <Text style={{ color: DesignRule.mainColor, fontSize: 11 }}
                              onPress={() => {
                                  this.$navigate('HtmlPage', {
                                      title: '用户协议内容',
                                      uri: htmlUrl
                                  });
                              }}
                        >
                            《用户协议》
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    //点击下一步
    clickNext = (phone, code, password) => {
        if (!this.state.gouxuan) {
            bridge.$toast('请先勾选用户协议');
            return;
        }
        console.log(this.params);
        this.$loadingShow();
        LoginApi.findMemberByPhone({
            code: code,
            device: this.params.device ? this.params.device : '',
            inviteId: '',//邀请id
            openid: this.params.openid ? this.params.openid : '',
            password: password,
            phone: phone,
            systemVersion: this.params.systemVersion ? this.params.systemVersion : '',
            wechatVersion: '',
            nickname: this.params.nickName,
            headImg: this.params.headerImg ? this.params.headerImg : ''
        }).then((data) => {

            if (data.code === 10000) {
                homeRegisterFirstManager.setJustRegistered(true);
                this.toLogin(phone, code, password);
            } else {
                bridge.$toast(data.msg);
            }
            this.$loadingDismiss();
            // bridge.$toast(data.msg);
        }).catch((response) => {
            this.$loadingDismiss();
            bridge.$toast(response.msg);
        });

    };
    toLogin = (phone, code, password) => {
        LoginApi.passwordLogin({
            authcode: '22',
            code: '',
            device: '44',
            password: password,
            phone: phone,
            systemVersion: DeviceInfo.getSystemVersion(),
            username: '',
            wechatCode: '',
            wechatVersion: ''
        }).then((data) => {
            this.$loadingDismiss();
            UserModel.saveUserInfo(data.data);
            UserModel.saveToken(data.data.token);
            DeviceEventEmitter.emit('homePage_message',null);
            DeviceEventEmitter.emit('contentViewed',null);
            homeModule.loadHomeList()
            // this.$navigate('login/login/GetRedpacketPage');
            bridge.setCookies(data.data);
            //推送
            JPushUtils.updatePushTags(); JPushUtils.updatePushAlias();
            /**
             * 跳转导师选择页面
             */
            this.$navigate('login/login/SelectMentorPage');
        }).catch((data) => {
            this.$loadingDismiss();
            bridge.$toast(data.msg);
        });
    };
}

