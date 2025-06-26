// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
export function getSafeFileName(fileName?: string) {
  return fileName?.replaceAll(/[\\/:*?"<>|]/g, '') || '';
}
