import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
import AccountItem from '../../components/AccountItem';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';
import withdrawMoney from '../../res/userInfoImg/withdrawMoney.png';
import consumePointPage from '../../res/userInfoImg/consumePointPage.png';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge' ;

export default class MyIntegralAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            id: user.id,
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [
                {
                    type: '秀逗消费',
                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200',
                    iconImage: withdrawMoney,
                    capitalRed:true,
                },
                {
                    type: '秀逗消费',
                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200',
                    iconImage: withdrawMoney,
                    capitalRed:true,
                },
            ],
            restMoney: 1600.00,
            blockMoney: 256.00,
            currentPage: 1,
            isEmpty: false
        };
    }

    $navigationBarOptions = {
        title: '秀逗账户',
        show: true // false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <RefreshList
                    ListFooterComponent={this.renderFootder}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据！'}
                />
            </View>
        );
    }

    renderHeader = () => {
        return (
            <View style={styles.container}>
                <Image style={styles.imageBackgroundStyle} source={consumePointPage}/>
                <View style={styles.viewStyle}>
                    <Text style={{ marginLeft: 25, marginTop: 15, fontSize: 13, color: color.white,fontFamily:'PingFangSC-Light' }}>秀逗账户</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ height: 44, justifyContent: 'space-between', marginTop: 15 }}>
                            <Text style={{
                                marginLeft: 25,
                                fontSize: 25,
                                color: color.white
                            }}>{this.state.restMoney}</Text>
                            <Text style={{ marginLeft: 25, fontSize: 15, color: color.white }}/>
                        </View>
                    </View>
                </View>
            </View>

        );
    };
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity>
                <AccountItem
                    type={item.type}
                    time={item.time}
                    serialNumber={item.serialNumber}
                    capital={item.capital}
                    iconImage={item.iconImage}
                    clickItem={() => {
                        this.clickItem(index);
                    }}
                    capitalRed={item.capitalRed}
                />
            </TouchableOpacity>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line, marginLeft: 48, marginRight: 48 }}></View>
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
        this.getDataFromNetwork();
    }

    clickItem = (index) => {
        alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ['', '注册赠送', '活动赠送', '商品购买抵扣'];
        let use_type_symbol = ['', '+', '+', '-'];
        Toast.showLoading();
        MineApi.queryDetailUserScorePageListAPP({
            dealerId: user.id,
            page: this.state.currentPage
        }).then((response) => {
            Toast.hiddenLoading();
            if (response.ok) {
                let data = response.data;
                let arrData = this.state.currentPage === 1 ? [] : this.state.viewData;
                data.data.map((item, index) => {
                    arrData.push({
                        type: use_type[item.use_type],
                        time: DataUtils.getFormatDate(item.create_time / 1000),
                        serialNumber: '',
                        capital: use_type_symbol[item.use_type] + item.user_score,
                        iconImage: withdrawMoney,
                        capitalRed: use_type_symbol[item.use_type] === '-'
                    });
                });
                this.setState({ viewData: arrData, isEmpty: data.data && data.data.length !== 0 ? false : true });
            } else {
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
        });
        MineApi.findDealerAccountByIdAPP({ id: user.id }).then((response) => {
            if (response.ok) {
                let data = response.data;
                this.setState({
                    restMoney: data.user_score
                });
            } else {
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
        });
    };
    onRefresh = () => {
        this.setState({
            currentPage: 1
        });
        this.getDataFromNetwork();
    };
    onLoadMore = () => {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
        this.getDataFromNetwork();
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: color.page_background
    },
    container: {}, imageBackgroundStyle: {
        position: 'absolute',
        height: 140,
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15
    }, rectangleStyle: {
        width: 100,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: color.white,
        marginRight: 15,
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center'
    }, viewStyle: {
        height: 140,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15
    }
});

