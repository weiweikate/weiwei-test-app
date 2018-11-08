//
//  JRServiceManager.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRServiceManager.h"
#import <QYSDK.h>
@interface JRServiceManager()<QYConversationManagerDelegate>

@property(nonatomic,strong) QYSessionViewController *sessionVC;

@end

@implementation JRServiceManager
SINGLETON_FOR_CLASS(JRServiceManager)

-(void)qiYULogout{
  [[QYSDK sharedSDK]logout:nil];
}
/**
 * groupId:0,
 * staffId:0,
 * title:'七鱼金融',
 * userId:用户id
 * userIcon:用户头像,
 * phoneNum:用户手机号,
 * nickName:用户名称,
 * device:手机型号
 * systemVersion:手机系统版本
 */
-(void)qiYUChat:(id)josnData{
//  NSDictionary *jsonDic = [NSJSONSerialization  JSONObjectWithData:josnData options:NSJSONReadingMutableLeaves error:nil];
  NSDictionary *jsonDic = josnData;
  QYSource *source = [[QYSource alloc] init];
  source.title =  jsonDic[@"title"];
  source.urlString = @"https://8.163.com/";
  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
  
  self.sessionVC.sessionTitle = jsonDic[@"title"];
  self.sessionVC.source = source;
  
  self.sessionVC.groupId = [jsonDic[@"groupId"] integerValue];
  self.sessionVC.staffId = [jsonDic[@"staffId"] integerValue];
  //设置当前用户信息
  QYUserInfo * userInfo = [QYUserInfo alloc];
  userInfo.userId = jsonDic[@"userId"];
  NSArray * infoData = @[
                         @{@"userIcon":jsonDic[@"userIcon"]?jsonDic[@"userIcon"]:@""},
                         @{@"phoneNum":jsonDic[@"phoneNum"]?jsonDic[@"phoneNum"]:@""},
                         @{ @"nickName":jsonDic[@"nickName"]?jsonDic[@"nickName"]:@""},
                         @{@"device":jsonDic[@"device"]?jsonDic[@"device"]:@""},
                         @{@"systemVersion":jsonDic[@"systemVersion"]?jsonDic[@"systemVersion"]:@""}
                        ];
  userInfo.data = [self arrToJsonString:infoData];
  [[QYSDK sharedSDK] setUserInfo:userInfo];
  
  JRBaseNavVC *nav =[[JRBaseNavVC alloc] initWithRootViewController:self.sessionVC];
  self.sessionVC.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain
                                  target:self action:@selector(onBack:)];
  [KRootVC presentViewController:nav animated:YES completion:nil];
}
-(void)startServiceWithGroupId:(int64_t)groupId andStaffId:(int64_t)staffId andTitle:(NSString *)title{
  QYSource *source = [[QYSource alloc] init];
  source.title =  title;
  source.urlString = @"https://8.163.com/";
  [[[QYSDK sharedSDK] conversationManager] setDelegate:self];
  
  self.sessionVC.sessionTitle = title;
  self.sessionVC.source = source;
  
  self.sessionVC.groupId = groupId;
  self.sessionVC.groupId = staffId;
  
  JRBaseNavVC *nav =[[JRBaseNavVC alloc] initWithRootViewController:self.sessionVC];
  self.sessionVC.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain
                                  target:self action:@selector(onBack:)];
  [KRootVC presentViewController:nav animated:YES completion:nil];
}
- (void)onBack:(id)sender
{
  [KRootVC dismissViewControllerAnimated:self.sessionVC completion:nil];
}
-(QYSessionViewController *)sessionVC{
  if (!_sessionVC) {
    _sessionVC = [[QYSDK sharedSDK]sessionViewController];
    _sessionVC.groupId = 0;
    _sessionVC.staffId = 0;
  }
  return _sessionVC;
}
-(void)onCleanCache{
  [[QYSDK sharedSDK] cleanResourceCacheWithBlock:nil];
}
#pragma QYConversationManagerDelegate
/**
 *  会话未读数变化
 *
 *  @param count 未读数
 */
- (void)onUnreadCountChanged:(NSInteger)count{
}
/**
 *  会话列表变化；非平台电商用户，只有一个会话项，平台电商用户，有多个会话项
 */
- (void)onSessionListChanged:(NSArray<QYSessionInfo*> *)sessionList{
}
/**
 *  收到消息
 */
- (void)onReceiveMessage:(QYMessageInfo *)message{
  
}
-(NSString *)arrToJsonString:(NSArray *)arr{
    NSData *data = [NSJSONSerialization dataWithJSONObject:self
                                                   options:NSJSONReadingMutableLeaves | NSJSONReadingAllowFragments
                                                     error:nil];
    
    if (data == nil) {
      return nil;
    }
    NSString *string = [[NSString alloc] initWithData:data
                                             encoding:NSUTF8StringEncoding];
    return string;
}

@end
