// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useLocalStorageState } from 'ahooks';
import { useSpace, useUserInfo } from '@cozeloop/biz-hooks-adapter';
import { IconCozInfoCircleFill, IconCozCross } from '@coze-arch/coze-design/icons';
import { Typography, IconButton } from '@coze-arch/coze-design';

export const CozeLoopTraceBanner = () => {
  const user = useUserInfo();
  const { spaceID } = useSpace();
  const [visible, setVisible] = useLocalStorageState(
    `${user?.user_id_str ?? ''}_${spaceID ?? ''}_coze_up_banner_trace`,
    {
      defaultValue: true,
    },
  );

  if (!visible) {
    return null;
  }
  return (
    <div className="h-[36px] w-full bg-brand-3 text-left px-4 py-2 box-border justify-between flex items-center">
      <div className="flex items-center gap-x-1">
        <IconCozInfoCircleFill className="w-[14px] h-[14px] text-brand-9" />
        <span className="text-[var(--coz-fg-primary)] text-[13px] inline-flex items-center">
          了解数据是优化您应用的第一步，快点接入
          <Typography.Text
            link={{
              href: 'https://loop.coze.cn/open/docs/cozeloop/sdk',
              target: '_blank',
            }}
            className="text-brand-9"
          >
            <span className="text-brand-9">&nbsp;扣子罗盘 SDK&nbsp;</span>
          </Typography.Text>
          上报数据吧，我保证这个操作真的很简单
        </span>
      </div>
      <IconButton
        className="!w-[20px] !h-[20px]"
        icon={<IconCozCross />}
        onClick={() => setVisible(false)}
        size="mini"
        color="secondary"
      />
    </div>
  );
};
