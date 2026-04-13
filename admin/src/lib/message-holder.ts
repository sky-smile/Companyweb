import { App } from 'antd';

let messageApi: ReturnType<typeof App.useApp>['message'] | null = null;

export function setMessageApi(api: ReturnType<typeof App.useApp>['message']) {
  messageApi = api;
}

export function getMessageApi() {
  return messageApi;
}
