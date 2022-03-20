import {
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  type Context,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import { WORKER_NAME } from "./env";

type ContextData<T extends Record<string, any> = Record<string, any>> = [
  T,
  Dispatch<SetStateAction<T>>
];

const DataLakeTrackerMetadataCtx = createContext<ContextData>([
  {},
  () => undefined,
]);

export function DataLakeTrackerCtxProvider(props: {
  children: ReactNode;
}): JSX.Element {
  const [state, setState] = useState({});

  return (
    <DataLakeTrackerMetadataCtx.Provider value={[state, setState]}>
      {props.children}
    </DataLakeTrackerMetadataCtx.Provider>
  );
}

export function useDataLakeTrackerMetadataCtx<T>() {
  return useContext(
    DataLakeTrackerMetadataCtx as unknown as Context<ContextData<T>>
  );
}

export type DataLakeTrackerMessage = {
  readonly workerName: string;
  readonly eventName: string;
  readonly eventPayload: unknown;
  readonly appData: Record<string, unknown>;
};

export type DataLakeEvent<N extends string, P = null> = P extends null
  ? { name: N }
  : { name: N; payload: P };

let worker: Worker;
export function useDataLakeTracker<
  E extends DataLakeEvent<string, unknown> | DataLakeEvent<string>
>(): (this: void, event: E) => void {
  const [appData] = useContext(DataLakeTrackerMetadataCtx);

  // provide stable reference to the function
  const track = useCallback(
    function track(event: E) {
      const message: DataLakeTrackerMessage = {
        workerName: "data-lake-tracker-worker",
        eventName: event.name,
        eventPayload: "payload" in event ? event.payload : undefined,
        appData,
      };

      postMessage(message);
    },
    [appData]
  );

  if (!window.Worker) return () => undefined;
  if (!worker) registerWorker();

  return track;
}

function registerWorker(): void {
  worker = new Worker(WORKER_NAME + ".js", {
    name: WORKER_NAME,
  });
}
