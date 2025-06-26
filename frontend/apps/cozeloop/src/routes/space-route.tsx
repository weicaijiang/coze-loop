// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { Navigate } from 'react-router-dom';

import { PageNoContent } from '@cozeloop/components';
import { useSpaceStore } from '@cozeloop/account';

interface Props {
  index?: boolean;
}

export function SpaceRoute({ index }: Props) {
  const space = useSpaceStore(s => s.space);

  if (!space?.id) {
    return <PageNoContent title="暂无空间" description="你未加入任何空间" />;
  }

  const path = index ? `space/${space.id}` : space.id;

  return <Navigate to={path} replace />;
}
