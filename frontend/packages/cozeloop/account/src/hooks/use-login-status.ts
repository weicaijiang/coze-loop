// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useUserStore } from '../stores/user-store';

export function useLoginStatus() {
  const settling = useUserStore(s => s.settling);
  const userInfo = useUserStore(s => s.userInfo);

  if (typeof settling === 'undefined') {
    return 'not_ready';
  }

  return settling ? 'settling' : userInfo?.user_id ? 'logined' : 'not_login';
}
