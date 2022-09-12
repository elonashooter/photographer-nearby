'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__B2F4D33"})
exports.main = async (event) => {
const res = await uniPush.sendMessage({
"user_id": event.uid,
"title": event.title,
"content": event.content,
"payload": event.payload,
})
return res;
};