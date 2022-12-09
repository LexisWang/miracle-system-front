import { WS_ADDRESS } from '@/utils/constant';

export function useWebSocket(userid: number, handleMessage: (e: any) => any, connected?: (e: any) => any,  closed?: (e: any) => any): WebSocket {
  const ws = new WebSocket(WS_ADDRESS + userid);
  ws.onopen = function (e) {
    console.log('open', e);
    connected?.(e);
  };
  ws.onclose = function (e) {
    console.log('close', e);
    closed?.(e);
  };
  ws.onerror = function () {
    console.log('error');
  };
  ws.onmessage = handleMessage
  return ws;
}
