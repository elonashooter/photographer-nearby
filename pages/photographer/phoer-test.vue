<template>
	<view>
		<view class='nav-bar'>
			<uni-icons type="back" size="23" color="white" @click="backVOrder()"></uni-icons>
			<uni-icons type="phone" size="23" color="white" @click="phoneCall()"></uni-icons>
			<uni-icons type="chat" size="23" color="white" @click="goChat()"></uni-icons>
		</view>
				
		<!-- 顶部 -->
		<view class="tn-strip-bottom">
		  <!-- <image style="position: absolute;z-index:3; left: 10rpx;bottom: 10rpx;" class="uni-uploader__img" mode="aspectFill" :src="phoerInfo.phoerShow[0]"></image> -->
		  <view class="slideshow">
				<view class="slideshow-image" :style="'background-image: url('+phoerInfo.phoerShow[0]+')'" @tap="previewPhoerShow">
				</view>
				
		  </view>
		  <view style="">
		    <view style="display: flex;flex-direction: column;align-items: center;">
		      <text style="font-weight: bold;font-size: 40rpx;color: brown;">摄影 {{phoerInfo.name}}</text>
		      <text style="font-size: 32rpx;color:rgba(175, 163, 169, 1.0);margin: 10rpx;">{{phoerInfo.intro}}</text>
			  <u-button
			  	v-if="SubmitButtonText=='返回'"
			  	type="primary"
			  	text="返回"
			  	customStyle="width:30%;position:absolute;left:40rpx"
			  	@click="backVOrder()"
			  ></u-button>
			  <u-button
			  	v-else
			  	type="success"
				size="small"
			  	text="预约"
			  	customStyle="width:20%;position:absolute;left:40rpx"
			  	@click="navYuyue()"
			  ></u-button>
			</view>
		  </view>
				
		</view>
		<view class="u-demo-block u-page" style="background: linear-gradient(to right, rgba(255, 115, 113, 0.25),rgba(0, 170, 255,0.25) );">
			<view class="u-demo-block__content">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<view class="uni-uploader" v-if="phoerInfo.phoerShow[0]!==undefined">
					<view style="margin: 20rpx 10rpx;display: flex;flex-direction: row;" >
						<image src="/static/36x36.png" style="width: 50rpx;height: 50rpx; ">
						<u--text
							:text="'作品:  '+phoerInfo.symbolsTag"
							customStyle='color:rgb(1, 120, 204);'
						></u--text>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in symbols" :key="index">
								<view class="uni-uploader__file">
									<!-- 注：uni.preview函数写在这只能是不加括号的，不然会报错 -->
									<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewSymbols"></image>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			

			<!-- 提交提示弹出框 -->
			<u-modal
				:show="showModal"
				title="确定提交预约?"
				content="提交成功后,直到审核通过或驳回之前无法修改"
				showCancelButton
				closeOnClickOverlay
				@confirm="modalConfirm()"
				@cancel="() => showModal = false"
			></u-modal>
		</view>
	</view>
</template>

<script>
	let pdb = uniCloud.database().action('filterLowVersion').collection('photographer')
	let cdb = uniCloud.database().collection('chatMatch')
	let haveChatMatch=false
	import AES from '@/js_sdk/ar-aes/ar-aes.js'
