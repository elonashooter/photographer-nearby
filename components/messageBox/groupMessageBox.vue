<template>
	<view >
		<!-- #ifdef APP-PLUS -->
		<view class="background-color"></view>
		<!-- #endif -->
		<view class="tips color_fff size_12 align_c" :class="{ 'show':ajax.loading }">{{ajax.loadText}}</view>
		<view class="box-1" id="list-box" :style="{'padding-bottom':bottomHeight+'rpx'}">
			<view class="talk-list" :style="{'padding-bottom':keyboardHeight+'rpx'}">
				<view class="message-list" v-for="(item,index) in groupMessage[s_index].list" :key="index" :id="`msg-${item.id}`">
					<view v-show="index===0||timeShowAble(groupMessage[s_index].list[index-1].sendTime,groupMessage[s_index].list[index].sendTime)" class="time">{{timeShow(item.sendTime)}}</view>
					<view v-if="item.isWithdrawn===1" class="time">{{item.senderName+'撤回了一条消息'}}</view>
					<view v-if="item.isWithdrawn===0" class="item flex_col" :class=" item.senderId == loginUserInfo.id ? 'push':'pull' ">
						<image @tap="gotoPersonInfo(item.senderId)" :src="item.avatar" mode="aspectFill" class="pic"></image>
						<view style="position: relative;">
							<text :class="item.senderId == loginUserInfo.id ? 'message-name-right':'message-name-left'">{{item.senderName}}</text>
							<view class="content" @longpress="onLongPress($event, item)">
								<rich-text v-if="item.messageType==='text'" :nodes="replaceEmoji(item.content)"></rich-text>
								<view v-if="item.messageType==='audio'">
									<view v-if="item.senderId == loginUserInfo.id" @tap="playAudio(item.content)" style="display: flex;">{{showAudioDuration(item.content)+"''"}}<image style="height: 45rpx;width: 45rpx;" src="@/static/icon/audio-push.png"></image></view>
									<view v-if="item.senderId != loginUserInfo.id" @tap="playAudio(item.content)"  style="display: flex;"><image style="height: 45rpx;width: 45rpx;" src="@/static/icon/audio-pull.png"></image>{{showAudioDuration(item.content)+"''"}}</view>
								</view>
								<image v-if="item.messageType==='image'" mode="aspectFill" class="message-image" :src="showImage(item.content,'compress')" @tap="showImage(item.content,'origin')"></image>
								<video v-if="item.messageType==='video'" class="message-video" :src="item.content"></video>
								<view v-if="item.messageType==='file'">
									<image src="@/static/icon/clip.png" style="width: 40rpx;height: 40rpx;"></image>
									<text style="display: block;">附件：{{JSON.parse(item.content).name}}</text>
									<text>大小：{{JSON.parse(item.content).size}}</text>
									<button style="background-color: deepskyblue;" @tap="downloadFile(item.content)">点击下载</button>
								</view>
							</view>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		
		
		<view class="shade" v-show="showShade" @tap="hidePop">
			<view class="pop" :style="popStyle" :class="{'show':showPop}">
				<view v-for="(item,index) in popButton" :key="index" @tap="pickerMenu" :data-index="index">{{item}}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import EmojiUtil from '@/static/emoji/replaceEmoji.js';
	import {mapGetters,mapActions} from 'vuex';
	import timeUtil from '@/fromDDchat/timeUtil.js';
	export default {
		data() {
			return {
				ajax:{
					rows:20,	//每页数量
					page:1,	//页码
					flag:true,	// 请求开关
					loading:true,	// 加载中
					loadText:'正在获取消息'
				},
				content:'',
				bottomHeight: 150,
				keyboardHeight: 20,
				s_index:0,
				lastPosition:null,
				
				/* 窗口尺寸 */
				winSize: {},
				/* 显示遮罩 */
				showShade: false,
				/* 显示操作弹窗 */
				showPop: false,
				/* 弹窗按钮列表 */
				popButton: ["复制","撤回"],
				/* 弹窗定位样式 */
				popStyle: "",
				/* 选择的用户下标 */
				pickerUserIndex: -1,
				selectedMessage: {},
				
				
			}
		},
		computed:{
			...mapGetters(['groupMessage','chattingGroupInfo','loginUserInfo','lastUpdateSession'])
		},
		created() {
			this.getWindowSize();
		},
		mounted() {
			console.log('群聊天页面初始化')
			if(this.chattingGroupInfo==null){
				uni.switchTab({
					url:'/pages/index/index'
				})
				return
			}
			//console.log(this.personMessage,this.chattingUserInfo)
			for(let i=0;i<this.groupMessage.length;i++){
				if(this.groupMessage[i].groupId==this.chattingGroupInfo.sessionId){
					this.s_index = i;
					break;
				}
			}
			if(this.groupMessage[this.s_index].list.length!=0) this.lastPosition = this.groupMessage[this.s_index].list[0].id
			
			this.$nextTick(()=>{
				this.goToBottom();
			});
		},
		watch:{
			lastUpdateSession(newSession,oldSession){
				//console.log(newSession)
				if(newSession.id==this.chattingGroupInfo.sessionId){
					this.$nextTick(()=>{
						this.goToBottom();
					})
				}
			},
			lastPosition:function(newData, oldData){
				if(oldData==null) return
				let selector = `#msg-${oldData}`;
				console.log(selector)
				// 数据挂载后执行，不懂的请自行阅读 Vue.js 文档对 Vue.nextTick 函数说明。
				this.$nextTick(()=>{
					// 设置当前滚动的位置
					this.setPageScrollTo(selector);
					//this.hideLoadTips(true);
				})
			}
			
		},
		methods: {
			gotoPersonInfo(senderId){
				if(senderId==this.loginUserInfo.id)
				{
					uni.navigateTo({
						url:'/pages/info/person-info'
					})
				}else{
					uni.navigateTo({
						url:'/pages/info/friend-info?id='+senderId
					})
				}
			},
			// 设置页面滚动位置
			setPageScrollTo(selector){
				let view = uni.createSelectorQuery().in(this).select(selector);
				view.boundingClientRect((res) => {
					uni.pageScrollTo({
					    scrollTop:res.top - 30,	// -30 为多显示出大半个消息的高度，示意上面还有信息。
					    duration: 0
					});
				}).exec();
			},
			//文件下载
			downloadFile(content){

			
				
			},
			async getHistoryMsg(){
				//console.log(this.personMessage[this.s_index])
				
			},
			withdrawMessage(){
				if(this.selectedMessage.senderId!=this.loginUserInfo.id){
					uni.showToast({
						title:'仅可以撤回自己的消息',
						icon:'none'
					})
					return;
				} 
				let seconds = timeUtil.TimeDifferenceSeconds(this.selectedMessage.sendTime, new Date());
				if(seconds>180){ //超过三分钟不可以撤回
					uni.showToast({
						icon:'none',
						title:'仅可以撤回三分钟以内的消息'
					})
					return;
				}
				let message = {
					type: 'group-withdraw',
					data: {
						groupId: this.chattingGroupInfo.sessionId,
						messageId: this.selectedMessage.id
					}
				}
				uni.sendSocketMessage({
					data: JSON.stringify(message),
					fail() {
						uni.showToast({
							icon:'error',
							title:'撤回失败'
						})
					}
				})
			},
			//显示图片showImage
			showImage(imageString, type){
				let image = JSON.parse(imageString);
				if(type==='compress') return image.compressUrl;
				else{
					uni.previewImage({
						urls:[image.originUrl]
					})
				}
			},
			//播放语音
			playAudio(audioString){
				//console.log(audioString)
				uni.showLoading({
					title:'正在播放音频...'
				})
				let audio = JSON.parse(audioString);
				var music = null;
				music = uni.createInnerAudioContext(); //创建播放器对象
				music.src = audio.url;
				music.play(); //执行播放
				music.onEnded(() => {
				    //播放结束
				    music = null;
					uni.hideLoading();
				});
			},
			///显示语音时长
			showAudioDuration(audioString){
				let audio = JSON.parse(audioString)
				return audio.duration;
			},
			///替换emoji
			replaceEmoji(text){
				return EmojiUtil.replaceEmoji(text);
			},
			///滑到底部
			goToBottom(){
				uni.pageScrollTo({
					scrollTop: 999999,
					duration: 0
				})
				this.hideLoadTips(true)
			},
			///显示时间的样式
			timeShow(time){
				return timeUtil.timeShowFormat(time);
			},
			///是否显示时间
			timeShowAble(time1, time2){
				if(timeUtil.TimeDifferenceSeconds(time1, time2) > 300)	return true;
				return false;
			},
			setBottomHeigth(height){
				this.bottomHeight = height;
				this.$nextTick(()=>{
					uni.pageScrollTo({
						scrollTop: 99999999,
						duration: 0
					})
				})
			},
			setKeyboardHeight(height){
				this.keyboardHeight = height;
				this.$nextTick(()=>{
					uni.pageScrollTo({
						scrollTop: 99999999,
						duration: 0
					})
				})
			},
			showLoadTips(str){
				this.ajax.loadText = str;
				this.ajax.loading = true
				setTimeout(()=>{
					this.ajax.loading = false;
				},800);
			},
			// 隐藏加载提示
			hideLoadTips(flag){
				if(flag){
					this.ajax.loadText = '消息获取成功';
					setTimeout(()=>{
						this.ajax.loading = false;
					},300);
				}else{
					this.ajax.loading = true;
					this.ajax.loadText = '正在获取消息';
				}
			},
			
			/* 获取窗口尺寸 */
			getWindowSize() {
				uni.getSystemInfo({
					success: (res) => {
						this.winSize = {
							"witdh": res.windowWidth,
							"height": res.windowHeight
						}
					}
				})
			},
			/* 长按监听 */
			onLongPress(e, message) {
				this.selectedMessage = message;
				let [touches, style] = [e.touches[0], ""];
				/* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
				if (touches.clientY > (this.winSize.height / 2)) {
					style = `bottom:${this.winSize.height-touches.clientY}px;`;
				} else {
					style = `top:${touches.clientY}px;`;
				}
				if (touches.clientX > (this.winSize.witdh / 2)) {
					style += `right:${this.winSize.witdh-touches.clientX}px`;
				} else {
					style += `left:${touches.clientX}px`;
				}
				this.popStyle = style;
				this.showShade = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPop = true;
					}, 10);
				});
			},
			/* 隐藏弹窗 */
			hidePop() {
				this.showPop = false;
				this.pickerUserIndex = -1;
				setTimeout(() => {
					this.showShade = false;
				}, 250);
			},
			/* 选择菜单 */
			pickerMenu(e) {
				let index = Number(e.currentTarget.dataset.index);
				switch(index){
					case 0:
					uni.setClipboardData({
						data:this.selectedMessage.content,
						success: function () {
							uni.showToast({
								title:'复制成功',
								icon:'none'
							})
						}
					})
					break;
					case 1:
					this.withdrawMessage();
					break;
				}
			
				/* 
				 因为隐藏弹窗方法中会将当前选择的用户下标还原为-1,
				 如果行的菜单方法存在异步情况，请在隐藏之前将该值保存，或通过参数传入异步函数中
				 */
				this.hidePop();
			}
		}
	}
</script>
<style lang="scss">
	
	page {
	  background-color: #333;
	  font-size: 28rpx;
	  box-sizing: border-box;
	  color: #000000;
	  letter-spacing: 0;
	  word-wrap: break-word;
	}
	
</style>
<style lang="scss" scoped>
	@import "@/components/messageBox/global.scss";

	// page{
	// 	background-color: #333;
	// 	font-size: 28rpx;
	// }
	.background-color{
		position: fixed;
		background-color: #333;
		z-index: -1;
		width: 100%;
		height: 100%;
		top: -1rpx;
	}
	.text-show{
		/* padding: 10p;
		display: flex;
		align-items: center;
		word-wrap:break-word; */
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-box-orient: vertical;
		height: 100%;
		vertical-align: text-bottom;
		-webkit-user-select: text; 
		.emoji-text{
			width: 50rpx;
			height: auto;
			margin-bottom: -12rpx;
		}
	}
	
	/* 加载数据提示 */
	.tips{
		position: fixed;
		left: 0;
		top:var(--window-top);
		width: 100%;
		z-index: 9;
		background-color: rgba(0,0,0,0.15);
		height: 72rpx;
		line-height: 72rpx;
		transform:translateY(-80rpx);
		transition: transform 0.3s ease-in-out 0s;
		
		&.show{
			transform:translateY(0);
		}
	}
	.box-1{
		z-index: 1;
		width: 100%;
		height: auto;
		padding-bottom: 150rpx;
		box-sizing: content-box;
		
		/* 兼容iPhoneX */
		margin-bottom: 0;  
		margin-bottom: constant(safe-area-inset-bottom);  
		margin-bottom: env(safe-area-inset-bottom);  
	}
	.talk-list{
		padding-bottom: 20rpx;
		z-index: 1;
		/* 消息项，基础类 */
		.message-list{
			.message-name-left{
				left: 30rpx;
				//right: 30rpx;
				top: -18rpx;
				color: white;
				font-size: 23rpx;
				position: absolute;
			}
			.message-name-right{
				//left: 30rpx;
				right: 30rpx;
				top: -18rpx;
				color: white;
				font-size: 23rpx;
				position: absolute;
			}
		}
		.message-image{
			width: 300rpx;
			height: 200rpx;
		}
		.message-video{
			width: 400rpx;
			height: 300rpx;
			z-index: 0;
		}
		.time{
			color: white;
			margin-left: auto;
			margin-right: auto;
			text-align: center;
			font-size: 25rpx;
			margin-top: 20rpx;
			z-index: 2;
		}

		.item{
			margin-top: 20rpx;
			padding: 20rpx 20rpx 0 20rpx;
			align-items:flex-start;
			align-content:flex-start;
			color: #333;
			
			.pic{
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				border: #fff solid 1px;
			}
			
			.content{
				margin-top: 20rpx;
				padding: 20rpx;
				border-radius: 4px;
				max-width: 500rpx;
				word-break: break-all;
				line-height: 52rpx;
				position: relative;
			}
			
			/* 收到的消息 */
			&.pull{
				.content{
					margin-left: 32rpx;
					background-color: #fff;
					
					&::after{
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-right: 20rpx solid #fff;
						position: absolute;
						top: 30rpx;
						left: -18rpx;
					}
				}
			}
			
			/* 发出的消息 */
			&.push{
				/* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
				flex-direction: row-reverse;
				
				.content{
					margin-right: 32rpx;
					background-color: #a0e959;
					
					&::after{
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-left: 20rpx solid #a0e959;
						position: absolute;
						top: 30rpx;
						right: -18rpx;
					}
				}
			}
		}
	}
	/* 遮罩 */
	.shade {
		position: fixed;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		-webkit-touch-callout: none;
	
		.pop {
			position: fixed;
			z-index: 101;
			width: 200upx;
			box-sizing: border-box;
			font-size: 28upx;
			text-align: left;
			color: #333;
			background-color: #fff;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			line-height: 80upx;
			transition: transform 0.15s ease-in-out 0s;
			user-select: none;
			-webkit-touch-callout: none;
			transform: scale(0, 0);
	
			&.show {
				transform: scale(1, 1);
			}
	
			&>view {
				padding: 0 20upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				user-select: none;
				-webkit-touch-callout: none;
	
				&:active {
					background-color: #f3f3f3;
				}
			}
		}
	}
</style>