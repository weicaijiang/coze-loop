// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { UserProfile } from '@cozeloop/components';
import {
  ExptRetryMode,
  type UserInfo,
  type Experiment,
} from '@cozeloop/api-schema/evaluation';
import { StoneEvaluationApi } from '@cozeloop/api-schema';
import { Modal, type ColumnProps } from '@coze-arch/coze-design';

import { formateTime } from '../../utils';
import { TypographyText } from '../../components/text-ellipsis';
import { EvaluateTargetTypePreview } from '../../components/previews/evaluate-target-type-preview';
import { EvalTargetPreview } from '../../components/previews/eval-target-preview';
import { EvaluationSetPreview } from '../../components/previews/eval-set-preview';
import { ExperimentRunStatus } from '../../components/experiments/previews/experiment-run-status';
import LoopTableSortIcon from '../../components/dataset-list/sort-icon';
import ExperimentEvaluatorAggregatorScore from './experiment-evaluator-aggregator-score';

/** 实验列表列配置 */

export function getExperimentColumns({
  spaceID,
  enableSort = false,
}: {
  spaceID: Int64;
  enableSort?: boolean;
  onRefresh?: () => void;
}) {
  const columns: ColumnProps<Experiment>[] = [
    {
      title: '实验名称',
      disableColumnManage: true,
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: text => <TypographyText>{text}</TypographyText>,
    },
    {
      title: '评测对象类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render(_, record) {
        return (
          <EvaluateTargetTypePreview
            type={record.eval_target?.eval_target_type}
          />
        );
      },
    },
    {
      title: '评测对象',
      dataIndex: 'eval_target',
      key: 'eval_target',
      width: 215,
      render(val) {
        return (
          <EvalTargetPreview
            spaceID={spaceID}
            evalTarget={val}
            enableLinkJump={true}
            showIcon={true}
            jumpBtnClassName={'show-in-table-row-hover'}
          />
        );
      },
    },
    {
      title: '关联评测集',
      dataIndex: 'eval_set',
      key: 'eval_set',
      width: 215,
      render: val => (
        <EvaluationSetPreview
          evalSet={val}
          enableLinkJump={true}
          jumpBtnClassName={'show-in-table-row-hover'}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record: Experiment) => (
        <div onClick={e => e.stopPropagation()}>
          <ExperimentRunStatus
            status={record.status}
            experiment={record}
            enableOnClick={false}
            showProcess={true}
          />
        </div>
      ),
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      width: 330,
      render: (_, record: Experiment) => (
        <ExperimentEvaluatorAggregatorScore
          evaluators={record.evaluators ?? []}
          spaceID={spaceID}
          evaluatorAggregateResult={
            record.expt_stats?.evaluator_aggregate_results
          }
        />
      ),
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      width: 160,
      render: val => <TypographyText>{val || '-'}</TypographyText>,
    },
    {
      title: '创建人',
      dataIndex: 'base_info.created_by',
      key: 'create_by',
      width: 160,
      render: (val: UserInfo) =>
        val?.name ? (
          <UserProfile avatarUrl={val?.avatar_url} name={val?.name} />
        ) : (
          '-'
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 180,
      sorter: enableSort,
      sortIcon: LoopTableSortIcon,
      render: val => formateTime(val),
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 180,
      render: val => formateTime(val),
    },
  ];
  return columns;
}

export function handleDelete({
  record,
  spaceID,
  onRefresh,
}: {
  record: Experiment;
  spaceID: Int64;
  onRefresh?: () => void;
}) {
  Modal.confirm({
    title: '删除实验',
    content: (
      <>
        确定要删除<span className="font-medium px-[2px]">{record.name}</span>
        吗？此修改将不可逆。
      </>
    ),
    okText: '删除',
    cancelText: '取消',
    okButtonColor: 'red',
    width: 420,
    autoLoading: true,
    async onOk() {
      if (record.id) {
        await StoneEvaluationApi.DeleteExperiment({
          workspace_id: spaceID,
          expt_id: record.id,
        });
        onRefresh?.();
      }
    },
  });
}
export function handleRetry({
  record,
  spaceID,
  onRefresh,
}: {
  record: Experiment;
  spaceID: Int64;
  onRefresh?: () => void;
}) {
  Modal.confirm({
    title: '重试实验',
    content: '仅针对执行失败的部分重新评测。',
    okText: '确认',
    cancelText: '取消',
    width: 420,
    autoLoading: true,
    async onOk() {
      await StoneEvaluationApi.RetryExperiment({
        workspace_id: spaceID,
        expt_id: record.id ?? '',
        retry_mode: ExptRetryMode.RetryAll,
      });
      onRefresh?.();
    },
  });
}

export function handleCopy({
  record,
  onOk,
}: {
  record: Experiment;
  onOk: () => void;
}) {
  Modal.confirm({
    title: '复制实验配置',
    content: (
      <>
        复制<span className="font-medium px-[2px]">{record.name}</span>
        配置，直接或修改配置后发起实验。
      </>
    ),
    okText: '确认',
    cancelText: '取消',
    width: 420,
    onOk,
  });
}
