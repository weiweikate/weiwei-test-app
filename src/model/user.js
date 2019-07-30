import store from '@mr/rn-store';
import { action, computed, observable, autorun } from 'mobx';
import shopCartCacheTool from '../pages/shopCart/model/ShopCartCacheTool';
import UserApi from './userApi';
import bridge from '../utils/bridge';
import { QYChatTool } from '../utils/QYModule/QYChatTool';
import { login, logout } from '../utils/SensorsTrack';
import StringUtils from '../utils/StringUtils';
import JPushUtils from '../utils/JPushUtils';
import { mediatorCallFunc } from '../SGMediator';


const USERINFOCACHEKEY = '@mr/userInfo';
const CARTDATA = '@mr/cartData';
const USERTOKEN = '@mr/userToken';

class User {

    @computed
    get isLogin() {
        return StringUtils.isNoEmpty(this.token);
    }

    @computed
    get isRealNameRegistration() {

        return (this.realnameStatus + '') === '1';
    }

    @computed
    get userLevelNumber() {
        return this.levelRemark;
    }

    @observable info = null;
    @observable
    unionid = null;
    @observable
    id = 0;                 //用户id
    @observable
    code = null;            //授权码
    @observable
    openid = null;          //
    @observable
    nickname = '';          //昵称
    @observable
    wechatId = '';          //微信号id
    @observable
    wechatName = '';          //微信用户名称
    @observable
    phone = 0;           //手机号
    @observable
    realname = null;        //真实姓名
    @observable
    headImg = '';         //头像
    @observable
    idcard = null;          //身份证号码
    @observable
    address = null;         //详细地址
    @observable
    device = null;          //最后登录_手机型号
    @observable
    systemVersion = null;   //最后登录_系统型号
    @observable
    wechatVersion = null;   //微信版本
    @observable
    wechatArea = null;      //微信授权获取区域
    @observable
    regTime = null;         //注册时间
    @observable
    shareGoodsAge = null;   //秀龄
    @observable
    lastLoginTime = null;   //最后登录时间
    @observable
    inviteId = null;        //邀请码
    @observable
    provinceId = null;      //省
    @observable
    cityId = null;          //
    @observable
    areaId = null;          //
    @observable
    status = 0;             //状态 0 未激活 1 已激活 numebr
    @observable
    updateAdmin = null;     //修改人
    @observable
    hadSalePassword = false;     // 是否设置过交易密码
    @observable
    updateTime = null;      //修改时间
    @observable
    levelId = null;         //用户等级层级 number
    @observable
    levelRemark = null;
    @observable
    dType = null;           //经销商类型
    @observable
    auzBeginTime = null;    //授权开始时间
    @observable
    auzEndTime = null;      //授权结束时间
    @observable
    upDealerid = null;      //上级
    @observable
    availableBalance = null;//可提现金额
    @observable
    totalBalance = null;      // 余额加待提现余额
    @observable
    historicalBalance = null;  //总金额
    @observable
    blockedBalance = null; //冻结金额
    @observable
    couponCount = null;  // * 一元券加优惠券数量
    @observable
    tokenCoin = null;       //一元券数量
    @observable
    blockedTokenCoin = null;       //待激活一元券数量
    @observable
    blockedCoin = null;     //冻结代币
    @observable
    userScore = null;       //积分
    @observable
    totalScore = null;       //秀豆加待提现秀豆
    @observable
    historicalScore = null;  //总秀豆积分
    @observable
    blockedUserScore = null; //待入账秀豆积分
    @observable
    password = null;        //密码
    @observable
    salt = null;            //加密盐
    @observable
    encryptionCount = 0;    //加密次数
    @observable
    pickedUp = null;        //
    @observable
    storeCode = null;         //
    @observable
    storeStatus = null;         //
    @observable
    roleType = null;        //
    @observable
    level = null;           //
    @observable
    levelName = null;       //
    @observable
    experience = 0;          //会员经验
    @observable
    salePsw = null;         //
    @observable
    salePswSalt = null;     //
    @observable
    salePswEncryption = null;//
    @observable
    province = null;        //
    @observable
    city = null;            //
    @observable
    area = null;            //
    @observable
    storeBonusDto = null;   //
    @observable
    realnameStatus = 0;   //0:待审核 1:已通过 2: 未通过

