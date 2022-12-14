<template>
	<view class="container">
		<view style="position: relative;margin-top: 10rpx;margin-left: 1%;">
			<textarea maxlength="600" @keyup.enter="sendText()" auto-height="true" v-model="text" @focus="showKeyBoard()" class="input-area"></textarea>
			<view @tap="sendText()" :class="[isDisable?'send-btn-disable':'send-btn-able','send-btn']">发送</view> 
		</view>
		
		<view class="icon-container">
			<image class="input-icon" @tap="openDrawer(1)" src="@/static/icon/emoji.png"></image>
			<!-- <image class="input-icon" @tap="selectImage()" src="@/static/icon/image.png"></image> -->
			<!-- <image class="input-icon" @tap="selectVideo()" src="@/static/icon/video.png"></image> -->
			<!-- #ifde APP-PLUS -->
<!-- 			<lsj-upload
				style="width: 55rpx;height: 55rpx;hebackground-color: red;margin-left: 0rpx;"
				class="input-icon"
				ref="lsjUpload"
				childId="upload1"
				:count="1"
				:size="maxFileMB"
				:option="fileOption"
				@change="fileOnChange"
			>
				<image  class="input-icon" src="@/static/icon/file.png"></image>
			</lsj-upload> -->
			<!-- #endi -->
			<!-- #ifde H5 -->
			<!-- <image class="input-icon" @tap="selectFile()" src="@/static/icon/file.png"></image> -->
			<!-- #endi -->
			<!-- <image class="input-icon" @tap="openDrawer(5)" src="@/static/icon/microphone.png"></image> -->
		</view>
		<!-- 这部分小程序会报错，可能是因为读不了表情 所以暂时加条件为仅app-->
		<!-- #ifndef MP -->
		<view class="emoji-container" v-show="showDrawer===1">
			<image class="emoji" v-for="(emoji,index) in emojiList" :key="index" @tap="text += emoji.alt" :src="'../../static/emoji/big/'+emoji.url"></image>
			<view style="height: 100rpx;"></view>
			<view style="position: fixed;z-index: 100;right: 20rpx;bottom: 30rpx;display: flex">
				<view class="btn">
					<view @tap="deleteAEmoji()"><=</view> 
				</view>
				<view class="btn">
					<view @tap="showDrawer = 0">关闭</view>
				</view>
			</view>
		</view>
		<!-- #endif -->

		<!-- <view class="recorder-container" v-show="showDrawer===5">
			 <view style="position: relative;">
				 <view style="position: absolute;width: 90%;top: 50rpx;margin-left: 5%;">
					 <audioPlayer :src='recorder.localUrl' v-if='recorder' :autoplay="false" :continue="false"></audioPlayer>
				 </view>
				
					 <image v-show="recorder===null" class="record-btn" @click='handlerOnChanger' :src="!status?'../../static/icon/record-start.png':'../../static/icon/record-pause.png'"></image>
					 <text v-show="recorder===null && status">{{audioTime+'s'}}</text>
		
				<view style="display: flex;position: fixed;width: 90%;margin-left: 4%;bottom: 50rpx;" v-show="recorder!=null">
					<u-button @tap="audioCancel()" text="取消"  size="normal"></u-button>
					<u-button style="margin-left: 2%;" @tap="sendAudio()" text="发送"  size="normal" class="send-btn-able" type="primary"></u-button>
				</view>
				<view style="position: fixed;z-index: 100;right: 20rpx;bottom: 30rpx;display: flex">
					<view class="btn">
						<view @tap="showDrawer = 0">关闭</view>
					</view>
				</view>
			 </view>
		</view> -->
