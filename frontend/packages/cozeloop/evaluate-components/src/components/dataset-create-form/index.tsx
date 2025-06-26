// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useRef, useState } from 'react';

import cs from 'classnames';
import { GuardPoint, Guard } from '@cozeloop/guard';
import { InfoTooltip } from '@cozeloop/components';
import { useNavigateModule, useSpace } from '@cozeloop/biz-hooks-adapter';
import { StoneEvaluationApi } from '@cozeloop/api-schema';
import { IconCozDocument } from '@coze-arch/coze-design/icons';
import {
  type FormApi,
  Form,
  Button,
  Toast,
  FormInput,
  FormTextArea,
  Typography,
} from '@coze-arch/coze-design';

import { DatasetColumnConfig } from '../dataset-column-config';
import { sourceNameRuleValidator } from '../../utils/source-name-rule';
import { convertDataTypeToSchema } from '../../utils/field-convert';
import { DEFAULT_DATASET_CREATE_FORM, type IDatasetCreateForm } from './type';
import { FormSectionLayout } from './form-section-layout';

import styles from './index.module.less';
export interface DatasetCreateFormProps {
  header?: React.ReactNode;
}

// const FormColumnConfig = withField()

export const DatasetCreateForm = ({ header }: DatasetCreateFormProps) => {
  const formRef = useRef<FormApi<IDatasetCreateForm>>();
  const { spaceID } = useSpace();
  const navigate = useNavigateModule();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: IDatasetCreateForm) => {
    try {
      setLoading(true);
      const res = await StoneEvaluationApi.CreateEvaluationSet({
        name: values.name,
        workspace_id: spaceID,
        description: values.description,
        evaluation_set_schema: {
          field_schemas:
            values.columns?.map(item => convertDataTypeToSchema(item)) || [],
          workspace_id: spaceID,
        },
      });
      Toast.success('创建成功');
      navigate(`evaluation/datasets/${res.evaluation_set_id}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between px-6 pt-[12px] py-3 h-[56px] box-border text-[18px]">
        {header}
        <div className="flex items-center gap-[2px]">
          <IconCozDocument className="coz-fg-secondary" />
          <Typography.Text
            className="cursor-pointer !coz-fg-secondary"
            onClick={() => {
              window.open(
                'https://loop.coze.cn/open/docs/cozeloop/create-dataset',
                '_blank',
              );
            }}
          >
            如何创建评测集
          </Typography.Text>
        </div>
      </div>
      <Form<IDatasetCreateForm>
        getFormApi={formApi => {
          formRef.current = formApi;
        }}
        initValues={DEFAULT_DATASET_CREATE_FORM}
        className={cs(styles.form, 'styled-scrollbar')}
        onSubmit={onSubmit}
      >
        <div className="w-[800px] mx-auto flex flex-col gap-[40px]">
          <FormSectionLayout title="基本信息" className="!mb-[14px]">
            <FormInput
              label="名称"
              maxLength={50}
              field="name"
              placeholder="请输入评测集名称"
              rules={[
                { required: true, message: '请输入评测集名称' },
                { validator: sourceNameRuleValidator },
              ]}
            ></FormInput>
            <FormTextArea
              label="描述"
              field="description"
              placeholder="请输入评测集描述"
              maxLength={200}
              maxCount={200}
            ></FormTextArea>
          </FormSectionLayout>

          <FormSectionLayout
            title={
              <div className="flex items-center gap-1">
                配置列
                <InfoTooltip content="评测集创建完成后，仍可修改列配置" />
              </div>
            }
            className="!mb-[24px]"
          >
            <DatasetColumnConfig
              fieldKey="columns"
              showAddButton
            ></DatasetColumnConfig>
          </FormSectionLayout>
        </div>
      </Form>
      <div className="flex justify-end w-[800px] m-[24px] mx-auto">
        <Guard point={GuardPoint['eval.dataset_create.create']}>
          <Button
            color="hgltplus"
            onClick={() => {
              formRef.current?.submitForm();
            }}
            loading={loading}
          >
            创建
          </Button>
        </Guard>
      </div>
    </div>
  );
};
