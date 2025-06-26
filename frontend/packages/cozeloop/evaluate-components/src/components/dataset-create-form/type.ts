// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { FieldDisplayFormat } from '@cozeloop/api-schema/data';

import {
  ContentType,
  type ConvertFieldSchema,
  DataType,
} from '../dataset-item/type';

export interface IDatasetCreateForm {
  name?: string;
  columns?: ConvertFieldSchema[];
  description?: string;
}

export const DEFAULT_DATASET_CREATE_FORM: IDatasetCreateForm = {
  name: '',
  columns: [
    {
      name: 'input',
      content_type: ContentType.Text,
      type: DataType.String,
      default_display_format: FieldDisplayFormat.PlainText,
      description: '作为输入投递给评测对象',
    },
    {
      name: 'reference_output',
      content_type: ContentType.Text,
      type: DataType.String,
      default_display_format: FieldDisplayFormat.PlainText,
      description: '预期理想输出，可作为评估时的参考标准',
    },
  ],
  description: '',
};

export const DEFAULT_COLUMN_SCHEMA: ConvertFieldSchema = {
  name: '',
  content_type: ContentType.Text,
  type: DataType.String,
  default_display_format: FieldDisplayFormat.PlainText,
};
