// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useRef, useState } from 'react';

import { GuardPoint, Guard } from '@cozeloop/guard';
import { ResizeSidesheet } from '@cozeloop/components';
import { useSpace } from '@cozeloop/biz-hooks-adapter';
import {
  type FieldSchema,
  type EvaluationSetItem,
} from '@cozeloop/api-schema/evaluation';
import { StoneEvaluationApi } from '@cozeloop/api-schema';
import { IconCozArrowLeft, IconCozArrowRight } from '@coze-arch/coze-design/icons';
import { Button, Form, type FormApi, Toast } from '@coze-arch/coze-design';

import IDWithCopy from '../id-with-copy';
import { fillTurnData } from '../../utils';
import { DatasetItemRenderList } from './item-list';

interface DatasetItemPanelProps {
  datasetItem: EvaluationSetItem;
  fieldSchemas?: FieldSchema[];
  isEdit: boolean;
  onCancel: () => void;
  onSave: () => void;
  switchConfig?: {
    canSwithPre: boolean;
    canSwithNext: boolean;
    onSwith: (type: 'pre' | 'next') => void;
  };
}

export const DatasetItemPanel = ({
  datasetItem,
  isEdit: isEditProps,
  fieldSchemas,
  onCancel,
  onSave,
  switchConfig,
}: DatasetItemPanelProps) => {
  const { spaceID } = useSpace();

  const [isEdit, setIsEdit] = useState(isEditProps);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormApi>();
  const handleSubmit = async values => {
    try {
      setLoading(true);
      const newTurnsData = values?.turns?.map(turn => ({
        ...turn,
        field_data_list: turn.field_data_list?.map(field => ({
          ...field,
          content: {
            text: field.content?.text,
          },
        })),
      }));
      await StoneEvaluationApi.UpdateEvaluationSetItem({
        evaluation_set_id: datasetItem?.evaluation_set_id || '',
        item_id: datasetItem?.item_id || '',
        turns: newTurnsData,
        workspace_id: spaceID,
      });
      Toast.success('保存成功');
      onSave();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  const defaultTurnsData = fillTurnData({
    turns: datasetItem?.turns,
    fieldSchemas,
  });
  return (
    <ResizeSidesheet
      showDivider
      visible={true}
      onCancel={() => {
        onCancel();
      }}
      dragOptions={{
        defaultWidth: 880,
        maxWidth: 1382,
        minWidth: 600,
      }}
      bodyStyle={{
        padding: 0,
      }}
      footer={
        <div className="flex gap-2">
          {isEdit ? (
            <Guard point={GuardPoint['eval.dataset.edit']}>
              <Button
                loading={loading}
                color="hgltplus"
                onClick={() => {
                  formRef.current?.submitForm();
                }}
                disabled={loading}
              >
                保存
              </Button>
            </Guard>
          ) : (
            <Button color="primary" onClick={() => setIsEdit(true)}>
              编辑
            </Button>
          )}
          <Button color="primary" onClick={() => onCancel()}>
            取消
          </Button>
        </div>
      }
      title={
        <div className="text-[18px] font-medium flex items-center gap-2">
          <div className="flex">
            {isEdit ? '编辑数据项：' : '查看数据项：'}
            <IDWithCopy id={datasetItem?.id ?? ''} />
          </div>
          {switchConfig ? (
            <div className="flex-1 flex justify-end">
              <Button
                icon={<IconCozArrowLeft />}
                color="secondary"
                disabled={!switchConfig?.canSwithPre}
                className="text-[13px] !coz-fg-secondary"
                onClick={() => {
                  switchConfig?.onSwith('pre');
                }}
              >
                上一条
              </Button>
              <Button
                icon={<IconCozArrowRight />}
                iconPosition="right"
                className="text-[13px] !coz-fg-secondary ml-2"
                color="secondary"
                disabled={!switchConfig?.canSwithNext}
                onClick={() => {
                  switchConfig?.onSwith('next');
                }}
              >
                下一条
              </Button>
            </div>
          ) : null}
        </div>
      }
    >
      <Form
        className="h-full"
        key={datasetItem?.id}
        onSubmit={handleSubmit}
        getFormApi={api => {
          formRef.current = api;
        }}
        initValues={{
          turns: defaultTurnsData,
        }}
      >
        {({ formState }) => {
          const { turns } = formState.values;
          return (
            <div className="h-full flex flex-col pl-[24px] pr-[18px] py-[16px] overflow-auto styled-scrollbar">
              <DatasetItemRenderList
                datasetItem={datasetItem}
                fieldSchemas={fieldSchemas}
                isEdit={isEdit}
                turn={turns?.[0] || []}
                fieldKey="turns[0]"
              />
            </div>
          );
        }}
      </Form>
    </ResizeSidesheet>
  );
};
