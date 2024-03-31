"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux";

// Redux store provider
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
