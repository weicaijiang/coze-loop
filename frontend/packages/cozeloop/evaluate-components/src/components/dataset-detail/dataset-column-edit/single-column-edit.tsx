// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useRef, useState } from 'react';

import { EditIconButton } from '@cozeloop/components';
import { useSpace } from '@cozeloop/biz-hooks-adapter';
import {
  type EvaluationSet,
  type FieldSchema,
} from '@cozeloop/api-schema/evaluation';
import { StoneEvaluationApi } from '@cozeloop/api-schema';
import {
  Form,
  type FormApi,
  FormInput,
  Modal,
  Typography,
} from '@coze-arch/coze-design';

import {
  DATA_TYPE_LIST,
  type DataType,
  DISPLAY_FORMAT_MAP,
  DISPLAY_TYPE_MAP,
} from '../../dataset-item/type';
import { columnNameRuleValidator } from '../../../utils/source-name-rule';
import {
  convertDataTypeToSchema,
  convertSchemaToDataType,
} from '../../../utils/field-convert';
import { GuardPoint, useGuard } from '@cozeloop/guard';

interface ColumnForm {
  columns: FieldSchema[];
}

// eslint-disable-next-line @coze-arch/max-line-per-function -- skip
export const DatasetSingleColumnEdit = ({
  datasetDetail,
  onRefresh,
  currentField,
  disabledDataTypeSelect,
}: {
  datasetDetail?: EvaluationSet;
  onRefresh: () => void;
  currentField: FieldSchema;
  disabledDataTypeSelect?: boolean;
}) => {
  const formApiRef = useRef<FormApi>();
  const { spaceID } = useSpace();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: guardData } = useGuard({
    point: GuardPoint['eval.dataset.edit_col'],
  });

  const handleSubmit = async (values: ColumnForm) => {
    try {
      setLoading(true);
      const columns = values?.columns?.map(item =>
        convertDataTypeToSchema(item),
      );
      await StoneEvaluationApi.UpdateEvaluationSetSchema({
        evaluation_set_id: datasetDetail?.id as string,
        fields: columns,
        workspace_id: spaceID,
      });
      onRefresh();
      setVisible(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  const fieldSchemas =
    datasetDetail?.evaluation_set_version?.evaluation_set_schema?.field_schemas;
  const initColumnsData =
    fieldSchemas?.map(item => convertSchemaToDataType(item)) || [];
  const selectedFieldIndex = fieldSchemas?.findIndex(
    item => item.key === currentField?.key,
  );
  const selectedFieldDataType = initColumnsData[selectedFieldIndex || 0]
    ?.type as DataType;

  return (
    <>
      <EditIconButton
        onClick={() => {
          setVisible(true);
        }}
      />
      <Modal
        visible={visible}
        width={600}
        zIndex={1061}
        title={
          <div className="flex overflow-hidden">
            <span>编辑列：</span>
            <Typography.Text
              className="!text-[18px] !font-semibold flex-1"
              ellipsis={{
                showTooltip: { opts: { theme: 'dark', zIndex: 1900 } },
              }}
            >
              {currentField?.name}
            </Typography.Text>
          </div>
        }
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          formApiRef.current?.submitForm();
        }}
        keepDOM={false}
        okText="保存"
        okButtonProps={{ loading, disabled: guardData.readonly }}
        cancelText="取消"
      >
        <Form<ColumnForm>
          getFormApi={formApi => (formApiRef.current = formApi)}
          onSubmit={handleSubmit}
          initValues={{
            columns: initColumnsData,
          }}
        >
          <FormInput
            label="名称"
            maxLength={50}
            field={`columns.${selectedFieldIndex}.name`}
            rules={[
              {
                required: true,
                message: '请输入列名称',
              },
              {
                validator: columnNameRuleValidator,
              },
              {
                validator: (_, value) => {
                  if (
                    fieldSchemas
                      ?.filter(
                        (data, dataIndex) => dataIndex !== selectedFieldIndex,
                      )
                      .some(item => item.name === value)
                  ) {
                    return false;
                  }
                  return true;
                },
                message: '列名称已存在',
              },
            ]}
          ></FormInput>
          <Form.Select
            label="数据类型"
            zIndex={1070}
            fieldClassName="flex-1"
            disabled={disabledDataTypeSelect}
            optionList={DATA_TYPE_LIST}
            field={`columns.${selectedFieldIndex}.type`}
            className="w-full"
            rules={[{ required: true, message: '请选择数据类型' }]}
          ></Form.Select>
          <Form.Select
            label="查看格式"
            zIndex={1070}
            fieldClassName="flex-1"
            field={`columns.${selectedFieldIndex}.default_display_format`}
            className="w-full"
            optionList={DISPLAY_TYPE_MAP[selectedFieldDataType]?.map(item => ({
              label: DISPLAY_FORMAT_MAP[item],
              value: item,
            }))}
            rules={[{ required: true, message: '请选择查看格式' }]}
          ></Form.Select>
          <Form.TextArea
            label="描述"
            maxLength={200}
            field={`columns.${selectedFieldIndex}.description`}
          ></Form.TextArea>
        </Form>
      </Modal>
    </>
  );
};
