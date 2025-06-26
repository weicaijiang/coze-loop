// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

import { PageError, PageLoading, PageNotFound } from '@cozeloop/components';
import { useSpaceStore } from '@cozeloop/account';
import { Button } from '@coze-arch/coze-design';

import { SetupSpaceStatus, useSetupSpace } from '@/hooks';
import { CONSOLE_PATH } from '@/constants';

import { TemplateLayout } from './template';

export function BasicLayout() {
  const { pathname } = useLocation();
  const { status, loading } = useSetupSpace();
  const navigate = useNavigate();
  const resetSpace = useSpaceStore(s => s.reset);

  switch (status) {
    case SetupSpaceStatus.NOT_FOUND:
      return (
        <PageNotFound description="空间不存在">
          <Button
            type="primary"
            block={true}
            onClick={() => {
              resetSpace();
              navigate(CONSOLE_PATH);
            }}
          >
            {'返回'}
          </Button>
        </PageNotFound>
      );
    case SetupSpaceStatus.FETCH_ERROR:
      return (
        <PageError description="网络错误">
          <Button
            type="primary"
            block={true}
            onClick={() => {
              window.location.reload();
            }}
          >
            {'点击重试'}
          </Button>
        </PageError>
      );
    default:
      return (
        <TemplateLayout>
          <Suspense fallback={<PageLoading />}>
            <ErrorBoundary resetKeys={[pathname]} fallback={<PageError />}>
              {loading ? null : <Outlet />}
            </ErrorBoundary>
          </Suspense>
        </TemplateLayout>
      );
  }
}
