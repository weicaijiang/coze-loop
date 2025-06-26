// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { Modal, Radio, RadioGroup } from '@coze-arch/coze-design';

interface OverWriteFieldProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}
export const OverWriteField = ({ value, onChange }: OverWriteFieldProps) => (
  <RadioGroup
    value={value ? 'true' : 'false'}
    onChange={e => {
      const newValue = e.target.value === 'true';
      if (newValue) {
        Modal.confirm({
          title: '确认选择全量覆盖',
          content: '继续导入数据将覆盖现有数据',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            onChange?.(true);
          },
          onCancel: () => {
            onChange?.(false);
          },
          okButtonProps: {
            color: 'yellow',
          },
        });
      } else {
        onChange?.(newValue);
      }
    }}
  >
    <Radio value={'false'}>追加数据</Radio>
    <Radio value={'true'}>全量覆盖</Radio>
  </RadioGroup>
);
