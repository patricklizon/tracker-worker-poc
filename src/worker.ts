import { nanoid } from "nanoid";

import { isTrackerMessage } from "./utils";

self.onmessage = async function handleMessageFromMain(msg) {
  if (!isTrackerMessage(msg.data)) return;
  const event = await makeEvent(
    msg.data.eventName,
    msg.data.eventPayload,
    msg.data.appData
  );

  await post(event);
};

async function makeEvent(
  name: string,
  payload: unknown,
  appData: Record<string, unknown>
): Promise<string> {
  try {
    return JSON.stringify({
      name,
      payload,
      metadata: Object.assign(
        {
          browser: await getBrowser(),
          timestamp: new Date().toISOString(),
        },
        appData
      ),
    });
  } catch (error) {
    if (!(error instanceof Error)) return "unknown error";

    console.error(error.message);
    return error.message;
  }
}

let userAgentData: UADataValues | undefined;

async function getBrowser() {
  userAgentData ??= await self.navigator.userAgentData?.getHighEntropyValues([
    "arch",
    "bitness",
    "fullVersionList",
    "model",
    "platform",
    "platformVersion",
    "wow64",
  ]);

  return {
    browserResolution: `${window.innerWidth}x${window.innerHeight}`,
    href: location.href,
    languages: navigator?.languages ?? [],
    referer: document.referrer,
    screenResolution: `${screen.width}x${screen.height}`,
    userAgent: navigator.userAgent,
    userAgentData,
  };
}
const traceId = nanoid();
const spanId = nanoid().substring(0, 16);

async function post(payload: string): Promise<void> {
  await self.fetch("/quotation/v1/event/frontend/", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      "X-B3-SpanId": spanId,
      "X-B3-TraceId": traceId,
    },
    body: payload,
  });
}