<!-- 		<view class="image-container" v-show="selectedImage!==null">
			<image @tap="selectImage()" style="width: 80%;height: 70%;overflow: hidden;margin-top: 1%;border-radius: 2%;" :src="selectedImage"></image>
			<view style="display: flex;position: fixed;width: 90%;margin-left: 4%;bottom: 50rpx;">
				<u-button @tap="imageCancel()" text="取消"  size="normal"></u-button>
				<u-button style="margin-left: 2%;" @tap="sendImage()" text="发送"  size="normal" class="send-btn-able" type="primary"></u-button>
			</view>
		</view> -->
		<!-- <view class="video-container" v-show="selectedVideo!==null">
			<video style="width: 80%;height: 70%;overflow: hidden;margin-top: 1%;border-radius: 2%;" :src="selectedVideo"></video>
			<view style="display: flex;position: fixed;width: 90%;margin-left: 4%;bottom: 50rpx;">
				<u-button @tap="videoCancel()" text="取消"  size="normal"></u-button>
				<u-button style="margin-left: 2%;" @tap="sendVideo()" text="发送"  size="normal" class="send-btn-able" type="primary"></u-button>
			</view>
		</view>
		<view class="file-container" v-show="selectedFile!==null">
			<view>
				<image style="width: 100rpx;height: 100rpx;margin-top: 60rpx;" src="@/static/icon/clip.png"></image>
				<view style="display: block;">
					<view>{{selectedFile===null?'':selectedFile.name}}</view>
					<view>{{selectedFile===null?'':(selectedFile.size/1048576).toFixed(2)+'MB'}}</view>
				</view>
			</view>
			<view style="display: flex;position: fixed;width: 90%;margin-left: 4%;bottom: 50rpx;">
				<u-button @tap="fileCancel()" text="取消"  size="normal"></u-button>
				<u-button style="margin-left: 2%;" @tap="sendFile()" text="发送"  size="normal" class="send-btn-able" type="primary"></u-button>
			</view>
		</view> -->
		<!-- 占位view inputBox往上多少  messageBox也往上多少 -->
		<view :style="{'height':keyboradHeight+'px'}"></view>
	</view>
</template>

