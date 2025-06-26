// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import cls from 'classnames';
import { type PersonalAccessToken } from '@cozeloop/api-schema/foundation';
import { IconCozMinusCircle, IconCozEdit } from '@coze-arch/coze-design/icons';
import { IconButton, Popconfirm } from '@coze-arch/coze-design';

import s from './pat-op.module.less';

interface Props {
  className?: string;
  pat: PersonalAccessToken;
  onEdit?: (v: PersonalAccessToken) => void;
  onDelete?: (id: string) => void;
}

export function PatOperation({ pat, className, onEdit, onDelete }: Props) {
  return (
    <div className={cls(s.container, className)}>
      <IconButton
        icon={<IconCozEdit />}
        size="small"
        color="secondary"
        onClick={() => onEdit?.(pat)}
      />
      <Popconfirm
        trigger="click"
        title={'删除令牌'}
        content={'移除后会影响所有正在使用 API 个人访问令牌的应用'}
        okText={'确定'}
        cancelText={'取消'}
        okButtonProps={{ color: 'red' }}
        style={{ width: 320 }}
        onConfirm={() => onDelete?.(pat.id)}
      >
        <IconButton
          icon={<IconCozMinusCircle />}
          size="small"
          color="secondary"
        />
      </Popconfirm>
    </div>
  );
}
