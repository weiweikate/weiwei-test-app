import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtil
import banner1Img from './res/banner1.png'
import avatar1Img from './res/avatar1.png'

const Banner = ({backImage, title, press}) => <View style={styles.bannerContainer}>
    <ImageBackground style={styles.bannerImg}  source={backImage}>
        <Text style={styles.bannerTitle}>{title}</Text>
        <TouchableOpacity style={styles.joinBtn} onPress={()=>press && press()}>
            <Text style={styles.join}>+ 申请加入</Text>
        </TouchableOpacity>
    </ImageBackground>
</View>

const Line = () => <View style={styles.line}/>

const Profile = ({avatar, name, level, member, income, allIncome}) => <View style={styles.profile}>
    <Image style={styles.avatar} source={avatar}/>
    <View style={styles.nameBox}>
        <View style={styles.nameView}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.level}>
                <Text style={styles.levelText}>{level}</Text>
            </View>
        </View>
        <View style={styles.space}/>
        <Text style={styles.text}>成员：<Text style={styles.member}>{member}</Text></Text>
    </View>
    <Line/>
    <View style={styles.incomeBox}>
        <Text style={styles.text}>店铺本月收入</Text>
        <View style={styles.space}/>
        <Text style={styles.income}>{income}</Text>
    </View>
    <Line/>
    <View style={styles.allIncomeBox}>
        <Text style={styles.text}>店铺累计收入</Text>
        <View style={styles.space}/>
        <Text style={styles.income}>{allIncome}</Text>
    </View>
</View>

const Cell = ({data, press}) => <View style={styles.cell}>
    <Banner backImage={data.banner1Img} title={data.title} onPress={()=>press && press()}/>
    <Profile avatar={data.avatar} name={data.name} level={data.level} member={data.member} income={data.income} allIncome={data.allIncome}/>
</View>


export default class HomeStarShopView extends Component {
    data = {
        banner1Img: banner1Img,
        title: '动人的美丽时尚你的生活',
        avatar: avatar1Img,
        name: '赵丽颖',
        level: 'V5',
        member: '32万+',
        income: '200082.98',
        allIncome: '300万元'
    }
    _shopPress() {
        console.log('_shopPress')
    }
    render () {
        return <View style={styles.container}>
            <View style={styles.titleView}><Text style={styles.title}>明星店铺</Text></View>
            <Cell data={this.data} press={()=>this._shopPress()}/>
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        marginLeft: px2dp(15),
        marginRight: px2dp(15)
    },
    titleView: {
        height: px2dp(58),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#333',
        fontSize: px2dp(19),
        fontWeight: '600'
    },
    bannerContainer: {

    },
    cell: {
        height: px2dp(175),
        borderRadius: px2dp(5),
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    bannerImg: {
        height: px2dp(110),
        alignItems: 'center'
    },
    bannerTitle: {
        fontSize: px2dp(22),
        color: '#fff',
        fontWeight: '700',
        marginTop: px2dp(52)
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(67)
    },
    avatar: {
        width: px2dp(45),
        height:  px2dp(45),
        borderRadius: px2dp(45) / 2,
        marginLeft: px2dp(15)
    },
    name: {
        color: '#333',
        fontSize: px2dp(12)
    },
    level: {
        backgroundColor: '#F2D3A2',
        width: px2dp(14),
        height: px2dp(14),
        borderRadius: px2dp(7),
        marginLeft: px2dp(5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    levelText: {
        color: '#AB8433',
        fontSize: px2dp(8)
    },
    nameBox: {
        marginLeft: px2dp(10),
        flex: 1
    },
    nameView: {
        flexDirection: 'row'
    },
    text: {
        color: '#666',
        fontSize: px2dp(9)
    },
    member: {
        color: '#333',
        fontSize: px2dp(10)
    },
    line: {
        width: onePixel,
        height: px2dp(35),
        backgroundColor: '#999'
    },
    incomeBox: {
        width: px2dp(95),
        justifyContent: 'center',
        alignItems: 'center'
    },
    income: {
        fontSize: px2dp(11),
        color: '#333'
    },
    allIncomeBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(85)
    },
    space: {
        height: px2dp(5)
    },
    joinBtn: {
        marginTop: px2dp(9),
        width: px2dp(67),
        height: px2dp(16),
        borderRadius: px2dp(16) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D51234'
    },
    join: {
        color: '#fff',
        fontSize: 10
    }
})
