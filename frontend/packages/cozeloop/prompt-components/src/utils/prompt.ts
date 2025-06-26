// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import {
  type Message,
  Role,
  type VariableDef,
  VariableType,
} from '@cozeloop/api-schema/prompt';

export const getPlaceholderErrorContent = (
  message?: Message,
  variables?: VariableDef[],
) => {
  if (message?.role === Role.Placeholder) {
    if (!message?.content) {
      return 'Placeholder 变量名不能为空';
    }
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(message?.content)) {
      return '只允许输入英文、数字及下划线且首字母需为英文';
    }
    const normalVariables = variables?.filter(
      it => it.type !== VariableType.Placeholder,
    );
    const hasSameKey = normalVariables?.find(it => it.key === message?.content);
    if (hasSameKey) {
      return '文本变量名称已存在，请修改 Placeholder 变量名';
    }
  }
  return '';
};
