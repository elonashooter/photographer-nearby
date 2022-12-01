<template>
	<view class="u-page" v-if="showWaitingPage">
		<u--text
			text='申请审核中,请耐心等待'
			type="warning"
		></u--text>
	</view>
	<view class="u-page" v-else>
		<view class="u-demo-block">
			<u--text
				v-if="phoerInfo.rejectReason&&phoerInfo.rejectReason!==''"
				:text="'申请已被驳回,理由为:\n'+phoerInfo.rejectReason"
				type="warning"
			></u--text>
			<u-line></u-line>
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
						></u--input>

						<uni-icons type='phone' size='30' color="#55aa00" @click="phoneCall"></uni-icons>
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
											<uni-icons type="closeempty" class="close" size="20" @click="DelPShow()" v-if="!showLoading"></uni-icons>
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
							placeholder="填写擅长的内容，也可当个性签名使用,要求精简"
							v-model="phoerInfo.intro"
							count
							confirmType="done"
							:disabled="inputDisable"
							count
							maxlength='25'
						></u--textarea>
					</u-form-item>
					<u-form-item
						label="作品"
						prop="symbols"
						ref="item5"
					>
					</u-form-item>
					<view class="uni-uploader" v-if="phoerInfo.phoerShow[0]!==undefined">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title">点击可预览选好的图片</view>
							<view class="uni-uploader-info">{{symbols.length}}/9</view>
						</view>
						<!-- <imagePicker :images="symbols" imageName="symbolsOf " count=9  @delImg='DelSymbols'></imagePicker> -->
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in symbols" :key="index">
									<view class="uni-uploader__file">
										<!-- 注：uni.preview函数写在这只能是不加括号的，不然会报错 -->
										<uni-icons type="closeempty" class="close" size="20" @click="DelImg(index)" v-if="!showLoading"></uni-icons>
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
							text='作品关键词'
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
							:text="'作品关键词:  '+phoerInfo.symbolsTag"
							type="warning"
						></u--text>
					</view>
					<u-line></u-line>
				</u--form>
				<u-button
					type="primary"
					:text="phoerId==''?'提交加入':'提交修改'"
					customStyle="margin-top: 30px"
					@click="submit()"
				></u-button>
			</view>
			
<!-- 			symbolUploadMsg
			<view class="uni-uploader-body">
				<view class="uni-uploader__files">
					<block v-for="(image,index) in symbolsUploadMsg" :key="index">
						<view class="uni-uploader__file">
							<image class="uni-uploader__img" mode="aspectFill" :src="image.url" :data-src="image" @tap="previewSymbols"></image>
						</view>
					</block>
				</view>
			</view>
			phoerInfo.symbols
			<view class="uni-uploader-body">
				<view class="uni-uploader__files">
					<block v-for="(image,index) in phoerInfo.symbolsUrl" :key="index">
						<view class="uni-uploader__file">
							<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewSymbols"></image>
						</view>
					</block>
				</view>
			</view> -->
			
			
			<view style="margin-top: 25rpx;">
				用户查看到的效果：
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
			
			<u-loading-page
			    :loadingText=loadingText
				image='/static/11layCircle.png'
				iconSize='200'
			    bgColor="#ffffff"
			    :loading="showLoading"
			    color="#ff5500"
			>
			</u-loading-page>
		</view>
	</view>
</template>

