//发布公告页面
import React from 'react';
import {
    View,
    Text,
    TextInput,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import StringUtils from '../../../utils/StringUtils';
import SpellShopApi from '../api/SpellShopApi';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class AnnouncementPublishPage extends BasePage {

    $navigationBarOptions = {
        title: '发布公告'
    };
    state = { text: '' };

    // 发布公告
    _saveContent = () => {
        if (StringUtils.isEmpty(this.state.text)) {
            this.$toastShow('公告内容不能为空');
            return;
        }
        if (this.state.text.length > 180) {
            this.$toastShow('公告长度不能大于180字');
            return;
        }

        SpellShopApi.storeNoticeInsert({ content: this.state.text, storeId: this.params.storeData.id }).then(() => {
            const { publishSuccess } = this.params;
            this.$toastShow('发布成功');
            publishSuccess && publishSuccess();
        }).catch((error) => {
            this.$toastShow(error.msg);
        });

    };

    _goBack = () => {
        this.$navigateBack();
    };

    _onChangeText = (text) => {
        this.setState({ text });
    };

    _render() {
        const color = { color: this.state.text ? '#333' : '#999999' };
        return (
            <View style={styles.container}>
                <ScrollView style={{ backgroundColor: 'white' }}>
                    <View style={styles.gap}/>
                    <View style={styles.bgContainer}>
                        <View style={styles.topBar}>
                            <Text style={styles.barTitle}>公告内容</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput value={this.state.text}
                                       onChangeText={this._onChangeText}
                                       underlineColorAndroid={'transparent'}
                                       multiline
                                       placeholder={'请输入公告内容......'}
                                       blurOnSubmit={false}
                                       style={[styles.textInput, color]}/>
                        </View>
                        <View style={styles.btnRow}>
                            {this.renderBtn(this._saveContent, styles.okBtn, styles.okTitle, '发布')}
                            {this.renderBtn(this._goBack, styles.canCelBtn, styles.canCelTitle, '取消')}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    renderBtn = (onPress, style, titleStyle, title) => {
        return (<TouchableOpacity onPress={onPress} style={style}>
            <Text style={titleStyle}>{title}</Text>
        </TouchableOpacity>);
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topBar: {
        justifyContent: 'center',
        width: SCREEN_WIDTH - 30,
        marginTop: 15,
        alignItems: 'center',
        height: 44,
        backgroundColor: '#e60012',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    barTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#ffffff'
    },
    textInputContainer: {
        width: SCREEN_WIDTH - 30,
        backgroundColor: '#eeeeee',
        height: 262
    },
    textInput: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 14,
        margin: 17,
        flex: 1,
        textAlignVertical: 'top'
    },
    gap: {
        width: SCREEN_WIDTH,
        height: 10,
        backgroundColor: '#F6F6F6'
    },
    bgContainer: {
        flex: 1,
        width: SCREEN_WIDTH,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    btnRow: {
        marginTop: 44,
        flexDirection: 'row',
        alignItems: 'center'
    },
    okBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e60012',
        marginRight: 45,
        width: 110,
        height: 40,
        borderRadius: 5
    },
    okTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 16,
        color: '#ffffff'
    },
    canCelBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dddddd',
        width: 110,
        height: 40,
        borderRadius: 5
    },
    canCelTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 16,
        color: '#999999'
    }
});
