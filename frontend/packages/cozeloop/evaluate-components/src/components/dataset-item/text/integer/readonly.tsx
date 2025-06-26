// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { type DatasetItemProps } from '../../type';
import { TextEllipsis } from '../../../text-ellipsis';

export const IntegerDatasetItemReadOnly = ({
  fieldContent,
}: DatasetItemProps) => (
  <TextEllipsis emptyText="" theme="light">
    {fieldContent?.text}
  </TextEllipsis>
);
