import { useEffect, useState } from "react"
import { isObject } from "util";


export default function useStorage<T>(key: string, initVal: T, sessionOrStorage: "session" | "local" = "session") {


  const [value, setValue] = useState(() => {

    const jsonValue = localStorage.getItem(key) || sessionStorage.getItem(key);

    if (jsonValue != null) {
      const lval = JSON.parse(jsonValue);

      if (lval != null) {
        return lval as T;
      }
    }

    return initVal;
  })

  useEffect(() => {

    if (!value) {
      // no value to store
      sessionStorage.removeItem(key)
      localStorage.removeItem(key)
      return
    }



    // if first value is id, and invalid, remove
    if (typeof (value) === "object" && Object.keys(value)[0]?.endsWith("_id") && Object.values(value)[0] as number <= 1) {
      sessionStorage.removeItem(key)
      localStorage.removeItem(key)
      return
    }


    if (sessionOrStorage === "session")
      sessionStorage.setItem(key, JSON.stringify(value))
    else
      localStorage.setItem(key, JSON.stringify(value))
  }, [key, value, sessionOrStorage])

  return [value, setValue] as const
}