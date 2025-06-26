// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

import cls from 'classnames';
import { Space, Typography } from '@coze-arch/coze-design';

import { UserInfoPanel } from '../user-info-panel';
import { PatPanel } from '../pat-panel';

import s from './index.module.less';

interface Tab {
  key: 'user-info' | 'pat';
  name: string;
}

interface Props {
  activeTab?: Tab['key'];
  className?: string;
}

export function AccountSetting({ className, activeTab }: Props) {
  const [tabId, setTabId] = useState<Tab['key']>(activeTab || 'user-info');
  const tabs: Tab[] = [
    { name: '账户设置', key: 'user-info' },
    { name: 'API 授权', key: 'pat' },
  ];
  const tabName = tabs.find(it => it.key === tabId)?.name;

  const renderTabPanel = () => {
    switch (tabId) {
      case 'user-info':
        return <UserInfoPanel className={s['tab-panel']} />;
      case 'pat':
        return <PatPanel className={s['tab-panel']} />;
      default:
        return null;
    }
  };

  return (
    <div className={cls(s.container, className)}>
      <Space
        align="start"
        vertical={true}
        spacing={16}
        className={s['tab-bar']}
      >
        <div className={s.title}>{'账户'}</div>
        {tabs.map(({ name, key }) => (
          <div
            key={key}
            className={cls(s['tab-item'], key === tabId && s['active-tab'])}
            onClick={() => setTabId(key)}
          >
            {name}
          </div>
        ))}
      </Space>
      <div className={s.divider} />
      <div className={s['tab-content']}>
        <Typography.Text className={s['tab-title']}>{tabName}</Typography.Text>
        {renderTabPanel()}
      </div>
    </div>
  );
}
