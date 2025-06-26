// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
/// <reference types="@rsbuild/core/types" />

declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        CDN_INNER_CN: string;
        CDN_PATH_PREFIX: string;
      }
    }
  }
}
