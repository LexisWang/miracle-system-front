import axios from 'axios';
import { ElMessage } from "element-plus";
import router from '@/router';
import { useGlobalStore } from '@/stores/global';

enum RES_CODE {
  "操作成功" = 200,
  "操作失败" = 500,
  "参数校验错误" = 400,
  "参数类型错误" = 418,
  "无访问权限" = 403,
  "未登录或登陆过期" = 401,
}

//1.创建`axios`实例
const ajaxNormal = axios.create({
  // baseURL: 'http://localhost:8888', // 使用代理，不需要该项
  baseURL: 'dev-api', //开发环境为 `dev-api`, 发布环境为 `''`
  timeout: 300000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});
//2.请求拦截
ajaxNormal.interceptors.request.use(
    config => {
      const globalStore = useGlobalStore();
      config.headers = config.headers || {};
      config.headers.Authorization = globalStore.loginData?.jwtToken;
      return config;
    },
    error => Promise.reject(error)
);
//3.响应拦截
ajaxNormal.interceptors.response.use(
    ({ data: resData, headers }) => { //@ts-ignore
      // console.log('&&&&&&', headers?.getContentType())
      if (headers?.getContentType?.().includes('json')) {
        if (resData instanceof Blob) {
          const reader = new FileReader();
          reader.readAsText(resData, 'utf-8');
          reader.onload = function () {
            resData = JSON.parse(reader.result as string);
            return respCodeHandler(resData);
          };
        } else {
          return respCodeHandler(resData);
        }
      } else {
        // 截取文件名，这里是后端返回了文件名+后缀，如果没有可以自己拼接
        const fileName = decodeURI(
            headers['pragma']?.split('filename=')?.[1] || '默认文件名'
        );
        // 将`blob`对象转化成一个可访问的`url`
        const blob = new Blob([resData]);

        //兼容IE浏览器
        //@ts-ignore
        if (window.navigator && window.navigator.msSaveOrOpenBlob) { //@ts-ignore
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return resData;
      }
    }, err => {
      const { response } = err;
      let { message } = err;
      if (response && response.data) {
        const { status, data } = response;

        //根据`status`与`data`做逻辑处理
        message = data || message || RES_CODE[status];
      } else {
        if (message === 'Network Error') {
          message = '后端接口连接异常'
        }
        if (message.includes('timeout')) {
          message = '后端接口请求超时'
        }
        if (message.includes('Request failed with status code')) {
          const code = message.substr(message.length - 3)
          message = '后端接口' + code + '异常'
        }
      }
      ElMessage.error(message);
      return Promise.reject(err);
    });

export default ajaxNormal;

//对后台返回数据进行处理
function respCodeHandler(resData: any): any {
  const code = resData?.code;
  if (!code) {
    ElMessage.error("返回结果中不存在对应的状态码");
    return Promise.reject(resData);
  } else if (code === 401) {
    const globalStore = useGlobalStore();
    globalStore.$reset();
    router.push('/login').then(() => ElMessage.error(resData.msg));
  } else if (code === 200) {
    return resData;
  } else {
    let msg = resData.msg || RES_CODE[code] || RES_CODE[500];
    if (resData.data) {
      msg = JSON.stringify(resData.data);
    }
    ElMessage.error(msg);
    return Promise.reject(resData);
  }
}