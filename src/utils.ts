import { WORKER_NAME } from "./env";

import { type DataLakeTrackerMessage } from ".";

export function isTrackerMessage(o: any): o is DataLakeTrackerMessage {
  if (
    o.workerName === WORKER_NAME &&
    "eventName" in o &&
    "eventPayload" in o &&
    "appData" in o
  ) {
    return true;
  }

  return false;
}
