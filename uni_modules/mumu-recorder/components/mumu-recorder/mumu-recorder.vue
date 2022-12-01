<template>
	<view class="recorder">
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	// #endif

	export default {
		data() {
			return {
				isUserMedia: false,
				stream: null,
				audio: null,
				recorder: null,
				chunks: [],
				startTime: 0,
				voicePath: '',
			}
		},
		mounted() {
			/**
			 * 	error 事件的返回状态
			 * 	100: 请在HTTPS环境中使用
			 * 	101: 浏览器不支持
			 *  201: 用户拒绝授权
			 *  500: 未知错误
			 * */
		    // #ifdef H5
				if (origin.indexOf('https') === -1) {
					this.$emit('error', '100')
					throw '请在 https 环境中使用本插件。'
				}
				
				if (!navigator.mediaDevices || !window.MediaRecorder) {
					this.$emit('error', '101')
					throw '当前浏览器不支持'
				}
				
				this.getRecorderManager()
			// #endif
			
			
		},
		created() {
			// #ifdef APP-PLUS
				let self = this;
				recorderManager.onStop(function (res) {
					console.log('recorder stop' + JSON.stringify(res));
					self.voicePath = res.tempFilePath;
					const endTime = new Date().getTime()
					
					let duration = (endTime - self.startTime).toString().split('')
					duration.splice(duration.length - 2)
					duration.splice(duration.length - 1, 0, '.')
					duration = parseFloat(duration.join(''))
					self.startTime = 0
					const recorder = {
						duration: duration,
						localUrl: res.tempFilePath
					}
					self.$emit('success', recorder)
				});
			// #endif
		},
		methods: {
			reSet(){
				this.stream = null;
				this.audio = null;
				this.recorder = null;
				this.chunks = [];
				//this.startTime = 0;
			},
			getRecorderManager() {
				this.audio = document.createElement('audio')
				navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
					this.isUserMedia = true
					stream.getTracks().forEach((track) => {
						track.stop()
					})
				}).catch(err => {
					this.onErrorHandler(err)
				})
			},
			start() {
				// #ifdef H5
					if (!this.isUserMedia) return console.log('设备不支持')
					
					navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
						this.startTime = new Date().getTime()
						this.stream = stream
						this.recorder = new MediaRecorder(stream)
						this.recorder.ondataavailable = this.getRecordingData
						this.recorder.onstop = this.saveRecordingData
						this.recorder.start()
					}).catch(err => {
						this.onErrorHandler(err)
					})
				// #endif
				
				// #ifdef APP-PLUS
					console.log('开始录音');
					this.startTime = new Date().getTime()
					recorderManager.start();
				// #endif
			},
			stop() {
				if(this.startTime === 0){
					return
				}
				// #ifdef H5
				this.recorder.stop()
				this.stream.getTracks().forEach((track) => {
					track.stop()
				})
				// #endif
				
				// #ifdef APP-PLUS
				console.log('录音结束');
				let self = this;
				recorderManager.onStop(function (res) {
					//console.log('recorder stop' + JSON.stringify(res));
					self.voicePath = res.tempFilePath;
					const endTime = new Date().getTime()
					
					let duration = (endTime - self.startTime).toString().split('')
					duration.splice(duration.length - 2)
					duration.splice(duration.length - 1, 0, '.')
					duration = parseFloat(duration.join(''))
					self.startTime = 0
					const recorder = {
						duration: duration,
						localUrl: res.tempFilePath
					}
					self.$emit('success', recorder)
					self.startTime = 0;
				});
				recorderManager.stop();
				// #endif
			},
			getRecordingData(e) {
				this.chunks.push(e.data)
			},
			saveRecordingData() {
				const blob = new Blob(this.chunks, { 'type': 'audio/mpeg' }),
					localUrl = URL.createObjectURL(blob)

				const endTime = new Date().getTime()

				let duration = (endTime - this.startTime).toString().split('')
				duration.splice(duration.length - 2)
				duration.splice(duration.length - 1, 0, '.')
				duration = parseFloat(duration.join(''))
			
				const recorder = {
					data: blob,
					duration: duration,
					localUrl: localUrl
				}
				this.$emit('success', recorder);
				this.startTime = 0;
			},
			onErrorHandler(err) {
				console.log(err)
				if (err.name === 'NotAllowedError') {
					this.$emit('error', '201')
					throw '用户拒绝了当前的浏览器实例的访问请求'
				}

				if (err.name === 'NotReadableError') {
					this.$emit('error', '101')
					throw '当前浏览器不支持'
				}

				this.$emit('error', '500')
				throw '调用失败，原因不详'

			}
		},
		destroyed() {
			this.stop()
		}
	}
</script>
<style>
</style>
