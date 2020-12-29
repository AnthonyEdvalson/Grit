import GritHistory from "./GritHistory";
import useHistory from "./useHistory";


function useGritHistory(filter: (details: any) => boolean = () => true): [GritHistory | null, (details: any) => void] {
  let history = useHistory(filter);
  console.log(history)
  if (history === null)
    return [null, () => {}];

  return [new GritHistory(history[0]), history[1]];
}

export default useGritHistory;