<script>
	import emojiList from '@/fromDDchat/emojiList.js';
	// import audioPlayer from '@/fromDDchat/imt-audio/imt-audio.vue';
	import timeUtil from '@/fromDDchat/timeUtil.js';
	export default{
		name: 'inputBox',
		props:{
			maxImageMB:{
				type: Number,
				default: 5
			},
			// maxVideoMB:{
			// 	type: Number,
			// 	default: 10
			// },
			// maxFileMB:{
			// 	type: Number,
			// 	default: 10
			// },
			// fileExtensions:{
			// 	type: Array,
			// 	default: () => ['.zip','.doc','.txt','.pdf','.doc','.docx','.ppt','.exe','.html','.js','.css','.rar','.xls','.png','.jpg','.mp3','.mp4','.wav','.gif']
			// },
		},
		components:{
			// MumuRecorder,
			// audioPlayer
		},
		watch:{
			text: function(newData,oldData){
				if(newData!== ''){
					this.isDisable = false;
					if(newData[newData.length-1]==='\n'){
						this.text = this.text.replace('\n', ' ')
					}
				}else this.isDisable = true
			},
			// 通过设置showDrawer来动态改变message的buttom高度
			showDrawer: function(newData,oldData){
				// if(oldData === 5){
				// 	if(this.status){
				// 	}
				// }
				if(newData !==2 ) this.imageCancel()
				// if(newData !==3 ) this.videoCancel()
				// if(newData !==4 ) this.fileCancel()
				// if(newData !==5 ) this.audioCancel()
				switch(newData){
					case 0: this.height = 0; break; //keyboard
					case 1: this.height = 600; break;
					case 2: 
					// case 3: 
					// case 4: this.height = 500; break;
					// case 5: this.height = 450; break;
				}
				this.$emit('bottomHeight', this.height+150);
			}
		},
		mounted() {
			// #ifdef APP-PLUS
			//  监听键盘高度变化	
			uni.onKeyboardHeightChange(res => {
				if(res.height === 0){
					 this.keyboradHeight = 0;
					 //改变message 的最低高度为20
					 this.$emit('keyboradHeight', 20);
				}else{
					this.$emit('keyboradHeight', 90);
					if(this.showDrawer === 0){
						this.keyboradHeight = 35
					}
					else{
						// this.showDrawer = 0; //注释掉之后表情可以正常拉取
						this.keyboradHeight = res.height
					}			  
				}
			})
			
			// #endif
		},
		created() {
			this.emojiList = emojiList;
		},
		data(){
			return{
				isDisable: true,
				text: '',
				showDrawer: 0,
				emojiList: [],
				status: false,
				recorder: null,
				selectedImage: null,
				// selectedVideo: null,
				// selectedFile: null,
				// audioTime: 0,
				fileOption: {
					url: 'null'
				},
				keyboradHeight: 0,
				height: 0,
			}
		},
		methods:{
			showKeyBoard(){
				this.showDrawer = 0
			},
			//发送文件消息
			// sendFile(){
			// 	// #ifdef APP-PLUS
			// 	uni.showToast({
			// 		icon:'none',
			// 		title:'手机端暂时不行'
			// 	})
			// 	return
			// 	// #endif
			// 	let that = this
			// 	uni.showLoading({
			// 		title:'正在上传文件'
			// 	})
			// 	uni.uploadFile({});
			// },
			//发送视频消息
			// sendVideo(){
			// 	let that = this
			// 	uni.showLoading({
			// 		title:'正在上传视频'
			// 	})
			// 	uni.uploadFile({

			// 	});
				
			// },
			//发送图片消息
			sendImage(){
				let that = this
				uni.showLoading({
					title:'正在上传图片'
				})
				uni.uploadFile({

				});
			},
			//发送语音消息
			// sendAudio(){
			// 	// #ifdef APP-PLUS
			// 	uni.showToast({
			// 		icon:'none',
			// 		title:'手机端暂时不行'
			// 	})
			// 	return
			// 	// #endif
			// 	let that = this
			// 	uni.showLoading({
			// 		title:'正在上传音频'
			// 	})
			// 	//console.log(this.recorder)
			// 	uni.uploadFile({

			// 	});
				
			// },
			///发送文字
			sendText(){
				if(this.isDisable) return;
				if(this.text.replace(/ /g,'') === ''){
					uni.showToast({
						icon:'none',
						title:'请输入有效内容'
					})
					this.text = '';
					return;
				}
				let message = {
					messageType: 'text',
					// 格式 2022-10-22 15:30:37		不用时间戳，时间戳加减还得转化成这个格式
					sendTime: timeUtil.getFormatTime(new Date()),
					content: {text:this.text},
					senderName:this.$store.state.user.info.nickname
				}
				if(this.$store.state.user.info.avatar_file){
					message.senderAvatar=this.$store.state.user.info.avatar_file.url
				}
				this.$emit('sendMessage', message);
				this.text = '';
				
			},
			openDrawer(index){
				if(this.showDrawer === index){
					this.showDrawer = 0;
				}
				else {
					this.showDrawer = index
				}
			},
			deleteAEmoji(){
				if(this.text==='' || this.text.lastIndexOf('[') === '-1') return;
				this.text = this.text.slice(0, this.text.lastIndexOf('['));
			},
			// handlerSave() {
			//     let tag = document.createElement('a')
			//     tag.href = this.recorder.localUrl
			//     tag.download = '录音'
			//     tag.click()
			// },
			// handlerOnChanger() {
			//     if (this.status) {
			//         this.$refs.recorder.stop()
			//     } else {
			//         this.$refs.recorder.start()
			// 		setTimeout(() => {
			// 			this.handleAudioTime()
			// 		}, 1000)
			//     }
			//     this.status = !this.status
			// },
			// handleAudioTime(){
			// 	if(this.status){
			// 		this.audioTime ++;
			// 		setTimeout(() => {
			// 			this.handleAudioTime()
			// 		}, 1000)
			// 	}
			// },
			// handlerSuccess(res) {
			// 	//console.log(res)
			// 	if(res.duration<1){
			// 		uni.showToast({
			// 			icon:'error',
			// 			title:'录音时长太短！'
			// 		})
			// 		this.$refs.recorder.reSet();
			// 		return
			// 	}
			// 	if(res.duration>60){
			// 		uni.showToast({
			// 			icon:'error',
			// 			title:'录音时长太长！'
			// 		})
			// 		this.$refs.recorder.reSet();
			// 		return
			// 	}
			//     this.recorder = res
			// },
			// handlerError(code) {
			//     switch (code) {
			//         case '101':
			//             uni.showModal({
			//                 content: '当前浏览器版本较低，请更换浏览器使用，推荐在微信中打开。'
			//             })
			//             break;
			//         case '201':
			//             uni.showModal({
			//                 content: '麦克风权限被拒绝，请刷新页面后授权麦克风权限。'
			//             })
			//             break
			//         default:
			//             uni.showModal({
			//                 content: '未知错误，请刷新页面重试'
			//             })
			//             break
			//     }
			// },
			// audioCancel(){
			// 	this.recorder = null,
			// 	this.$refs.recorder.reSet();
			// 	this.audioTime = 0;
			// 	if(this.showDrawer === 5) this.showDrawer = 0;
			// },
			imageCancel(){
				this.selectedImage = null;
				if(this.showDrawer === 2) this.showDrawer = 0;
			},
			// videoCancel(){
			// 	this.selectedVideo = null;
			// 	if(this.showDrawer === 3) this.showDrawer = 0;
			// },
			// fileCancel(){
			// 	this.selectedFile = null;
			// 	// #ifdef APP-PLUS
			// 	this.$refs.lsjUpload.reSet()
			// 	// #endif	
			// 	if(this.showDrawer === 4) this.showDrawer = 0;
			// },
			selectImage(){
				uni.$u.toast('功能未开放')
				// let that = this
				// uni.chooseImage({
				// 	sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				// 	sourceType: ['album','camera'], //从相册选择
				// 	success: function (res) {
						
						//console.log(res.tempFilePaths[0])
						// if(that.maxImageMB*1048576 < res.tempFiles[0].size){
						// 	uni.showToast({
						// 		icon:'none',
						// 		title:'图片请限制在'+that.maxImageMB+'MB以内'
						// 	})
						// }else{
						// 	that.showDrawer = 2;
						// 	that.$nextTick(()=>{
						// 		that.selectedImage = res.tempFilePaths[0];
						// 		console.log(that.selectedImage)
						// 	})	
						// 	uniCloud.uploadFile({
						// 		filePath:res.tempFilePaths
						// 	})
						// }
							
				// 	}
				// });
			},
			// selectVideo(){
			// 	var self = this;
			// 	uni.chooseVideo({
			// 		sourceType: ['camera', 'album'],
			// 		sizeType: ['compressed'],
			// 		success: function (res) {
			// 			// console.log(res)
			// 			// #ifdef APP-PLUS
			// 				if(self.maxVideoMB*1048576 < res.size){
			// 					uni.showToast({
			// 						icon:'none',
			// 						title:'视频请限制在'+self.maxVideoMB+'MB以内'
			// 					})
			// 				}
			// 			// #endif
			// 			// #ifdef H5
			// 				if(self.maxVideoMB*1048576 < res.tempFile.size){
			// 					uni.showToast({
			// 						icon:'none',
			// 						title:'视频请限制在'+self.maxVideoMB+'MB以内'
			// 					})
			// 				}
								
			// 			// #endif
			// 			// else{
			// 			// 	self.showDrawer = 3;
			// 			// 	self.$nextTick(()=>{
			// 			// 		self.selectedVideo = res.tempFilePath;
			// 			// 	})
			// 			// }
						
			// 		}
			// 	});
			// },
			// selectFile(){
			// 	var self = this;
			// 	// #ifdef H5
			// 	uni.chooseFile({
			// 	  count: 1, //默认100
			// 	  extension: this.fileExtensions,
			// 		success: function (res) {
			// 			if(self.maxFileMB*1048576 < res.tempFiles[0].size){
			// 				uni.showToast({
			// 					icon:'none',
			// 					title:'文件请限制在'+self.maxFileMB+'MB以内'
			// 				})
			// 			}else{
			// 				self.showDrawer = 4;
			// 				self.$nextTick(()=>{
			// 					self.selectedFile = {
			// 						name: res.tempFiles[0].name,
			// 						size: res.tempFiles[0].size,
			// 						url: res.tempFilePaths[0]
			// 					}
			// 				})
			// 				// console.log(self.selectedFile)
			// 			}
					
			// 		}
			// 	});
			// 	// #endif
			// },
			// fileOnChange(files){
			// 	this.showDrawer = 4;
			// 	files.forEach((key,val)=>{
			// 	   this.selectedFile = {
			// 		   name: key.name,
			// 		   size: key.size,
			// 		   url: key.path
			// 	   }
			// 	})
			// },
		},
		onUnload() {
			uni.offKeyboardHeightChange()
		}
	}
