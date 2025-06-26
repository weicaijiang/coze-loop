// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import { OutputInfo, useGlobalEvalConfig } from '@cozeloop/evaluate-components';
import { EvaluatorType } from '@cozeloop/api-schema/evaluation';
import { FormSelect, withField } from '@coze-arch/coze-design';

import { PromptField } from './prompt-field';

export function ConfigContent({
  refreshEditorModelKey,
  disabled,
}: {
  refreshEditorModelKey?: number;
  disabled?: boolean;
}) {
  const { modelConfigEditor } = useGlobalEvalConfig();

  const FormModelConfig = useMemo(
    () => withField(modelConfigEditor),
    [modelConfigEditor],
  );

  return (
    <>
      <FormSelect
        label="评估器类型"
        field="evaluator_type"
        initValue={EvaluatorType.Prompt}
        fieldClassName="hidden"
      />
      <FormModelConfig
        refreshModelKey={refreshEditorModelKey}
        label="模型选择"
        disabled={disabled}
        field="current_version.evaluator_content.prompt_evaluator.model_config"
        rules={[{ required: true, message: '请选择模型' }]}
      />
      <PromptField
        disabled={disabled}
        refreshEditorKey={refreshEditorModelKey}
      />

      <OutputInfo />
    </>
  );
}
