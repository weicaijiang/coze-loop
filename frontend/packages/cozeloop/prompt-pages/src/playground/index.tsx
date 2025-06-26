// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { usePlayground } from '@/hooks/use-playground';
import { PromptDev } from '@/components/prompt-dev';

export function Playground() {
  const { initPlaygroundLoading } = usePlayground();

  return <PromptDev getPromptLoading={initPlaygroundLoading} />;
}
