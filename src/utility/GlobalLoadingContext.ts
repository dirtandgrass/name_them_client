import React from "react";


export type GlobalLoadingContextType = {
  globalLoading: boolean;
  setGlobalLoading: any;
}


//const [globalLoading, setGlobalLoading] = React.useState<boolean>(false);


export const defaultGlobalLoadingContext: GlobalLoadingContextType = { globalLoading: true, setGlobalLoading: () => { } };

const GlobalLoadingContext = React.createContext<GlobalLoadingContextType>(defaultGlobalLoadingContext);
export default GlobalLoadingContext;