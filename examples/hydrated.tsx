import { useEffect } from "react";
import ReactDOM from "react-dom";

import {
  DataLakeTrackerCtxProvider,
  useDataLakeTracker,
  useDataLakeTrackerMetadataCtx,
} from "../src";

type ExampleEvent = { name: "hydrating" };

export function App(): JSX.Element {
  const track = useDataLakeTracker<ExampleEvent>();
  const handleClick = () => track({ name: "hydrating" });
  return (
    <button type="button" onClick={handleClick}>
      track
    </button>
  );
}

type ExampleMetadata = {
  productId: string;
  pageName: string;
};

/**
 *
 * Component used for hydrating event's metadata
 */
function DataLakeTrackerMetadataBridge(): null {
  const [, set] = useDataLakeTrackerMetadataCtx<ExampleMetadata>();

  useEffect(() => set({ pageName: "name", productId: "id" }), [set]);

  return null;
}

ReactDOM.render(
  <DataLakeTrackerCtxProvider>
    <DataLakeTrackerMetadataBridge />
    <App />
  </DataLakeTrackerCtxProvider>,
  document.getElementById("app")
);
