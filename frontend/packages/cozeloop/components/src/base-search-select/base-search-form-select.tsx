// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { withField } from '@coze-arch/coze-design';

import { type BaseSelectProps } from './types';
import BaseSearchSelect from './base-search-select';

const BaseSearchFormSelect: React.FC<BaseSelectProps> = withField(
  (props: BaseSelectProps) => <BaseSearchSelect {...props} />,
);

export default BaseSearchFormSelect;
