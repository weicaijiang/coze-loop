// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
export interface TrafficEnv {
  Open: boolean,
  Env: string,
}
export interface Base {
  LogID: string,
  Caller: string,
  Addr: string,
  Client: string,
  TrafficEnv?: TrafficEnv,
  Extra?: {
    [key: string | number]: string
  },
}
export interface BaseResp {
  StatusMessage: string,
  StatusCode: number,
  Extra?: {
    [key: string | number]: string
  },
}