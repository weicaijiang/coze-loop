// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { IconCozCrossCircleFill } from '@coze-arch/coze-design/icons';
import { Image, Tooltip, Tag } from '@coze-arch/coze-design';
import { I18n } from '@cozeloop/i18n-adapter';

import { useFetchResource } from '../hooks/use-fetch-resource';

export const TraceImage = ({ url }: { url: string }) => {
  const { error } = useFetchResource(url);

  if (error) {
    return (
      <Tooltip content={I18n.t('analytics_image_error')} theme="dark">
        <div className="flex items-center">
          <Tag type="solid" color="red">
            <span className="flex items-center gap-x-1">
              <IconCozCrossCircleFill />
              <span className="font-medium">图片加载失败</span>
            </span>
          </Tag>
        </div>
      </Tooltip>
    );
  }
  return (
    <Image
      src={url}
      imgCls="max-h-[200px] w-auto"
      preview={{ closable: true }}
    />
  );
};
