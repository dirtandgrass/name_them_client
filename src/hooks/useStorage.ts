import { useEffect, useState } from "react"


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