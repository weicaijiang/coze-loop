// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useState } from 'react';

export function useModalData<T = undefined>() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<T>();
  const open = useCallback((val?: T) => {
    setVisible(true);
    setData(val);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setData(undefined);
  }, []);

  return {
    visible,
    data,
    open,
    close,
  };
}
