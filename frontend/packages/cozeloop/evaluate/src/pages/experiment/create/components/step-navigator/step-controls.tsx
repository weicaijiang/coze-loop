// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button } from '@coze-arch/coze-design';
import { type GuardPoint, Guard } from '@cozeloop/guard';

import { type StepConfig } from '../../constants/steps';

interface StepControlsProps {
  currentStep: number;
  steps: StepConfig[];
  onNext: () => void;
  onPrevious: () => void;
  isNextLoading?: boolean;
}

export const StepControls: React.FC<StepControlsProps> = ({
  currentStep,
  steps,
  onNext,
  onPrevious,
  isNextLoading = false,
}) => {
  const currentStepConfig = steps[currentStep];

  return (
    <div className="flex-shrink-0 p-6">
      <div className="w-[800px] mx-auto flex flex-row items-center justify-end gap-2">
        {currentStep > 0 && (
          <Button color="primary" onClick={onPrevious}>
            上一步
          </Button>
        )}

        <Guard
          point={currentStepConfig.guardPoint as GuardPoint}
          ignore={!currentStepConfig.isLast}
        >
          <Button onClick={onNext} loading={isNextLoading}>
            {currentStepConfig.nextStepText}
          </Button>
        </Guard>
      </div>
    </div>
  );
};
