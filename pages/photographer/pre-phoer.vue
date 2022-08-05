<template>
	<view class="u-page" v-if="showWaitingPage">
		<u--text
			text='申请审核中,请耐心等待'
			type="warning"
		></u--text>
	</view>
	<view class="u-page" v-else>
		<view class="u-demo-block">
			<text class="u-demo-block__title">摄影师信息编辑</text>
			<view class="u-demo-block__content">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form labelPosition="left" :model="phoerInfo" ref="form1">
					<u-form-item
						label="姓名"
						prop="name"
						borderBottom
						ref="item1"
					>
						<u--input
							v-model="phoerInfo.name"
							border="none"
							placeholder="中文姓名"
							:disabled="inputDisable"
						></u--input>
						<span style="margin:0ch 1ch;">电话</span>
						<u--input
							v-model="phoerInfo.phoneNumber"
							border="none"
							placeholder="联系电话"
							:disabled="inputDisable"
						>
							<template slot="suffix">
								<u-icon
									size="28"
									name='phone'
									@click="phoneCall()"
								></u-icon>
							</template>
						</u--input>
					</u-form-item>
					<u-form-item
						label=""
						borderBottom
						ref="item2"
					>
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title">个人形象</view>
								<view class="uni-uploader-info">								
								<u-button
									text="说明"
									type="warning"
									size="small"
									@click="popupOpen()"
								></u-button></view>
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image,index) in phoerInfo.phoerShow" :key="index">
										<view class="uni-uploader__file">
											<image class="uni-uploader__img" :src="image" mode="aspectFill" :data-src="image" @tap="previewPhoerShow"></image>
										</view>
									</block>
									<view class="uni-uploader__input-box" v-if="phoerInfo.phoerShow[0]==undefined">
										<view class="uni-uploader__input" @tap="choosePShow()"></view>
									</view>
								</view>
							</view>
						</view>
					</u-form-item>

					<u-form-item
						label="自荐"
						prop="intro"
						borderBottom
						ref="item3"
					>
						<u--textarea
							placeholder="填写擅长的内容，也可当个性签名使用"
							v-model="phoerInfo.intro"
							count
							confirmType="done"
							:disabled="inputDisable"
						></u--textarea>
					</u-form-item>
					<u-form-item
						label="代表作"
						prop="symbols"
						ref="item5"
					>
					</u-form-item>
					<view class="uni-uploader" v-if="phoerInfo.phoerShow[0]!==undefined">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title">点击可预览选好的图片</view>
							<view class="uni-uploader-info">{{symbols.length}}/9</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in symbols" :key="index">
									<view class="uni-uploader__file">
										<!-- 注：uni.preview函数写在这只能是不加括号的，不然会报错 -->
										<uni-icons type="closeempty" class="close" size="20" @click="DelImg(index)"></uni-icons>
										<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewSymbols"></image>
									</view>
								</block>
								<view class="uni-uploader__input-box">
									<view class="uni-uploader__input" @tap="chooseSymbols()"></view>
								</view>
							</view>
						</view>
					</view>
					<view style="margin: 20rpx 10rpx;">
						<u--text
							text='作品名称'
							type="warning"
						></u--text>
						<u--input
							v-model="phoerInfo.symbolsTag"
							placeholder="用户可能会根据名字查找照片"
							border="surround"
							shape="circle"
							:disabled="inputDisable"
						></u--input>
					</view>
					<view style="margin: 20rpx 10rpx;" >
						<u--text
							:text="'作品名:  '+phoerInfo.symbolsTag"
							type="warning"
						></u--text>
					</view>
					<u-line></u-line>
				</u--form>
				<u-button
					type="primary"
					:text="phoerId==''?'提交加入':'提交修改'"
					customStyle="margin-top: 30px"
					@click="submit('enter')"
				></u-button>
			</view>
			
			<view style="margin-top: 25rpx;">
				用户查看到的效果：
				<u-list>
					<u-list-item>
						<u-cell
							:title="phoerInfo.name"
							:value="phoerInfo.intro"
							center
							:label="phoerInfo.phoneNumber"
						>
							<u-avatar
								slot="icon"
								shape="square"
								size="70"
								:src="phoerInfo.phoerShow[0]"
								customStyle="margin: -3px 5px -3px 0"
								mode="aspectFill"
							></u-avatar>
						</u-cell>
					</u-list-item>
				</u-list>
			</view>
			<!-- “个人形象”弹出框 -->
			<u-popup
				mode="right"
				:show="showPopup"
				round="0"
				@close="popupClose()"
				@open="popupOpen()"
			>
				<view class="u-page">
					<view class="u-demo-block">
						<text class="u-demo-block__title">能力审核</text>
						<view class="u-demo-block__content">
							<view class="text-item">
								<u--text text="请提交一张"></u--text>
								<u--text text="最能体现个人摄影水平的\n形象照," type='error'></u--text>
								<u--text text="此照用以确认申请人为本人\n同时确认申请人水平"></u--text>
							</view>
						</view>
					</view>
					<view class="u-demo-block">
						<text class="u-demo-block__title">可使用头像</text>
						<!-- 若已同步为头像，则返回true 否则返回false 1/3-->
						<view class="u-demo-block__content" v-if="AvatarSet()">
							<view class="text-item">
								<u--text 
								text="已将个人形象照设为头像"
								type="success"
								></u--text>
							</view>
						</view>
						<!-- 若已同步为头像，则返回true 否则返回false 2/3 -->
						<view class="u-demo-block__content" v-else>
							<view class="text-item">
								<u--text text="若已将个人形象照设为头像"></u--text>
								<u--text text="可直接点击"></u--text>
								<u-button
									text="同步头像"
									type="success"
									size="normal"
									@click="SynAvatar()"
								></u-button>
							</view>
						</view>

					</view>
					<view class="u-demo-block">
						<text class="u-demo-block__title">肖像权</text>
						<view class="u-demo-block__content">
							<view class="text-item">
								<u--text text="此照片仅用于\n让用tong户xue在此app内搜到\n"></u--text>
							</view>
						</view>
					</view>
					<view class="u-demo-block">
						<text class="u-demo-block__title">tip:</text>
						<view class="u-demo-block__content">
							<view class="text-item">
								<u--text text="价格可以与摄影师协商,\n双方达成共识后支付" type="warning"></u--text>
							</view>
							<u-button
								type="warning"
								text="点我关闭"
								customStyle="width: 200rpx;margin-top:10rpx"
								@click="popupClose()"
							></u-button>
						</view>
					</view>
				</view>
			</u-popup>
			<!-- 提交提示弹出框 -->
			<u-modal
				:show="showModal"
				title="确认信息填写无误"
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
	export default {
		data() {
			return {
				showPopup:false,//个人形象说明框
				showModal:false,//提交确认框
				showWaitingPage:false,//提交信息在审核中的显示页面参数
				inputDisable:'',
				phoerInfo: {
					name: '',
					phoneNumber: '',
					intro: '',
					symbolsTag:'',//作品名称
					symbolsUrl:[],
					phoerShow:[],//摄影师形象对象  本来可以直接用字符串的，但uni.preview的预览参数格式为uni.chooseimage返回的数组请求体格式
					phoerShowUrl:"",//摄影师形象连接
					userId:this.$store.state.user.info._id,
				},
				phoerShowName:'',
				symbolsUploadMsg:[],
				symbols:[],//作品对象
				symbols_online:[],//读取到的已存在云端的图，用于给DELIMG方法识别
				symbols_delete:[],
				phoerId:'',//从phoerList点进来传来的参数
				character:this.$store.state.user.character,
				isWP_manager:this.$store.state.user.WP_manager,
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
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			// this.$refs.form1.setRules(this.rules)
		},
		onLoad(e) {		//根据传来的参数确定是什么角色点进来的
			// 只有摄影师与新摄影师
			if(e.phoerId){
				// 摄影师提交修改
				console.log("onload get an e");
				console.log(e);
				this.phoerId=e.phoerId  //其他页面传过来的
				this.ppdb.where({userId:this.phoerId}).orderBy('create_time').get().then(res=>{
					// console.log("ppdb");
					console.log(res.result.data);
					this.phoerInfo=res.result.data[res.result.data.length-1] //最新数据
					this.symbols=this.phoerInfo.symbolsUrl
					this.symbols_online=this.phoerInfo.symbolsUrl
				})
				this.inputDisable=!this.phoerInfo.AuditStatus //AuditStatus=true为审核完毕 可修改   false为审核中 不可修改
				
				
			}else{
				//新摄影师申请
				this.inputDisable=false
				this.setDefaultValue()
				//新摄影师已在申请
				this.ppdb.where({
					userId:this.phoerInfo.userId
				}).get().then(res=>{
					console.log('ppdb');
					console.log(res);
					if(res.result.data.slice(-1)[0].AuditStatus==false){
						//库里有申请数据，则页面显示请耐心等待
						this.showWaitingPage=true
					}
				})
			}
			this.init()
		},
		methods: {
			popupOpen() {
				// console.log('open');
				this.showPopup = true
			},
			popupClose() {
				this.showPopup = false
				// console.log('close');
			},
			openModal(){
				this.showModal=true
			},
			modalConfirm(){
				this.showModal=false
				// switch(this.buttonAction){
				// 	case 'enter':
				// 		this.getImgUrlAndUpload();
				// 		break
				// 	case 'edit':
				// 		this.push_NewImg_Edit()
				// 		break
				// }
				this.getImgUrlAndUpload();
			},
			navigateBack() {
				uni.navigateBack()
			},
			//同步头像
			SynAvatar(){
				// console.log(this.$store.state.user.info.avatar_file.url);
				if(this.$store.state.user.info.avatar_file.url!==undefined){
					// let AvatarUrl=Afile.url
					this.phoerInfo.phoerShow.push(this.$store.state.user.info.avatar_file.url)
					this.phoerShowName="avatar of "+this.$store.state.user.info._id
				}
			},
			AvatarSet(){
				if(this.phoerInfo.phoerShow[0]==this.$store.state.user.info.avatar_file.url){
					return true
				}else{
					return false
				}
			},
			setDefaultValue(){
				this.phoerInfo.name=this.$store.state.user.info.nickname,
				this.phoerInfo.phoneNumber=this.$store.state.user.info.mobile
				
			},
			submit(action) {
				// 校验表单  如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				if(this.symbolsUploadMsg[0]!==undefined){
					this.$refs.form1.validate().then(res => {
						uni.$u.toast('信息填写校验通过')
					}).catch(errors => {
						uni.$u.toast('请完整填写数据')
					})
				}else{
					uni.$u.toast('还没上传代表作哦')
				}
				this.openModal()
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			init(){ //初始化  phoer表有此id的数据则读取，没有数据则默认账户姓名和联系电话
				this.pdb.where({
					userId:this.$store.state.user.info._id
				}).get().then(res=>{
					if(res._id){
						this.phoerInfo={...res}
					}
					else{
						this.name=this.$store.state.user.info.nickname,
						this.phoneNumber=this.$store.state.user.info.mobile
					}
				})
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
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid('android.permission.READ_EXTERNAL_STORAGE');
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			},
			choosePShow(){
				uni.chooseImage({
					count:1,
					success: (res) => {
						this.phoerInfo.phoerShow=this.phoerInfo.phoerShow.concat(res.tempFilePaths)
						this.phoerShowName=res.tempFiles[0].name
						// console.log(res.tempFiles[0].name);
					},
					fail: (err) => {
						console.log("err: ",err);
						// #ifdef APP-PLUS
						this.checkPermission();
						// #endif
						// #ifdef MP
						if(err.errMsg.indexOf('cancel') !== '-1'){
							return;
						}
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								authStatus = res.authSetting['scope.album'];
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '获取相册图片权限失败，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			chooseSymbols(){
				uni.chooseImage({
					count: 9,
					// sourceType: 'album',
					// sizeType: 'original',
					success: (res) => {
						// console.log(res);
						this.symbols=this.symbols.concat(res.tempFilePaths)
						//这样写有个好处  摄影师修改信息时只会上传symbolsUploadMsg新增的照片
						for(let i=0;i<res.tempFilePaths.length;i++){
							this.symbolsUploadMsg.push({
								name:res.tempFiles[i].name,
								url:res.tempFilePaths[i]
							})
						}
					},
				})
			},// 代表作导入并预览  end
			DelImg(index){
				//判断要删的对象是本地新上传的还是online已有的
				if(this.symbols[index] in this.symbols_online){
					this.symbols_online=this.symbols_online.filter((x)=>x!==this.symbols[index])
				}else{
					this.symbolsUploadMsg.splice(index,1)
				}
				this.symbols.splice(index,1)

			},
			
			phoneCall(){
				console.log("phoneCall");
				// #ifdef APP-PLUS
				uni.makePhoneCall({
					phoneNumber:this.phoerInfo.phoneNumber
				})
				// #endif
			},
			uploadMsg(){
				this.ppdb.add(this.phoerInfo).then((res) => {
				  uni.showToast({
				    icon: 'none',
				    title: '提交成功'
				  })
				  // debugger
				  this.getOpenerEventChannel().emit('refreshData')
				  // setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
				  uni.showModal({
				    content: err.message || '请求服务失败',
				    showCancel: false
				  })
				})
			},
			getImgUrlAndUpload(){
				//上传个人形象
				let that = this
				if (this.phoerInfo.phoerShow[0]!==undefined) {
					uniCloud.uploadFile({
					filePath: this.phoerInfo.phoerShow[0],
					cloudPath: this.phoerShowName,
					success(res){
						console.log("success");
						console.log(res);
						that.phoerInfo.phoerShowUrl=res.fileID
						}
					});
				}else{
					return this.$u.toast("请上传个人形象照")
				}
				//删除云图
				// if(this.symbols_delete!==[]){
				// 	uniCloud.deleteFile({
				// 		fileList:this.symbols_delete
				// 	})
				// }

				//上传代表作
				if(this.symbols){
					//无法一次性上传多张  只能循环上传了
					// debugger
					for(var i of this.symbolsUploadMsg){
						uniCloud.uploadFile({
							filePath:i.url,
							cloudPath:i.name,
							success(res) {
								that.phoerInfo.symbolsUrl.push(res.fileID)
								// 上传的图片连接等于返回的代表作链接  意味着图片上传完毕 url获取完毕 可以上传了
								if(that.phoerInfo.symbolsUrl.length==that.symbols.length){
									that.uploadMsg()
								}
							}
						})		
					}
					//循环完毕后 若返回的链接数与当前页面代表作数不符 那就是还有已上传的部分要合并
					if(this.phoerInfo.symbolsUrl.length!==this.symbols.length){
						this.phoerInfo.symbolsUrl=this.phoerInfo.symbolsUrl.concat(this.symbols_online)
						this.uploadMsg()
					}
				}
				
			},
		},
	}
</script>

<style lang="scss">
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
	margin: 10rpx;
	width: 210rpx;
	height: 210rpx;
}
.uni-uploader__img{
	display: block;
	width: 210rpx;
	height: 210rpx;
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
</style>
