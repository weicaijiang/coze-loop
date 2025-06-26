// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';

import { TRACE_FREE_PRESETS_LIST, timePickerPresets } from '@/consts/time';

export function useTraceTimeRangeOptions() {
  const tracePresetsList = TRACE_FREE_PRESETS_LIST;

  const options = useMemo(() => {
    const ranges = tracePresetsList.map(item => ({
      value: item,
    }));
    return ranges.map(preset => ({
      label: <div className="pr-1">{timePickerPresets[preset.value].text}</div>,
      value: preset.value,
    }));
  }, [tracePresetsList]);

  return options;
}