</script>

<style lang="scss">
	.container{
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: rgb(224,224,224);
	}
	.input-area{
		margin-left: 1%;
		padding: 10rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		width: 79%;
		max-height: 180rpx;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	.send-btn{
		width: 15%;
		height: 60rpx;
		font-weight: 540;
		font-size: 30rpx;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		color: rgb(255,254,255);
		border-radius: 20rpx;
		text-align: center;
		position: absolute;
		right: 1%;
		bottom: 1%;
		line-height:60rpx;
		 
	}
	.send-btn-disable{
		background-color:rgb(0, 255, 0);
	}
	.send-btn-able{
		background-color: rgb(85, 170, 0);
	}
	.send-btn-able:active{
		background-color: #0071bc;
	}
	.icon-container{
		margin-top: 10rpx;
		margin-bottom: 0rpx;
		padding-left: 20rpx;
		.input-icon{
			width: 55rpx;
			height: 55rpx;
			margin-left: 20rpx;
			margin-right: 30rpx;
		}
	}
	.emoji-container{
		padding-left: 10rpx;
		width: 100%;
		height: 600rpx;
		background-color: #eaeaea;
		overflow: scroll;
		overflow-x: hidden;
		position: relative;
		.btn{
			text-align: center;
			line-height: 80rpx;
			width: 100rpx;
			height: 80rpx;
			border-radius: 20rpx;
			background-color: #ffffff;
			margin-left: 20rpx;
		}
		.btn:active{
			background-color: #cfcfcf;
		}
		.emoji{
			width: 50rpx;
			height: 50rpx;
			margin: 20rpx;
		}
	}

	.recorder-container{
		padding-left: 10rpx;
		width: 100%;
		height: 450rpx;
		background-color: #eaeaea;
		text-align: center;
		.record-btn{
			width: 200rpx;
			height: 200rpx;
			margin-top: 100rpx;
		}
		.btn{
			text-align: center;
			line-height: 80rpx;
			width: 100rpx;
			height: 80rpx;
			border-radius: 20rpx;
			background-color: #ffffff;
			margin-left: 20rpx;
		}
		.btn:active{
			background-color: #cfcfcf;
		}
	}
	.image-container{
		padding-left: 10rpx;
		width: 100%;
		height: 500rpx;
		background-color: #eaeaea;
		text-align: center;
	}
	.video-container{
		padding-left: 10rpx;
		width: 100%;
		height: 500rpx;
		background-color: #eaeaea;
		text-align: center;
	}
	.file-container{
		padding-left: 10rpx;
		width: 100%;
		height: 500rpx;
		background-color: #eaeaea;
		text-align: center;
	}
</style>