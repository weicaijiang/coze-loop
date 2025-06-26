// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { type PersonalAccessToken } from '@cozeloop/api-schema/foundation';
import { Typography } from '@coze-arch/coze-design';

import { getExpirationTime } from './utils';

import s from './pat-detail.module.less';

interface Props {
  token?: string;
  pat?: PersonalAccessToken;
}

export function PatDetail({ token, pat }: Props) {
  return (
    <div className={s.container}>
      <p className={s.warn}>
        {
          '此令牌仅显示一次。请将此密钥保存在安全且可获取的地方。不要与他人共享，也不要在浏览器或其他客户端代码中暴露它。'
        }
      </p>
      <div className={s.line}>
        <div className={s.title}>{'名称'}</div>
        <div className={s.content}>{pat?.name}</div>
      </div>
      <div className={s.line}>
        <div className={s.title}>{'过期时间'}</div>
        <div className={s.content}>{getExpirationTime(pat?.expire_at)}</div>
      </div>
      <div className={s.line}>
        <div className={s.title}>{'令牌'}</div>
        <div className={s.content}>
          <Typography.Text
            className={s.token}
            copyable={true}
            ellipsis={{ rows: 1 }}
          >
            {token}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
}