<script>
	// import imagePicker from '../HzComponents/imagePicker.vue'
	let pdb=uniCloud.database().collection('photographer')
	let ppdb=uniCloud.database().collection('pre-photographer')
	let initAvatar=''
	let symbols_online=[]//读取到的已存在云端的图，用于给DELIMG方法识别
	let phoerShowHistory=[]
	let symbolsHistory=[]
	export default {
		// components{
		// 	imagePicker
		// },
		data() {
			return {
				symbolsUploadMsg:[],
				showPopup:false,//个人形象说明框
				showModal:false,//提交确认框
				showWaitingPage:false,//提交信息在审核中的显示页面参数
				showLoading:false,
				inputDisable:false,
				phoerInfo: {
					name: '',
					phoneNumber: '',
					intro: '',
					symbolsTag:'',//作品名称
					symbolsUrl:[],
					phoerShow:[],//摄影师形象对象  本来可以直接用字符串的，但uni.preview的预览参数格式为uni.chooseimage返回的数组请求体格式
					userId:this.$store.state.user.info._id,
					push_clientid:''
				},
				phoerShowName:'',
				symbols:[],//作品对象
				phoerId:'',//从phoerList点进来传来的参数
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
				loadingText:"夹崽中"
			}
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.form1.setRules(this.rules)
			
		},
		onLoad(e) {		//根据传来的参数确定是什么角色点进来的
			// 只有摄影师与新摄影师
			// console.log(this.$store.state.user.info);
			if(e.phoerId){
				// 摄影师提交修改
				// console.log("onload get an e");
				// console.log(e);
				this.phoerId=e.phoerId  //其他页面传过来的
				ppdb.where({userId:this.phoerId}).orderBy('create_time').get().then(res=>{
					// console.log("ppdb");
					// console.log(res.result.data);
					this.phoerInfo=res.result.data[res.result.data.length-1] //最新数据
					// console.log(this.phoerInfo);
					this.symbols=this.phoerInfo.symbolsUrl
					symbols_online=this.phoerInfo.symbolsUrl
					initAvatar=this.phoerInfo.phoerShow[0]
					delete this.phoerInfo._id  //删除_id用于新增
					phoerShowHistory=this.phoerInfo.phoerShowHistory.concat()
					symbolsHistory=this.phoerInfo.symbolsHistory
					if(this.phoerInfo.AuditStatus!==0){
						this.inputDisable=false
						this.getPushClientId()
					}else{
						this.showWaitingPage=true
					}
				})

			}else{
				//新摄影师申请
				this.inputDisable=false
				ppdb.where({
					userId:this.phoerInfo.userId
				}).get().then(res=>{
					console.log('ppdb');
					console.log(res);
					if(res.result.data.length>0){
						this.phoerInfo=res.result.data.slice(-1)[0]
						if(this.phoerInfo.AuditStatus==0){
							//库里有申请中数据，则页面显示请耐心等待
							this.showWaitingPage=true
						}else{
							//库里有已通过或已驳回数据  则页面可编辑
							this.phoerId=e.phoerId 
							this.symbols=this.phoerInfo.symbolsUrl
							initAvatar=this.phoerInfo.phoerShow[0]
							delete this.phoerInfo._id  //删除_id用于新增
							this.getPushClientId()
						}
					}else{
						this.setDefaultValue()
						this.getPushClientId()
					}
				})
			}

		},
		methods: {
			loading(loadingText){
				this.showLoading=true
				loadingText?this.loadingText=loadingText:''
			},
			HideLoading(){
				this.showLoading=false
			},
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
				// console.log("phoerInfo");
				// console.log(this.phoerInfo);
				this.getImgUrlAndUpload();
			},
			setDefaultValue(){
				this.phoerInfo.name=this.$store.state.user.info.nickname,
				this.phoerInfo.phoneNumber=this.$store.state.user.info.mobile
			},
			getPushClientId(){
				uni.getPushClientId({
						success: (res) => {
							// console.log('获取手机识别码成功')
							// console.log(res.cid);
							this.phoerInfo.push_clientid=res.cid
						},
						fail(err) {
							console.log('获取手机识别码失败')
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
			// 头像上传 1
			choosePShow(){
				sizeType:'compressed',
				uni.chooseImage({
					count:1,
					success: (res) => {//H5端和app端的返回res是不一样的
						 
						this.phoerInfo.phoerShow=this.phoerInfo.phoerShow.concat(res.tempFilePaths)
						this.phoerShowName="phoerShowNameOf "+this.$store.state.user.info._id
						// console.log(res);
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
				}),
				console.log(this.phoerInfo.phoerShow);
			},
			chooseSymbols(){
				uni.chooseImage({
					sizeType:'compressed',
					count: 9,
					// sourceType: 'album',
					// sizeType: 'original',
					success: (res) => {
						console.log(res);
						this.symbols=this.symbols.concat(res.tempFilePaths)
						 
						//这样写有个好处  摄影师修改信息时只会上传symbolsUploadMsg新增的照片
						for(let i=0;i<res.tempFilePaths.length;i++){
							this.symbolsUploadMsg.push({  //增删新图
								name:"symbolsOf "+this.$store.state.user.info._id+" "+this.symbolsUploadMsg.length.toString(),
								url:res.tempFilePaths[i]
							})
						}
					},
				})
			},// 代表作导入并预览  end
			// DelSymbols(item){
			// 	this.phoerInfo.symbolsUrl=this.phoerInfo.symbolsUrl.filter((x)=>x!=item)
			// },
			DelImg(index){
				//判断要删的对象是本地新上传的还是online已有的
				console.log(symbols_online);
				if(symbols_online.includes(this.symbols[index])){
					console.log('symbols deleted');
					this.phoerInfo.symbolsUrl=this.phoerInfo.symbolsUrl.filter((x)=>x!=this.symbols[index])
					// this.phoerInfo.symbolsUrl.splice(this.phoerInfo.symbolsUrl.indexOf(this.symbols[index]),1)
				}else{
					console.log('this.symbolsUploadMsg deleted');
					this.symbolsUploadMsg=this.symbolsUploadMsg.filter((x)=>x.url!=this.symbols[index])//增删新图
					// for(var i of this.symbolsUploadMsg){
					// 	if(i.url==this.symbols[index]){
					// 		this.symbolsUploadMsg.splice(this.symbolsUploadMsg.indexOf(i),1)
					// 	}
					// }
					// console.log(this.symbolsUploadMsg[0].url==this.symbols[index]);
					// console.log(this.symbolsUploadMsg);
				}
				this.symbols.splice(index,1)

			},
			// 头像改动 1
			DelPShow(){
				this.phoerInfo.phoerShow=[]
			},
			
			phoneCall(){
				console.log("phoneCall");
				// console.log(typeof(this.phoerInfo.phoneNumber));
				// #ifdef H5 || MP
				uni.makePhoneCall({
					phoneNumber:phoneNumber
				})
				// #endif
				//#ifdef APP-PLUS
				plus.device.dial(phoneNumber,true)
				console.log('plus');
				// #endif
			},
			submit() {
				// 校验表单  如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				if(this.phoerInfo.phoerShow[0]!=undefined&&this.symbols[0]!=undefined){
					this.$refs.form1.validate().then(res => {
						uni.$u.toast('信息填写校验通过')
						this.openModal()
					}).catch(errors => {
						uni.$u.toast('请完整填写数据')
					})
				}else{
					uni.$u.toast('还没上传个人形象或代表作哦')
				}

			},
			uploadMsg(){
					//用户申请一般流程
				this.loading("正在提交信息")
				ppdb.add({...this.phoerInfo,
					AuditStatus:0,
					symbolsHistory:symbolsHistory,
					phoerShowHistory:phoerShowHistory}).then((res) => {

							this.HideLoading()

							uni.showToast({
								icon: 'none',
								title: '提交成功'
							})
							setTimeout(() => uni.reLaunch({
								url:"/pages/home/home"
							}), 500)
						}).catch((err) => {
								uni.showModal({
									content: err.message || '请求服务失败',
									showCancel: false
								})
							})
				
			},
			getImgUrlAndUpload(){
				this.loading()
				//上传个人形象
				if (this.phoerInfo.phoerShow[0]!=initAvatar || initAvatar=='') {
					this.loading("正在上传个人形象")
					uniCloud.uploadFile({
					filePath: this.phoerInfo.phoerShow[0],
					cloudPath: this.phoerShowName,
					success:(res)=>{
						console.log("phoerShow upload success");
						console.log(res);
						this.phoerInfo.phoerShow[0]=res.fileID
						phoerShowHistory=phoerShowHistory.concat(res.fileID)
						//上传代表作
						this.uploadSymbols()
						},
					fail(e) {
						console.log("img upload fail");
						 console.log(e);
					},
					});
				}else{
					this.uploadSymbols()
				}

			},
			uploadSymbols(){
				if(this.symbolsUploadMsg.length>0){
					this.loading("正在上传作品")
					for(var i of this.symbolsUploadMsg){
						uniCloud.uploadFile({
							filePath:i.url,
							cloudPath:i.name,
							success:(res)=> {
								this.phoerInfo.symbolsUrl.push(res.fileID)
								symbolsHistory=symbolsHistory.concat(res.fileID)
								console.log("res.fileID");
								console.log(res.fileID);
								// 上传的图片连接等于返回的代表作链接  意味着图片上传完毕 url获取完毕 可以上传了
								if(this.phoerInfo.symbolsUrl.length==this.symbols.length){
									this.uploadMsg()
								}else{
									console.log(this.phoerInfo.symbolsUrl);
									console.log(this.symbols);
								}
							},
							fail: (res) => {
								this.HideLoading()
								console.log('uploadSymbols fail');
								console.log(res);
							}
						})		
					}
				}else{
					this.uploadMsg()
				}
			}
		},
	}
</script>

<style lang="scss">
	@import '../../common/imagePicker.scss'
</style>