    @observable
    cartData = [];   //存储离线购物车信息

    @observable
    toLogin = true;   //是否跳转到LoginPage

    @observable
    needWaiting = false;   //提供BasePage中repeatClick()

    @observable
    token = '';

    @observable
    upUserCode = null;


    @observable
    levelFloor = null;

    @observable
    levelCeil = null;

    @observable
    profile = null;

    @observable
    upCode = null;

    @observable
    finishGuide = false;

    //用户靓号
    @observable
    perfectNumberCode = null;

    //用户微信号
    @observable
    weChatNumber = null;

    // 全局记录商品详情页是否是首次加载
    isProdFirstLoad = true;

    @action getToken = () => {
        if (this.token) {
            return Promise.resolve(this.token);
        } else {
            return store.get(USERTOKEN).then(token => {
                this.token = token;
                store.save(USERTOKEN, token);
                return Promise.resolve(token);
            });
        }
    };

    // 从缓存磁盘读取用户上一次使用的信息记录
    readUserInfoFromDisk() {
        store.get(USERINFOCACHEKEY).then((infoStr) => {
            if (infoStr) {
                this.saveUserInfo(infoStr, false);
            } else {
                bridge.clearCookies();
            }
        }).catch(e => {
            console.warn('Error: user.readUserInfoFromDisk()\n' + e.toString());
        });
    }

    @action saveToken(token) {
        console.log('saveToken', token);
        if (!token) {
            return;
        }
        this.token = token;
        store.save(USERTOKEN, token).catch(e => {
        });
    }

