<template>
	<view>
		<uni-list :border="true" v-for="(item,index) in chatGroup" :key="index">
		    <!-- 头像显示角标 -->
		    <!-- <uni-list-chat title="uni-app" avatar="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png" note="您收到一条新的消息" time="2020-02-02 20:20" badge-positon="left" badge-text="99"></uni-list-chat> -->
		    <uni-list-chat @click="goDetail(item,'phoer')" :clickable="true" v-if="item.phoerId==senderId && item.chatMsg.length===0" :title="item.userName" :avatar="item.userAvatar" :note="'与用户'+item.userName+'的聊天'" time="" badge-positon="left" ></uni-list-chat>
		    <uni-list-chat @click="goDetail(item,'phoer')" :clickable="true" v-else-if="item.phoerId==senderId && item.chatMsg.length>0" :title="item.userName" :avatar="item.userAvatar" :note="item.chatMsg[item.chatMsg.length-1].content.text" :time="item.chatMsg[item.chatMsg.length-1].sendTime" badge-positon="left" :badge-text="item.unReadNum>0?item.unReadNum:''" ></uni-list-chat>
		   
			<uni-list-chat @click="goDetail(item,'user')" :clickable="true" v-else-if="item.userId==senderId && item.chatMsg.length===0" :title="item.phoerName" :avatar="item.phoerAvatar" :note="'与摄影师'+item.phoerName+'的聊天'" time="" badge-positon="left"></uni-list-chat>
			<uni-list-chat @click="goDetail(item,'user')" :clickable="true" v-else-if="item.userId==senderId && item.chatMsg.length>0" :title="item.phoerName" :avatar="item.phoerAvatar" :note="item.chatMsg[item.chatMsg.length-1].content.text" :time="item.chatMsg[item.chatMsg.length-1].sendTime" badge-positon="left" :badge-text="item.unReadNum>0?item.unReadNum:''" ></uni-list-chat>
<!-- 			<uni-list-chat title="uni-app" avatar="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png" note="您收到一条新的消息" time="2020-02-02 20:20" badge-positon="left" badge-text="dot">
			    <view class="chat-custom-right">
					<text>时间</text> -->
					<!-- 需要使用 uni-icons 请自行引入 -->
<!-- 					<button type='warn' plain="false" size="mini" style="margin-top: 10rpx;">delete</button>
				</view>
			</uni-list-chat> -->
		</uni-list>
	</view>
</template>

<script>
	let db =uniCloud.database().collection('chatMatch')
	export default {
		props:{
			chatGroup:{
				type:Array
			}
		},
		data(){
			return{
				data:'',
				senderId:this.$store.state.user.info._id,
				lastMsgContent:[]
			}
		},
		methods:{
			goDetail(item,character){
				if(character=='phoer'){
					uni.navigateTo({
						url:'./person-chat?chattingUserCid='+item.userPushId+'&chattingUserAvatar='+item.userAvatar+'&chattingUserName='+item.userName+'&chatMatchId='+item.chatMatchId+'&loginUserAvatar='+item.phoerAvatar,
					})
				}else if(character=='user'){
					uni.navigateTo({
						url:'./person-chat?chattingUserCid='+item.phoerPushId+'&chattingUserAvatar='+item.phoerAvatar+'&chattingUserName='+item.phoerName+'&chatMatchId='+item.chatMatchId,
					})
				}

			}
		},
		onLoad() {
			// db.where("auth.uid in chatUserInfo.uid").get().then(res=>{
			// 	this.chatGroup=res.result.data
			// })
			// for(var i in chatGroup){
			// 	// 最后一条消息就是最新消息
			// 	this.lastMsgContent.push(i[i.length])
			// }
		},
		watch:{
			chatGroup(){
				
			}
		}
	}
</script>

<style>
.chat-custom-right{
	display: flex;
	flex-direction: column;
}
</style>