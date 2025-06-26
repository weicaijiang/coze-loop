// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { IconCozTransSwitch } from '@coze-arch/coze-design/icons';
import { I18n, initIntl } from '@cozeloop/i18n-adapter';
import { Dropdown, IconButton, Spin } from '@coze-arch/coze-design';
import type { Preview } from '@storybook/react';
import { useEffect, useState } from 'react';

const languages = [
  {
    title: '中文',
    value: 'zh-CN',
  },
  {
    title: 'English',
    value: 'en-US',
  },
];

let hasInit = false;

const I18nSwitchDropdown = () => {
  const currentLang = languages.find(
    lang => lang.value === I18n.language,
  )?.title;
  const handleSwitchLanguage = (lang: string) => {
    I18n.setLang(lang);
    location.reload();
  };
  return (
    <Dropdown
      position="bottomRight"
      showTick
      render={
        <Dropdown.Menu>
          {languages.map(lang => (
            <Dropdown.Item
              key={lang.value}
              active={I18n.language === lang.value}
              onClick={() => handleSwitchLanguage(lang.value)}
            >
              {lang.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      }
    >
      <IconButton theme="borderless" icon={<IconCozTransSwitch />}>
        {currentLang}
      </IconButton>
    </Dropdown>
  );
};

const useInitI18n = () => {
  const [i18nStatus, setI18nStatus] = useState(false);
  useEffect(() => {
    if (!hasInit) {
      initIntl({
        lng: 'zh-CN',
        fallbackLng: ['zh-CN', 'en-US'],
        thirdParamFallback: true,
      })
        .then(() => {
          setI18nStatus(true);
          hasInit = true;
        })
        .catch(err => {
          setI18nStatus(false);
        });
    } else {
      setI18nStatus(true);
    }
  }, []);

  return {
    i18nStatus,
  };
};

const decorators: Preview['decorators'] = [
  (Story, context) => {
    const { i18nStatus } = useInitI18n();
    return i18nStatus ? (
      <>
        {context.parameters.showI18nSwitch ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginBottom: 20,
            }}
          >
            <I18nSwitchDropdown />
          </div>
        ) : null}
        <Story />
      </>
    ) : (
      <Spin />
    );
  },
];

export default decorators;