    // 设置用户信息
    @action
    saveUserInfo(info, saveToDisk = true) {
        if (!info) {
            return;
        }
        this.info = info;
        this.unionid = info.unionid;
        this.id = info.id;                          //用户id
        this.code = info.code;                      //授权码
        this.appOpenid = info.appOpenid;                  //
        this.nickname = info.nickname;              //昵称
        this.wechatId = info.wechatId;              //微信号id
        this.wechatName = info.wechatName;          //微信用户名称
        this.phone = info.phone;                    //手机号
        this.realname = info.realname;              //真实姓名
        this.headImg = info.headImg;                //头像
        this.idcard = info.idcard;                  //身份证号码
        this.address = info.address;                //详细地址
        this.device = info.device;                  //最后登录_手机型号
        this.systemVersion = info.systemVersion;    //最后登录_系统型号
        this.wechatVersion = info.wechatVersion;    //微信版本
        this.wechatArea = info.wechatArea;          //微信授权获取区域
        this.regTime = info.regTime;                //注册时间
        this.lastLoginTime = info.lastLoginTime;    //最后登录时间
        this.inviteId = info.inviteId;              //邀请码
        this.provinceId = info.provinceId;          //省
        this.cityId = info.cityId;                  //
        this.areaId = info.areaId;                  //
        this.status = info.status;                  //状态 0 未激活 1 已激活 numebr
        this.updateAdmin = info.updateAdmin;        //修改人
        this.updateTime = info.updateTime;          //修改时间
        this.levelId = info.levelId;                //用户等级层级 number
        this.dType = info.dType;                    //经销商类型
        this.auzBeginTime = info.auzBeginTime;      //授权开始时间
        this.auzEndTime = info.auzEndTime;          //授权结束时间
        this.upDealerid = info.upDealerid;          //上级
        this.availableBalance = info.availableBalance;//可提现金额
        this.blockedBalance = info.blockedBalance; //冻结金额
        this.tokenCoin = info.tokenCoin;            //一元券数量
        this.blockedTokenCoin = info.blockedTokenCoin;            //待激活一元券数量
        this.blockedCoin = info.blockedCoin;        //冻结代币
        this.userScore = info.userScore;            //积分
        this.password = info.password;              //密码
        this.salt = info.salt;                      //加密盐
        this.encryptionCount = info.encryptionCount;//加密次数
        this.pickedUp = info.pickedUp;              //
        this.storeCode = info.storeCode;                //
        this.storeStatus = info.storeStatus;                //
        this.roleType = info.roleType;              //
        this.level = info.level;                    //
        this.levelName = info.levelName;            //

        this.historicalScore = info.historicalScore; //总积分
        this.historicalBalance = info.historicalBalance;//总金额
        this.shareGoodsAge = info.shareGoodsAge;
        this.totalBalance = info.totalBalance;
        this.totalScore = info.totalScore;
        this.blockedUserScore = info.blockedUserScore;
        this.couponCount = info.couponCount;

        this.experience = info.experience;
        this.salePsw = info.salePsw;                //
        this.hadSalePassword = info.hadSalePassword; // 是否设置过交易密码
        this.salePswSalt = info.salePswSalt;        //
        this.salePswEncryption = info.salePswEncryption;//
        this.province = info.province;              //
        this.city = info.city;                      //
        this.area = info.area;                      //
        this.storeBonusDto = info.storeBonusDto;    //
        this.realnameStatus = info.realnameStatus;    //
        this.upUserCode = info.upUserCode;//上级ID，判断是否可以领推广红包
        this.levelFloor = info.levelFloor;//用户上个等级的顶部
        this.levelCeil = info.levelCeil; //升级需要的经验值
        this.profile = info.profile;
        this.upCode = info.upCode;
        //用户靓号
        this.perfectNumberCode = info.perfectNumberCode;
        this.weChatNumber = info.weChatNumber; //微信号

        if (this.levelRemark && this.levelRemark !== info.levelRemark) {
            // mediatorCallFunc()
            mediatorCallFunc('Home_UserLevelUpdate', info.levelRemark);
        }
        this.levelRemark = info.levelRemark;


        if (saveToDisk) {
            store.save(USERINFOCACHEKEY, info).catch(e => {
            });
        }
        QYChatTool.initQYChat();
    }

    // 修改手机号
    @action
    changePhone(phone) {
        this.phone = phone;
    }

    // 解绑/绑定微信号
    @action
    untiedWechat(wechatName, openId, unionid) {
        this.wechatName = wechatName;
        this.openid = openId;
        this.unionid = unionid;
    }

    // 存储离线购物车信息
    @action
    saveCartDatarInfo(cartData, saveToDisk = true) {
        if (!cartData) {
            return;
        }
        this.cartData = cartData;
        if (saveToDisk) {
            store.save(CARTDATA, cartData).catch(e => {
            });
        }
    }

    // 是否跳转到LoginPage
    @action
    changeToLoginInfo(toLogin) {
        this.toLogin = toLogin;
    }

    @action
    setHadSalePassword(had) {
        this.hadSalePassword = had;
    }

    // 提供BasePage中repeatClick()
    @action
    changeNeedWaitingInfo(needWaiting) {
        this.needWaiting = needWaiting;
    }

