import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { useDataLakeTracker } from "../src";

type ExampleTrackEvent =
  | {
      name: "no-payload";
    }
  | {
      name: "payload";
      payload: {
        count: number;
      };
    };

export function App(): JSX.Element {
  const track = useDataLakeTracker<ExampleTrackEvent>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    track({
      name: "no-payload",
    });
  }, [track]);

  useEffect(() => {
    track({
      name: "payload",
      payload: {
        count,
      },
    });
  }, [count, track]);

  return (
    <button type="button" onClick={() => setCount((ps) => ps + 1)}>
      clicked times: {count}
    </button>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
