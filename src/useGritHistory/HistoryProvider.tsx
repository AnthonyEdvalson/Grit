import React, { useCallback } from "react";
import History from "./History";
import fs from 'fs';
import useSaved from "./useSaved";

let baseHistory = new History([]);

try {
  baseHistory = History.parse(fs.readFileSync("./state.json", "utf-8"));
}
catch {}

const HistoryContext = React.createContext<null | [History<any>, (details: any) => void]>(null);

function HistoryProvider(props: any) {
  let [history, setHistory] = useSaved("./state.json", baseHistory, a => a.stringify(), a => History.parse(a));

  const record = useCallback((details) => {
    setHistory(history.record(details));
  }, [setHistory, history]);

  return (
    <HistoryContext.Provider value={[history, record]}>
      { props.children }
    </HistoryContext.Provider>
  )
}

export default HistoryProvider;
export { HistoryContext };
