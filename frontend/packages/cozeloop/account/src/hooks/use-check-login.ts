// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';

import { useUserStore } from '../stores/user-store';
import { userService } from '../services/user-service';

export function useCheckLogin() {
  const patch = useUserStore(s => s.patch);

  useEffect(() => {
    (async () => {
      try {
        patch({ settling: true });
        const userInfo = await userService.getUserInfo(true);

        userInfo?.user_id
          ? patch({ userInfo, settling: false })
          : patch({ settling: false });
      } catch (e) {
        console.error(e);
        patch({ settling: false });
      }
    })();
  }, []);
}
