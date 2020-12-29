import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import Cookie from 'js-cookie';

const defaultParse = (a: any) => JSON.parse(a)
function useSaved<T>(
      key: string,
      init: T,
      stringify: (a: T) => any = a => JSON.stringify(a, null, 2),
      parse: (a: any) => T = defaultParse,
    ): [T, React.Dispatch<React.SetStateAction<T>>] {

  let [data, setData] = useState(init);
  let [isInit, setIsInit] = useState(true);
  useEffect(() => {
    let raw = Cookie.get(key);
    let data = raw === undefined ? init : parse(Cookie.get(key));
    console.log("Loading", data, key)
    setData(data);
    setIsInit(false);
  }, [key])

  // Save data to file whenever the state is changed
  let debouncedData = useDebounce(data, 500);
  useEffect(() => {
    if (isInit)
      return;

    let data = stringify(debouncedData);
    console.log("Saving", debouncedData, key);
    Cookie.set(key, data)
  }, [debouncedData]);

  let newSetData = (action: React.SetStateAction<T>) => {
    setIsInit(false);
    setData(action);
  }

  return [data, newSetData];
}


export default useSaved;
