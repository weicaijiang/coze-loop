// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { type JsonViewerProps } from '@textea/json-viewer';
export const jsonViewerConfig: Partial<JsonViewerProps> = {
  rootName: false,
  displayDataTypes: false,
  indentWidth: 2,
  enableClipboard: false,
  collapseStringsAfterLength: 300,
  defaultInspectDepth: 5,
  style: {
    wordBreak: 'break-all',
  },
};
