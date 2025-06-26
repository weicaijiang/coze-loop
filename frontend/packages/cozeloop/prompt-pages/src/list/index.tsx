// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @coze-arch/max-line-per-function */
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

import { useDebounce, usePagination } from 'ahooks';
import { PromptCreate } from '@cozeloop/prompt-components';
import {
  DEFAULT_PAGE_SIZE,
  PrimaryPage,
  TableColActions,
  TableWithPagination,
} from '@cozeloop/components';
import { useSpace } from '@cozeloop/biz-hooks-adapter';
import { useModalData } from '@cozeloop/base-hooks';
import { type Prompt } from '@cozeloop/api-schema/prompt';
import { promptManage } from '@cozeloop/api-schema';
import {
  IconCozIllusAdd,
  IconCozIllusEmpty,
} from '@coze-arch/coze-design/illustrations';
import { IconCozPlus } from '@coze-arch/coze-design/icons';
import {
  Button,
  type ColumnProps,
  EmptyState,
  Form,
  type FormApi,
  Search,
  withField,
} from '@coze-arch/coze-design';

import { PromptDelete } from '@/components/prompt-delete';

import { columns } from './column';

import styles from './index.module.less';

const FormSearch = withField(Search);
interface PromptSearchProps {
  key_word?: string;
  order_by?: promptManage.ListPromptOrderBy;
  asc?: boolean;
}

export function PromptList() {
  const navigate = useNavigate();
  const { spaceID } = useSpace();

  const createModal = useModalData<Prompt>();
  const formApi = useRef<FormApi<PromptSearchProps>>();
  const [filterRecord, setFilterRecord] = useState<PromptSearchProps>();
  const debouncedFilterRecord = useDebounce(filterRecord, { wait: 300 });

  const service = usePagination(
    ({ current, pageSize }) =>
      promptManage
        .ListPrompt({
          workspace_id: spaceID,
          page_num: current,
          page_size: pageSize,
          ...debouncedFilterRecord,
        })
        .then(res => {
          const newList = res.prompts?.map(it => {
            const user = res.users?.find(
              u => u.user_id === it?.prompt_basic?.created_by,
            );
            return { ...it, user };
          });
          return {
            list: newList || [],
            total: Number(res.total || 0),
          };
        }),
    {
      defaultPageSize: DEFAULT_PAGE_SIZE,
      refreshDeps: [debouncedFilterRecord, spaceID],
    },
  );

  const deleteModal = useModalData<Prompt>();

  const operateCol: ColumnProps<Prompt> = {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    width: 110,
    align: 'left',
    fixed: 'right',
    render: (_: unknown, row: Prompt) => (
      <TableColActions
        actions={[
          {
            label: '详情',
            onClick: () => navigate(`${row.id}`),
          },
          {
            label: '删除',
            onClick: () => {
              if (row?.id) {
                deleteModal.open(row);
              }
            },
            type: 'danger',
          },
        ]}
      />
    ),
  };

  const newColumns = [...columns, operateCol];

  const onFilterValueChange = (allValues?: PromptSearchProps) => {
    setFilterRecord({ ...allValues });
  };

  return (
    <PrimaryPage
      pageTitle="Prompt 开发"
      filterSlot={
        <div className="flex align-center justify-between">
          <Form<PromptSearchProps>
            className={styles['prompt-form']}
            onValueChange={onFilterValueChange}
            getFormApi={api => (formApi.current = api)}
          >
            <FormSearch
              field="key_word"
              placeholder="搜索 Prompt Key 或 Prompt 名称"
              width={360}
              noLabel
            />
          </Form>

          <Button icon={<IconCozPlus />} onClick={() => createModal.open()}>
            创建 Prompt
          </Button>
        </div>
      }
    >
      <TableWithPagination
        heightFull
        service={service}
        tableProps={{
          columns: newColumns,
          sticky: { top: 0 },
          onRow: row => ({
            onClick: () => {
              navigate(`${row.id}`);
            },
          }),
          onChange: ({ sorter, extra }) => {
            if (extra?.changeType === 'sorter' && sorter) {
              const arr = [
                'prompt_basic.created_at',
                'prompt_basic.updated_at',
              ];
              if (arr.includes(sorter.dataIndex) && sorter.sortOrder) {
                const orderBy =
                  sorter.dataIndex === 'create_tsms'
                    ? promptManage.ListPromptOrderBy.CreatedAt
                    : promptManage.ListPromptOrderBy.CommitedAt;
                formApi.current?.setValue('order_by', orderBy);
                formApi.current?.setValue(
                  'asc',
                  sorter.sortOrder !== 'descend',
                );
              } else {
                formApi.current?.setValue('order_by', undefined);
                formApi.current?.setValue('asc', undefined);
              }
            }
          },
        }}
        empty={
          debouncedFilterRecord?.key_word ? (
            <EmptyState
              size="full_screen"
              icon={<IconCozIllusEmpty />}
              title="未能找到相关结果"
              description="请尝试其他关键词或修改筛选项"
            />
          ) : (
            <EmptyState
              size="full_screen"
              icon={<IconCozIllusAdd />}
              title="暂无 Prompt"
              description="点击右上角创建按钮进行创建"
            />
          )
        }
      />
      <PromptCreate
        visible={createModal.visible}
        onCancel={createModal.close}
        onOk={res => {
          createModal.close();
          service.refresh();
          navigate(`${res.id}`);
        }}
      />
      <PromptDelete
        data={deleteModal.data}
        visible={deleteModal.visible}
        onCacnel={deleteModal.close}
        onOk={() => {
          deleteModal.close();
          service.refresh();
        }}
      />
    </PrimaryPage>
  );
}
