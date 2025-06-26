// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
export const evaluateTargetValidators = {
  evalTargetType: [{ required: true, message: '请选择类型' }],
  evalTarget: [{ required: true, message: '请选择评测对象' }],
  evalTargetVersion: [{ required: true, message: '请选择评测对象版本' }],
  // todo: 这里注册进来
  evalTargetMapping: [{ required: true, message: '请配置评测对象映射' }],
};
