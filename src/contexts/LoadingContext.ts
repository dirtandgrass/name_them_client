import React from "react";



export type LoadingContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}



export const defaultLoadingContext: LoadingContextType = { loading: true, setLoading: () => { } };

const LoadingContext = React.createContext<LoadingContextType>(defaultLoadingContext);
export default LoadingContext;