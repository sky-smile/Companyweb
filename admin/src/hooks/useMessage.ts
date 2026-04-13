import { App } from 'antd';
import { setMessageApi } from '../lib/message-holder';

export function useMessage() {
  const { message } = App.useApp();
  // 注册全局引用，供非组件代码（如 http.ts）使用
  setMessageApi(message);
  return message;
}
