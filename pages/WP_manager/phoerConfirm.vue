<template>
	<view class="">
		<u-list>
			<u-list-item
				v-for="(item, index) in phoerList"
				:key="index"
			>
				<u-cell
					:title="item.name"
					:label="item.phoneNumber"
					center
				>
					<u-avatar
						slot="icon"
						shape="square"
						size="70"
						:src="item.phoerShow[0]"
						customStyle="margin: -3px 5px -3px 0"
						mode="aspectFill"
					></u-avatar>
					<view
						slot="value"
						class="u-slot-title"
					>
						<button size='mini' @click="cancelWPPhoer(item)" v-if="item.isWPPhoer">撤销平台摄影师</button>
						<button size='mini' @click="setWPPhoer(item)" v-else>设为平台摄影师</button>
					</view>
				</u-cell>
			</u-list-item>
			
		</u-list>
	</view>
</template>

<script>
	const pdb =uniCloud.database().collection('photographer')
	export default{
		data(){
			return{
				phoerList:[]
			}
		},
		methods:{
			getPhoerList(){
				this.phoerList=[]
				pdb.get().then((res)=>{
					if(res.result.data.length>0){
						for(var i of res.result.data){
							this.phoerList.push(i)
						}
					}
				}).catch(e=>{
					console.log('phoerlist catch');
					console.log(e);
				})
			},
			setWPPhoer(item){
				pdb.doc(item._id).update({
					isWPPhoer:true
				}).then(e=>{
					uni.$u.toast("已设为平台摄影师")
					item.isWPPhoer=true
				})
			},
			cancelWPPhoer(item){
				pdb.doc(item._id).update({
					isWPPhoer:false
				}).then(e=>{
					uni.$u.toast("已撤销平台摄影师")
					item.isWPPhoer=false
				})
			}
		},
		onShow() {
			this.getPhoerList()
		},
		
	}
</script>

<style>
</style>