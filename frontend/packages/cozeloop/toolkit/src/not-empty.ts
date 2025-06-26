// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