import user from '../../store/modules/user'
	export default {
		data() {
			return {
				showModal:false,//提交确认框
				SubmitButtonText:'',
				inputDisable:true,
				phoerInfo: {
					name: '',
					phoneNumber: '',
					intro: '',
					symbolsTag:'',//作品名称
					symbolsUrl:[],
					phoerShow:[],//摄影师形象对象  本来可以直接用字符串的，但uni.preview的预览参数格式为uni.chooseimage返回的数组请求体格式
					
					userId:this.$store.state.user.info._id,
				},
				phoerShowName:'',
				symbols:[],//作品对象
				phoerId:'',//从phoerList点进来传来的参数
				presentCharacter:'',
				testV:"123",
				rules: {
					'name': [{
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					}, ],
					intro: {
						type: 'string',
						min: 3,
						required: true,
						message: '不低于3个字',
						trigger: ['change']
					},
				},
			}
		},
		onReady() {


		},
		onLoad(e) {		//根据传来的参数确定是什么角色点进来的
			// verifyOrder界面传过来  或  首页点击传过来
			if(e.phoerId){
				this.phoerId=e.phoerId  //其他页面传过来的
				// #ifdef APP-PLUS
				let version=plus.runtime.version
				// #endif
				// #ifdef H5 || MP
				let version='H5OrMP'
				// #endif
				pdb.where({
					version,
					userId:this.phoerId}).get().then(res=>{
					res.result.data=AES.AES.decrypt(res.result.data,'1234567891234567','1234567891234567')
					res.result.data=JSON.parse(decodeURIComponent(res.result.data))
					console.log(res.result.data);
					this.phoerInfo={...res.result.data[0]}
					this.symbols=this.phoerInfo.symbolsUrl
				})
				this.SubmitButtonText="返回"
			}else if(e.orderChoicePhoer){
				this.SubmitButtonText="预约"
				this.phoerInfo=JSON.parse(decodeURIComponent(e.orderChoicePhoer));
				this.symbols=this.phoerInfo.symbolsUrl
			}else{

			}
			//查询当前用户与该摄影师是否有聊天配对记录 没有则在跳转聊天时新建
			if(this.phoerInfo.workedUserId.includes(this.$store.state.user.info._id)){
				haveChatMatch=true
			}else{
				haveChatMatch=false
			}

		},
		methods: {
			goChat(){
				uni.navigateTo({
					url:'/pages/chat/person-chat?chattingUserId='+this.phoerInfo.userId+'&chattingUserAvatar='+this.phoerInfo.phoerShow[0]+'&chattingUserName='+this.phoerInfo.name,
					success:()=>{
						// 跳转时如果没有聊天配对则创建聊天配对
						if(!haveChatMatch && this.phoerInfo.userId!=this.$store.state.user.info._id){
							let phoer=this.phoerInfo
							let user=this.$store.state.user.info
							cdb.add({
								phoerId:phoer.userId,
								phoerAvatar:phoer.phoerShow[0],
								phoerName:phoer.name,
								userName:user.nickName,
								userId:user._id,
								userAvatar:user.avatar.url,//可能会报错 因为头像可能没设置
							})
							pdb.doc(this.phoerInfo._id).update({
								workedUserId:this.phoerInfo.workedUserId.push(this.$store.state.user.info._id)
							})
						}
					}
				})
			},
			backVOrder(){
				uni.navigateBack()
			},
			openModal(){
				this.showModal=true
			},
			modalConfirm(){
				this.showModal=false
				this.getImgUrlAndUpload()
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			// 代表作导入并预览  start
			previewPhoerShow: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.phoerInfo.phoerShow
				})
			},
			previewSymbols: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.symbols
				})
			},


			phoneCall(){
				console.log("phoneCall");
				// #ifdef H5 || MP
				uni.makePhoneCall({
					phoneNumber:this.phoerInfo.phoneNumber
				})
				// #endif
				//#ifdef APP-PLUS
				plus.device.dial(this.phoerInfo.phoneNumber,true)
				console.log('plus');
				// #endif
			},
			
			navYuyue(){
				if(this.$store.state.user.info._id==this.phoerInfo.userId){
					uni.showToast({
						title:"不能约自己，三次元没有小号",
						icon:"none"
					})
				}else{
					console.log("yuyue");
					uni.navigateTo({
						url:"/pages/order/order?orderChoicePhoer="+encodeURIComponent(JSON.stringify(this.phoerInfo)) 
					})
				}

			}
			
		},
	}
</script>

<style lang="scss">
.u-demo-block{
	margin-top: 750upx;
}
.uni-uploader {
	flex: 1;
	flex-direction: column;
}
.uni-uploader-head {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.uni-uploader-info {
	color: #B2B2B2;
}
.uni-uploader-body {
	margin-top: 16rpx;
}
.uni-uploader__files {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.uni-uploader__file {
	position: relative;
	margin: 11rpx;
	width: 210rpx;
	height: 210rpx;
}
.uni-uploader__img{
	display: block;
	width: 200rpx;
	height: 200rpx;
	border-radius: 10rpx;
}
.uni-uploader__input-box {
	position: relative;
	margin:10rpx;
	width: 208rpx;
	height: 208rpx;
	border: 2rpx solid #D9D9D9;
}
.uni-uploader__input-box {
	position: relative;
	margin:10rpx;
	width: 208rpx;
	height: 208rpx;
	border: 2rpx solid #D9D9D9;
}
.uni-uploader__input-box:before,
.uni-uploader__input-box:after {
	content: " ";
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	background-color: #D9D9D9;
}
.uni-uploader__input-box:before {
	width: 4rpx;
	height: 79rpx;
}
.uni-uploader__input-box:after {
	width: 79rpx;
	height: 4rpx;
}
.uni-uploader__input-box:active {
	border-color: #999999;
}
.uni-uploader__input-box:active:before,
.uni-uploader__input-box:active:after {
	background-color: #999999;
}
.uni-uploader__input {
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}
.close{
	position: absolute;
	right: 0;
	background-color: rgba(0, 0, 0, .4);
	color:#fff;
	z-index:10
}	
	/* 胶囊*/
	 .nav-bar {
	 top: 13rpx;
	  z-index:2;
	  margin-left: 5%;
	  margin-top: 0;
	  height: 60rpx;
	  width: 30%;
	  position: relative;
	  display: flex;
	  justify-content: space-evenly;
	  align-items: center;
	  background-color: rgba(0, 0, 0, 0.25);
	  border-radius: 1000rpx;
	  border: 1rpx solid rgba(255, 255, 255, 0.5);
	}
  /* 间隔线 start*/
  .tn-strip-bottom {
	top: 0;
	position: absolute;
    width: 100%;
    border-bottom: 20rpx solid rgba(241, 241, 241, 0.8);
  }
   /* 间隔线 end*/
   
  /* 相册 */
  .slideshow {
    width: 100vw;
    height: 700upx;
    overflow: hidden;
  }

  .slideshow-image {
    width: 100%;
    height: 100%;
    background: no-repeat 50% 50%;
    background-size: cover;
    opacity: 1;
    transform: scale(1.2);
  }
</style>
