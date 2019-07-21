//
//  ActiveView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/5/7.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "ActiveView.h"
#import <AVFoundation/AVFoundation.h>
#import "NetWorkTool.h"
#import <MJRefresh/MJRefresh.h>
#import  <SDAutoLayout.h>
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import "MBProgressHUD+PD.h"
#import <YYKit.h>

#import "MBScrollView.h"
#import "MBVideoModel.h"
#import "MBVideoHeaderView.h"

@interface ActiveView()<MBSrcollViewDataDelegate,MBHeaderViewDelegate>

@property (nonatomic, strong)NSMutableArray *dataArr;
@property (nonatomic, assign)NSInteger page;
@property (nonatomic, assign)NSInteger current;
@property (nonatomic, strong)NSMutableArray *callBackArr;

@property (nonatomic, strong)UIView *headerView;

@property (nonatomic, strong)MBVideoHeaderView *VideoHeaderView;

@property (nonatomic, strong) MBScrollView *scrollView;
@property (nonatomic, assign) BOOL didPausePlay;

@property(nonatomic, strong)UILabel *emptyLb;
@property (nonatomic, strong)UIView *emptyView;

@end


@implementation ActiveView

#pragma mark - Custom Accessors

- (MBScrollView *)scrollView {
  if (!_scrollView) {
    _scrollView = [[MBScrollView alloc] init];
  }
  
  return _scrollView;
}

-(MBVideoHeaderView*)VideoHeaderView{
  if(!_VideoHeaderView){
    _VideoHeaderView = [[MBVideoHeaderView alloc]init];
    _VideoHeaderView.dataDelegate = self;
  }
  return _VideoHeaderView;
}

-(instancetype)init{
  self=[super init];
  if(self){
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"guanzhu"];
    
    self.didPausePlay = NO;
    [self initData];
    [self initUI];
//    [self setupRefresh];
  }
  return self;
}

/**
 初始化
 */
- (void)initData
{
  self.page = 1;
  self.current = 0;
  _dataArr = [NSMutableArray new];
  _callBackArr = [NSMutableArray new];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
}

/**
 刷新数据
 */
- (void)refreshData
{
  NSMutableDictionary *dic = [NSMutableDictionary new];
  NSString *currentShowNo = @"";
  if(self.dataArr.lastObject){
   currentShowNo = [self.dataArr.lastObject valueForKey:@"showNo"];
  }
  [dic addEntriesFromDictionary:@{@"currentShowNo":currentShowNo , @"queryUserCode": @""}];
  __weak ActiveView * weakSelf = self;
  [NetWorkTool requestWithURL:@"/social/show/video/list/next@GET" params:dic toModel:nil success:^(NSDictionary* result) {
    MBVideoModel* model = [MBVideoModel modelWithJSON:result];
    [weakSelf.dataArr addObjectsFromArray:model.data];
    if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
      [weakSelf.callBackArr addObjectsFromArray:[result valueForKey:@"data"]];
    }
    self.VideoHeaderView.model = weakSelf.dataArr.firstObject;
    [self.scrollView setupData:weakSelf.dataArr];

  } failure:^(NSString *msg, NSInteger code) {
    MBVideoModel* model = [MBVideoModel new];
    [self.scrollView setupData:[model.data mutableCopy]];
  } showLoading:nil];
}

/**
 加载更多数据
 */
- (void)getMoreData
{
  NSMutableDictionary *dic = [NSMutableDictionary new];
  NSString *currentShowNo = [self.dataArr.lastObject valueForKey:@"showNo"];
  [dic addEntriesFromDictionary:@{@"currentShowNo": currentShowNo, @"queryUserCode": @""}];
  __weak ActiveView * weakSelf = self;

  [NetWorkTool requestWithURL:@"/social/show/video/list/next@GET" params:dic toModel:nil success:^(NSDictionary* result) {
    MBVideoModel* model = [MBVideoModel modelWithJSON:result];
      [weakSelf.dataArr addObjectsFromArray:model.data];
      if([result valueForKey:@"data"]&&![[result valueForKey:@"data"] isKindOfClass:[NSNull class]]){
        [weakSelf.callBackArr addObjectsFromArray:[result valueForKey:@"data"]];
      }
      [self.scrollView setupData:[model.data mutableCopy]];
    } failure:^(NSString *msg, NSInteger code) {
      MBVideoModel* model = [MBVideoModel new];
      [self.scrollView setupData:[model.data mutableCopy]];
    } showLoading:nil];
}


- (void)initUI {
  [self addSubview:self.scrollView];
  [self addSubview:self.VideoHeaderView];

  self.scrollView.sd_layout.topEqualToView(self)
  .leftEqualToView(self).widthIs(KScreenWidth).heightIs(KScreenHeight);
  
  self.VideoHeaderView.sd_layout
  .topSpaceToView(self, 0).leftSpaceToView(self, 0)
  .rightSpaceToView(self, 0).heightIs(100);
  self.scrollView.dataDelegate = self;
}

-(void)setParams:(NSDictionary *)params{
  MBModelData* firstData = [MBModelData modelWithJSON:params];
  self.dataArr = [NSMutableArray arrayWithObject:firstData];
  self.callBackArr = [NSMutableArray arrayWithObject:params];
  [self.scrollView setupData:self.dataArr];
  [self refreshData];

}

#pragma mark - Protocol conformance

- (void)pullNewData {
  self.page++;
  [self getMoreData];
}

#pragma arguments - delegate
-(void)getCurrentDataIndex:(NSInteger)index{
  NSLog(@"getCurrentDataIndex==%ld",index);
  self.current = index;
  if([self.dataArr objectAtIndex:self.current]){
    self.VideoHeaderView.model =[self.dataArr objectAtIndex:self.current];
  }
}

- (void)clickDownload:(MBModelData *)model{
  [self.dataArr replaceObjectAtIndex:self.current withObject:model];
}

-(void)clicCollection:(MBModelData *)model{
  [self.dataArr replaceObjectAtIndex:self.current withObject:model];
}

-(void)clickZan:(MBModelData *)model{
  [self.dataArr replaceObjectAtIndex:self.current withObject:model];
}

-(void)clickBuy:(MBModelData *)model{

}

-(void)clickTagBtn:(MBModelData *)model index:(NSInteger)index{
  NSLog(@"%@",model.showTags[index-1]);
}

-(void)goBack{
  
}

-(void)headerClick:(MBModelData *)model{
  
}

- (void)guanzhuClick:(MBModelData *)model{
  [self.dataArr replaceObjectAtIndex:self.current withObject:model];
}

- (void)shareClick:(MBModelData *)model{
  
}


#pragma arguments --RN callback Native
-(void)replaceItemData:(NSInteger)index data:(NSDictionary *)data{
  if(data){
    
  }
}

@end