    // 清空用户信息
    @action
    clearUserInfo() {
        this.id = 0;                 //用户id
        this.code = null;            //授权码
        this.appOpenid = null;          //
        this.nickname = '';          //昵称
        this.wechatId = '';          //微信号id
        this.wechatName = '';          //微信用户昵称
        this.phone = null;           //手机号
        this.realname = null;        //真实姓名
        this.headImg = null;         //头像
        this.idcard = null;          //身份证号码
        this.address = null;         //详细地址
        this.device = null;          //最后登录_手机型号
        this.systemVersion = null;   //最后登录_系统型号
        this.wechatVersion = null;   //微信版本
        this.wechatArea = null;      //微信授权获取区域
        this.regTime = null;         //注册时间
        this.lastLoginTime = null;   //最后登录时间
        this.inviteId = null;        //邀请码
        this.provinceId = null;      //省
        this.cityId = null;          //
        this.areaId = null;          //
        this.status = 0;             //状态 0 未激活 1 已激活 numebr
        this.updateAdmin = null;     //修改人
        this.updateTime = null;      //修改时间
        this.levelId = null;         //用户等级层级 number
        this.dType = null;           //经销商类型
        this.auzBeginTime = null;    //授权开始时间
        this.auzEndTime = null;      //授权结束时间
        this.upDealerid = null;      //上级
        this.availableBalance = null;//可提现金额
        this.blockedBalance = null; //冻结金额
        this.tokenCoin = null;       //代币金额
        this.blockedTokenCoin = null;       //待激活代币金额
        this.blockedCoin = null;     //冻结代币
        this.userScore = null;       //积分
        this.password = null;        //密码
        this.salt = null;            //加密盐
        this.encryptionCount = 0;    //加密次数
        this.pickedUp = null;        //
        this.storeCode = null;         //
        this.storeStatus = null;
        this.roleType = null;        //
        this.level = null;           //
        this.levelName = null;       //
        this.levelRemark = null;
        this.salePsw = null;         //
        this.hadSalePassword = false;
        this.salePswSalt = null;     //
        this.salePswEncryption = null;//
        this.province = null;        //
        this.city = null;            //
        this.area = null;            //
        this.storeBonusDto = null;   //
        this.realnameStatus = null;   //
        this.upUserCode = null;
        this.levelCeil = null;
        this.levelFloor = null;
        this.profile = null; //简介
        this.upCode = null;
        this.finishGuide = false;
        this.perfectNumberCode = null;
        this.weChatNumber = null; //微信号
        this.shareGoodsAge = null;
        this.totalBalance = null;
        this.totalScore = null;
        this.couponCount = null;
        this.historicalScore = null; //总积分
        this.historicalBalance = null;
        this.blockedUserScore = null;


        return store.deleted(USERINFOCACHEKEY).catch(e => {
        });
    }

    @action clearToken() {
        this.token = null;
        store.save(USERTOKEN, '');
    }

    // 清空离线购物车信息
    @action
    clearCartDatarInfo() {
        this.cartData = [];
        return store.deleted(CARTDATA).catch(e => {
        });
    }

    /**
     * 如果用户已经登录的话，执行这个函数
     * @param action function 登录情况下需要执行的函数
     */
    performActionIfHadLogin(fn) {
        if (!fn || typeof fn !== 'function') {
            return;
        }
        if (this.isLogin) {
            fn();
        } else {
            // TODO 跳转到登录页面，登录成功以后再调用action
        }
    }


    @action updateUserData() {
        return UserApi.getUser().then(res => {
            if (res.code === 10000) {
                let data = res.data;
                this.saveUserInfo(data);
            }
            return res.data;
        }).catch(e => {
        });
    }

    @action
    userShare() {
        UserApi.userShare();
    }

    luckyDraw() {
        UserApi.luckyDraw();
    }

    @action finishGiudeAction() {
        this.finishGuide = true;
    }
}

const user = new User();

autorun(() => {
    user.isLogin ? shopCartCacheTool.synchronousData() : null;
});
autorun(() => {
    if (user.code) {
        // 启动时埋点关联登录用户,先取消关联，再重新关联
        logout();
        login(user.code);
        JPushUtils.updatePushAlias();
        JPushUtils.updatePushTags();
    }
});

autorun(() => {
    if (user.isLogin) {
        JPushUtils.updatePushTags();
        JPushUtils.updatePushAlias();
    }
});
export default user;
