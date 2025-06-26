// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { ItemErrorType } from '@cozeloop/api-schema/data';
import {
  type DatasetIOJobProgress,
  type ItemErrorGroup,
} from '@cozeloop/api-schema/data';
import { Typography } from '@coze-arch/coze-design';

const ErrorTypeMap = {
  [ItemErrorType.MismatchSchema]: 'schema 不匹配',
  [ItemErrorType.EmptyData]: '空数据',
  [ItemErrorType.ExceedMaxItemSize]: '单条数据大小超限',
  [ItemErrorType.ExceedDatasetCapacity]: '数据集容量超限',
  [ItemErrorType.MalformedFile]: '文件格式错误',
  [ItemErrorType.InternalError]: '系统错误',
  [ItemErrorType.IllegalContent]: '包含非法内容',
};

export const ImportResultInfo = ({
  progress,
  errors,
}: {
  progress?: DatasetIOJobProgress;
  errors?: ItemErrorGroup[];
}) => (
  <div>
    <div className="flex gap-2 items-center">
      <Typography.Text className="flex-1 leading-[16px]">
        成功
        <Typography.Text className="!font-medium mx-1">
          {progress?.added || 0}
        </Typography.Text>
        条， 失败
        <Typography.Text className="!font-medium mx-1">
          {Number(progress?.processed) - Number(progress?.added) || 0}
        </Typography.Text>
        条
      </Typography.Text>
    </div>
    {errors?.length ? (
      <div className="mt-2 rounded-[4px] p-2 coz-mg-secondary border border-solid border-[var(--coz-stroke-primary)]">
        <Typography.Text size="small" className="coz-fg-secondary">
          存在以下原因导致执行失败，请自行纠正后重试
        </Typography.Text>
        {errors.map(log => (
          <div className="flex items-center">
            <span className="rounded-[50%] w-[4px] h-[4px] mx-2 bg-[black]"></span>
            <Typography.Text size="small" className="coz-fg-secondary">
              {ErrorTypeMap[log?.type || ItemErrorType.InternalError]}
              <Typography.Text size="small" className="!font-medium">
                {log?.error_count && log?.error_count > 0
                  ? `（${log?.error_count}条）`
                  : ''}
              </Typography.Text>
            </Typography.Text>
          </div>
        ))}
      </div>
    ) : null}
  </div>
);
