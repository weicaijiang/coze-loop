// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { type ReactNode } from 'react';

import { type Space } from '@cozeloop/api-schema/foundation';
import {
  IconCozChat,
  IconCozDatabase,
  IconCozPlayCircle,
  IconCozDashboard,
  IconCozLightbulb,
  IconCozNode,
  IconCozChatFill,
  IconCozPlayCircleFill,
  IconCozDashboardFill,
  IconCozDatabaseFill,
  IconCozLightbulbFill,
  IconCozNodeFill,
} from '@coze-arch/coze-design/icons';

export interface MenuConfig {
  itemKey: string;
  text: string;
  icon?: ReactNode;
  selectedIcon?: ReactNode;
  items?: MenuConfig[];
  /** 在侧边栏隐藏 */
  hideInNavbar?: boolean;
  /** 打开新链接 */
  link?: string;
  /** 禁用链接 */
  disabled?: boolean;
  /** 是否可见 */
  visible?: (data: { space?: Space }) => boolean;
}

export function useMenuConfig() {
  const menuConfig: MenuConfig[] = [
    {
      itemKey: 'pe',
      text: 'Prompt 工程',
      visible: ({ space }) => Boolean(space?.id),
      items: [
        {
          itemKey: 'pe/prompts',
          text: 'Prompt 开发',
          icon: <IconCozChat />,
          selectedIcon: <IconCozChatFill className="coz-fg-plus" />,
        },
        {
          itemKey: 'pe/playground',
          text: 'Playground',
          icon: <IconCozPlayCircle />,
          selectedIcon: <IconCozPlayCircleFill className="coz-fg-plus" />,
        },
      ],
    },
    {
      itemKey: 'evaluation',
      text: '评测',
      visible: ({ space }) => Boolean(space?.id),
      items: [
        {
          itemKey: 'evaluation/datasets',
          text: '评测集',
          icon: <IconCozDatabase />,
          selectedIcon: <IconCozDatabaseFill className="coz-fg-plus" />,
        },
        {
          itemKey: 'evaluation/evaluators',
          text: '评估器',
          icon: <IconCozLightbulb />,
          selectedIcon: <IconCozLightbulbFill className="coz-fg-plus" />,
        },
        {
          itemKey: 'evaluation/experiments',
          text: '实验',
          icon: <IconCozDashboard />,
          selectedIcon: <IconCozDashboardFill className="coz-fg-plus" />,
        },
      ],
    },
    {
      itemKey: 'observation',
      text: '观测',
      visible: ({ space }) => Boolean(space?.id),
      items: [
        {
          itemKey: 'observation/traces',
          text: 'Trace',
          icon: <IconCozNode />,
          selectedIcon: <IconCozNodeFill className="coz-fg-plus" />,
        },
      ],
    },
  ];

  return menuConfig;
}
