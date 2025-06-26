// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @coze-arch/max-line-per-function */
/* eslint-disable complexity */

import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { useShallow } from 'zustand/react/shallow';
import classNames from 'classnames';
import { useRequest } from 'ahooks';
import { EVENT_NAMES, sendEvent } from '@cozeloop/tea-adapter';
import { getBaseUrl } from '@cozeloop/components';
import { useSpace } from '@cozeloop/biz-hooks-adapter';
import { type Prompt } from '@cozeloop/api-schema/prompt';
import { promptManage } from '@cozeloop/api-schema';
import {
  IconCozIllusDone,
  IconCozIllusDoneDark,
} from '@coze-arch/coze-design/illustrations';
import { IconCozCheckMarkFill } from '@coze-arch/coze-design/icons';
import {
  EmptyState,
  Form,
  type FormApi,
  Loading,
  Modal,
  Skeleton,
  Typography,
} from '@coze-arch/coze-design';

import { sleep, versionValidate } from '@/utils/prompt';
import { usePromptStore } from '@/store/use-prompt-store';
import { CALL_SLEEP_TIME } from '@/consts';

import { DiffContent } from './diff-content';

import styles from './index.module.less';

interface PromptSubmitProps {
  visible: boolean;
  initVersion?: string;
  onCancel?: () => void;
  onOk?: (version: { version?: string }) => void;
}

