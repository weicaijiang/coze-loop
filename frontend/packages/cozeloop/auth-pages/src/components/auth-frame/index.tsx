// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import type { ReactNode } from 'react';

import cls from 'classnames';

import s from './index.module.less';

interface Props {
  className?: string;
  brand?: ReactNode;
  children: ReactNode;
  classNames?: Partial<Record<'brand' | 'panel', string>>;
}

export function AuthFrame({ className, classNames, brand, children }: Props) {
  return (
    <div className={cls(s.frame, className)}>
      {brand ? (
        <div className={cls(s.brand, classNames?.brand)}>{brand}</div>
      ) : null}
      <div className={cls(s.panel, classNames?.panel)}>{children}</div>
    </div>
  );
}
