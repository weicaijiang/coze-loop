// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { Input } from '@coze-arch/coze-design';

import { type DatasetItemProps } from '../../type';

export const IntegerDatasetItemEdit = ({
  fieldContent,
  onChange,
}: DatasetItemProps) => (
  <>
    <Input
      placeholder="请输入integer"
      className="rounded-[6px]"
      value={fieldContent?.text}
      onChange={value => {
        onChange?.({
          ...fieldContent,
          text: value,
        });
      }}
    />
  </>
);