export function PromptSubmit({
  visible,
  onOk,
  onCancel,
  initVersion,
}: PromptSubmitProps) {
  const formApi = useRef<FormApi<{ version?: string; description?: string }>>();
  const { spaceID } = useSpace();
  const { promptInfo } = usePromptStore(
    useShallow(state => ({ promptInfo: state.promptInfo })),
  );
  const navigate = useNavigate();
  const baseURL = getBaseUrl(spaceID);

  const [basePrompt, setBasePrompt] = useState<Prompt>();
  const [currentPrompt, setCurrentPrompt] = useState<Prompt>();

  const [okButtonText, setOkButtonText] = useState('继续');

  const { runAsync: getPromptByVersion } = useRequest(
    (version?: string) =>
      promptManage.GetPrompt({
        prompt_id: promptInfo?.id ?? '',
        with_draft: !version,
        with_commit: Boolean(version),
      }),
    {
      manual: true,
      ready: Boolean(spaceID && visible),
    },
  );

  const showSuccessModal = () => {
    const modal = Modal.info({
      title: '提交新版本',
      width: 960,
      closable: true,
      content: (
        <div className="w-full h-[470px] flex items-center justify-center">
          <EmptyState
            icon={<IconCozIllusDone width="160" height="160" />}
            darkModeIcon={<IconCozIllusDoneDark width="160" height="160" />}
            title={
              <Typography.Title heading={5} className="!my-4">
                提交成功
              </Typography.Title>
            }
            description={
              <div className="flex flex-col items-center gap-2 w-[400px]">
                <Typography.Text className="flex gap-2 items-center">
                  接入 CozeLoop SDK 上报数据，进行数据观测
                  <Typography.Text
                    link
                    onClick={() => {
                      navigate(`${baseURL}/observation/traces`);
                      modal.destroy();
                    }}
                  >
                    立即前往
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text className="flex gap-2 items-center">
                  对 Prompt 进行效果评估，提升应用效果
                  <Typography.Text
                    link
                    onClick={() => {
                      navigate(`${baseURL}/evaluation/datasets`);
                      modal.destroy();
                    }}
                  >
                    立即前往
                  </Typography.Text>
                </Typography.Text>
              </div>
            }
          />
        </div>
      ),
      okText: '关闭',
    });
  };

  const { loading: submitLoading, runAsync: submitRunAsync } = useRequest(
    async () => {
      const values = await formApi.current
        ?.validate()
        ?.catch(e => console.error(e));
      if (!values) {
        return;
      }

      try {
        await promptManage.CommitDraft({
          prompt_id: promptInfo?.id || '',
          commit_version: values?.version || '',
          commit_description: values?.description,
        });
        sendEvent(EVENT_NAMES.prompt_submit_info, {
          prompt_id: `${promptInfo?.id || 'playground'}`,
          prompt_key: promptInfo?.prompt_key || 'playground',
          version: values?.version || '',
        });
        await sleep(CALL_SLEEP_TIME);

        await onOk?.({ version: values?.version });

        showSuccessModal();
      } catch (e) {
        console.error(e);
      }
    },
    {
      manual: true,
      ready: Boolean(spaceID && promptInfo?.id),
      refreshDeps: [spaceID, promptInfo?.id],
    },
  );

  useEffect(() => {
    if (visible && promptInfo?.prompt_draft?.draft_info?.base_version) {
      getPromptByVersion().then(vres => {
        setCurrentPrompt(vres.prompt);
        getPromptByVersion(
          promptInfo?.prompt_draft?.draft_info?.base_version,
        ).then(res => {
          setBasePrompt(res?.prompt);
        });
      });
    } else {
      setOkButtonText('继续');
      setBasePrompt(undefined);
      setCurrentPrompt(undefined);
      formApi.current?.reset();
    }
  }, [visible, promptInfo]);

  const submitForm = (
    <Form
      initValues={{ version: initVersion }}
      getFormApi={api => (formApi.current = api)}
    >
      <Form.Input
        label={{
          text: '版本',
          required: true,
        }}
        field="version"
        required
        validate={val => versionValidate(val, initVersion)}
        placeholder="请输入版本号，版本号格式为a.b.c, 且每段为0-9999"
      />
      <Form.TextArea
        label="版本说明"
        field="description"
        placeholder="请输入版本说明"
        maxCount={200}
        maxLength={200}
        rows={5}
      />
    </Form>
  );

  const handleSubmit = () => {
    if (okButtonText === '继续') {
      setOkButtonText('提交');
    } else {
      submitRunAsync();
    }
  };

  return (
    <Modal
      className="min-h-[calc(100vh - 140px)]"
      width={900}
      visible={visible}
      title="提交新版本"
      onCancel={onCancel}
      okText={basePrompt ? okButtonText : '提交'}
      cancelText="取消"
      onOk={basePrompt ? handleSubmit : submitRunAsync}
      okButtonProps={{ loading: submitLoading }}
      height="fit-content"
    >
      <Skeleton
        loading={Boolean(
          !currentPrompt && promptInfo?.prompt_draft?.draft_info?.base_version,
        )}
        placeholder={
          <div className="w-full flex items-center justify-center  h-[470px]">
            <Loading loading />
          </div>
        }
      >
        <div className="w-full overflow-y-auto">
          {basePrompt ? (
            <div className="flex flex-col gap-2">
              <div className={styles['tab-header']}>
                <Typography.Text
                  className={classNames(
                    styles['tab-step'],
                    styles['tab-active'],
                    'cursor-pointer',
                  )}
                  icon={
                    okButtonText === '提交' ? (
                      <span className={styles['tab-icon']}>
                        <IconCozCheckMarkFill />
                      </span>
                    ) : (
                      <span className={styles['tab-icon']}>1</span>
                    )
                  }
                  onClick={() => setOkButtonText('继续')}
                >
                  确认版本差异
                </Typography.Text>
                <Typography.Text
                  className={classNames(styles['tab-step'], {
                    [styles['tab-active']]: okButtonText === '提交',
                  })}
                  icon={<span className={styles['tab-icon']}>2</span>}
                >
                  确认版本信息
                </Typography.Text>
              </div>
              <div className="flex-1">
                {okButtonText === '继续' ? (
                  <DiffContent base={basePrompt} current={currentPrompt} />
                ) : (
                  submitForm
                )}
              </div>
            </div>
          ) : (
            submitForm
          )}
        </div>
      </Skeleton>
    </Modal>
  );
}
