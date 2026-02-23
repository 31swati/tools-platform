"use client"

import { createContext, useContext } from "react"

export type StorageMode = "local" | "cloud"

interface StorageCtxValue {
  mode: StorageMode
  userId: string | undefined
}

export const StorageCtx = createContext<StorageCtxValue>({ mode: "local", userId: undefined })

export const useStorageCtx = () => useContext(StorageCtx)
