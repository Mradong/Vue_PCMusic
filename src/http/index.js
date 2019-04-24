// Axios:默认配置
axios.defaults.baseURL = 'http://music.rexinshimin.cn:3000';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;//跨域请求是否携带cooike

const http = {
  /** get 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   */
  get: function(url,params){
    return new Promise((resolve,reject) => {
      axios.get(url,{
        params:params
      })
        .then((response) => {
          resolve( response.data );
        })
        .catch((error) => {
          reject( error );
        });
    })
  },
  /** post 请求
   * @param  {接口地址} url
   * @param  {请求参数} params
   */
  post: function(url,params){
    return new Promise((resolve,reject) => {
      axios.post(url,params)
        .then((response) => {
          resolve( response.data );
        })
        .catch((error) => {
          reject( error );
        });
    })
  }
}
export default http ;

