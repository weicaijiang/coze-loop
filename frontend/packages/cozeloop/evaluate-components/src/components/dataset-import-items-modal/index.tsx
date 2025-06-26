// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @coze-arch/max-line-per-function */
import { useRef, useState } from 'react';

import { debounce } from 'lodash-es';
import cs from 'classnames';
import { GuardPoint, useGuard } from '@cozeloop/guard';
import { InfoTooltip } from '@cozeloop/components';
import { useSpace, useDataImportApi } from '@cozeloop/biz-hooks-adapter';
import { uploadFile } from '@cozeloop/biz-components-adapter';
import { type EvaluationSet } from '@cozeloop/api-schema/evaluation';
import { StorageProvider, FileFormat } from '@cozeloop/api-schema/data';
import { IconCozFileCsv } from '@coze-arch/coze-design/illustrations';
import { IconCozDownload, IconCozUpload } from '@coze-arch/coze-design/icons';
import {
  Button,
  // Button,
  Form,
  type FormApi,
  Modal,
  Typography,
  type UploadProps,
  withField,
} from '@coze-arch/coze-design';

import { getCSVHeaders } from '../../utils/upload';
import { getDefaultColumnMap } from '../../utils/import-file';
import { downloadCSVTemplate } from '../../utils/download-template';
import { useDatasetImportProgress } from './use-import-progress';
import { OverWriteField } from './overwrite-field';
import { ColumnMapField } from './column-map-field';

import styles from './index.module.less';
const FormColumnMapField = withField(ColumnMapField);
const FormOverWriteField = withField(OverWriteField);
export const DatasetImportItemsModal = ({
  onCancel,
  onOk,
  datasetDetail,
}: {
  onCancel: () => void;
  onOk: () => void;
  datasetDetail?: EvaluationSet;
}) => {
  const formRef = useRef<FormApi>();
  const { spaceID } = useSpace();
  const { importDataApi } = useDataImportApi();
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const { startProgressTask, node } = useDatasetImportProgress(onOk);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const guard = useGuard({ point: GuardPoint['eval.dataset.import'] });

  const handleUploadFile: UploadProps['customRequest'] = async ({
    fileInstance,
    file,
    onProgress,
    onSuccess,
    onError,
  }) => {
    await uploadFile({
      file: fileInstance,
      fileType: fileInstance.type?.includes('image') ? 'image' : 'object',
      onProgress,
      onSuccess,
      onError,
      spaceID,
    });
    getCSVHeaders(fileInstance, headers => {
      setCsvHeaders(headers);
      formRef?.current?.setValue(
        'fieldMappings',
        getDefaultColumnMap(datasetDetail, headers),
      );
    });
  };
  const onSubmit = async values => {
    setLoading(true);
    try {
      const res = await importDataApi({
        workspace_id: spaceID,
        dataset_id: datasetDetail?.id as string,
        file: {
          provider: StorageProvider.S3,
          path: values.file?.[0]?.response?.Uri,
          format: FileFormat.CSV,
        },
        field_mappings: values.fieldMappings?.filter(item => !!item?.source),
        option: {
          overwrite_dataset: values.overwrite,
        },
      });
      if (res.job_id) {
        startProgressTask(res.job_id);
        setVisible(false);
      }
    } finally {
      setLoading(false);
    }
  };
  const downloadCSV = debounce(downloadCSVTemplate, 400);

  return (
    <>
      <Modal
        title="导入数据"
        width={640}
        visible={visible}
        keepDOM={true}
        onCancel={onCancel}
        className={styles.modal}
        hasScroll={false}
        footer={null}
      >
        <Form
          initValues={{
            fieldMappings: getDefaultColumnMap(datasetDetail, csvHeaders),
            overwrite: false,
          }}
          getFormApi={formApi => {
            formRef.current = formApi;
          }}
          onValueChange={values => {
            console.log('values', values);
          }}
          onSubmit={onSubmit}
        >
          {({ formState, formApi }) => {
            const file = formState.values?.file;
            return (
              <>
                <div className={cs(styles.form, 'styled-scrollbar')}>
                  <Form.Upload
                    field="file"
                    label="上传数据"
                    limit={1}
                    onChange={({ fileList }) => {
                      if (fileList.length === 0) {
                        setCsvHeaders([]);
                        formRef?.current?.setValue(
                          'fieldMappings',
                          getDefaultColumnMap(datasetDetail, []),
                        );
                      }
                    }}
                    draggable={true}
                    previewFile={() => (
                      <IconCozFileCsv className="w-[32px] h-[32px]" />
                    )}
                    className={styles.upload}
                    dragIcon={<IconCozUpload className="w-[32px] h-[32px]" />}
                    dragMainText="点击上传或者拖拽文件至此处"
                    dragSubText={
                      <div>
                        <Typography.Text
                          className="!coz-fg-secondary"
                          size="small"
                        >
                          推荐使用模板上传1个文件，支持CSV格式
                        </Typography.Text>
                        <Typography.Text
                          link
                          icon={<IconCozDownload />}
                          className="ml-[12px]"
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            downloadCSV();
                          }}
                        >
                          下载模板
                        </Typography.Text>
                      </div>
                    }
                    action=""
                    accept=".csv"
                    customRequest={handleUploadFile}
                    rules={[
                      {
                        required: true,
                        message: '请上传文件',
                      },
                    ]}
                  ></Form.Upload>
                  {file?.[0]?.response?.Uri ? (
                    <FormColumnMapField
                      extraTextPosition="middle"
                      field="fieldMappings"
                      extraText={
                        <Typography.Text
                          type="secondary"
                          size="small"
                          className="!coz-fg-secondary"
                        >
                          如果待导入数据集的列没有配置映射关系，则该列不会被导入。
                        </Typography.Text>
                      }
                      label={
                        <div className="inline-flex items-center gap-1 !coz-fg-primary">
                          <div>列映射</div>
                          <InfoTooltip
                            className="h-[15px]"
                            content="待导入数据的列名和当前评测集列名的映射关系。"
                          />
                        </div>
                      }
                      sourceColumns={csvHeaders}
                      rules={[
                        {
                          required: true,
                          message: '请配置列映射',
                        },
                        {
                          validator: (_, data) => {
                            if (data?.every(item => item?.source === '')) {
                              return false;
                            }
                            return true;
                          },
                          message: '请配置最少一个导入列',
                        },
                      ]}
                    />
                  ) : null}
                  <FormOverWriteField
                    field="overwrite"
                    rules={[{ required: true, message: '请选择导入方式' }]}
                    label={'导入方式'}
                  />
                </div>
                <div className="flex justify-end p-[24px] pb-0">
                  <Button
                    className="mr-2"
                    color="primary"
                    onClick={() => {
                      onCancel();
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    color="brand"
                    onClick={() => {
                      formRef.current?.submitForm();
                    }}
                    loading={loading}
                    disabled={guard.data.readonly || !file?.[0]?.response?.Uri}
                  >
                    导入
                  </Button>
                </div>
              </>
            );
          }}
        </Form>
      </Modal>
      {node}
    </>
  );
};
