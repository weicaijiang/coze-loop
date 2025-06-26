// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { type DatasetItemProps } from '../../type';
import { IntegerDatasetItemReadOnly } from './readonly';
import { IntegerDatasetItemEdit } from './edit';

export const IntegerDatasetItem = (props: DatasetItemProps) =>
  props.isEdit ? (
    <IntegerDatasetItemEdit {...props} />
  ) : (
    <IntegerDatasetItemReadOnly {...props} />
  );
