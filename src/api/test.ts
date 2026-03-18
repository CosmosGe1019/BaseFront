import FetchUtil from '@/api/http'

const res = await FetchUtil.getIceUrl()
console.log('ice url', res)
const resp = await fetch(res.iceUrl)
const iceServerConfigs: RTCIceServer = await resp.json()
console.log('ICE 服务器配置:', iceServerConfigs)
