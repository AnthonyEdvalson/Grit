import { useContext } from "react";
import History from "./History";
import { HistoryContext } from "./HistoryProvider";

function useHistory(filter: (item: any) => boolean= () => true): [History<any>, (detail: any) => void] | null {
  let hc = useContext(HistoryContext);

  if (hc === null)
    return null;

  else {
    return [new History(hc[0].events.filter(filter)), hc[1]];
  }
}

export default useHistory;
