import { analyze } from '@/lib/api';
import type { RuntimeMessage, RuntimeResponse } from '@/types/messages';

chrome.runtime.onMessage.addListener((msg: unknown, _sender, sendResponse) => {
  const message = msg as RuntimeMessage;
  if (message?.type === 'ANALYZE') {
    analyze(message.payload)
      .then((data) => {
        const response: RuntimeResponse = { ok: true, data };
        sendResponse(response);
      })
      .catch((err: Error) => {
        const response: RuntimeResponse = { ok: false, error: err.message };
        sendResponse(response);
      });
    return true;
  }
  return false;
});
