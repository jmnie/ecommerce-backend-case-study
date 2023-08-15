const appConfig = {
  config:{
    host: process.env.host || 'localhost',
    port : process.env.port || 3000,
  }
}

export default appConfig

export const getAppConfig = () =>{
  return appConfig
}