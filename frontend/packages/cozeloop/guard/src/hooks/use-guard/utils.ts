// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { type GuardProps, GuardActionType } from '../../types';

export const guard = <T>({ key, context, configs }: GuardProps<T>) =>
  configs[key]?.(context) || GuardActionType.ACTION;
