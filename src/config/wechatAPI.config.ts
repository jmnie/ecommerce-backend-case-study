//These configurations are from:
// 
const WeChatAPIConfig = {
  config:{
    apiUrl : 'https://api.weixin.qq.com/cgi-bin/token',
    grantType : "grantType",
    secret: "secretId",
    appId: "appId",
  }

}

export default WeChatAPIConfig

export const getWeChatConfig = () =>{
  return WeChatAPIConfig
}