// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

import cn from 'classnames';
import { type PromptMessage } from '@cozeloop/prompt-components';
import { TextWithCopy } from '@cozeloop/components';
import { useModalData } from '@cozeloop/base-hooks';
import { type Message, VariableType } from '@cozeloop/api-schema/prompt';
import { IconCozTrashCan } from '@coze-arch/coze-design/icons';
import {
  Button,
  IconButton,
  Popconfirm,
  TextArea,
  Typography,
} from '@coze-arch/coze-design';

import { messageId } from '@/utils/prompt';

import { PlaceholderModal } from '../variables-card/placeholder-modal';

import styles from './index.module.less';

interface VariableInputProps {
  variableKey?: string;
  variableType?: VariableType;
  variableValue?: string;
  placeholderMessages?: PromptMessage[];
  readonly?: boolean;
  onValueChange?: (params: {
    key?: string;
    value?: string;
    messageList?: PromptMessage[];
  }) => void;
  onDelete?: (key?: string) => void;
}
export function VariableInput({
  variableKey,
  variableType,
  variableValue,
  placeholderMessages,
  onValueChange,
  onDelete,
  readonly,
}: VariableInputProps) {
  const [editorActive, setEditorActive] = useState(false);
  const placeholderModal = useModalData<Message[]>();
  return (
    <div
      className={cn(styles['variable-input'], {
        [styles['variable-input-active']]: editorActive,
      })}
    >
      <div className="flex items-center justify-between h-8">
        <TextWithCopy
          content={variableKey}
          maxWidth={200}
          copyTooltipText="复制变量名"
          textClassName="variable-text"
        />
        {readonly ? (
          <IconButton
            className={styles['delete-btn']}
            icon={<IconCozTrashCan />}
            size="small"
            color="secondary"
            disabled={readonly}
          />
        ) : (
          <Popconfirm
            title="删除变量"
            content="将删除 Prompt 模板中的该变量。确认删除吗？"
            cancelText="取消"
            okText="删除"
            okButtonProps={{ color: 'red' }}
            onConfirm={() => onDelete?.(variableKey)}
          >
            <IconButton
              className={styles['delete-btn']}
              icon={<IconCozTrashCan />}
              size="mini"
              color="secondary"
              disabled={readonly}
            />
          </Popconfirm>
        )}
      </div>
      {variableType === VariableType.Placeholder ? (
        <>
          {placeholderMessages?.length ? (
            <div className="flex flex-col gap-2">
              {placeholderMessages.map(message => (
                <div className={styles['placeholder-message-wrap']}>
                  <div className={styles['placeholder-message-header']}>
                    {message.role ?? '-'}
                  </div>
                  <div className="px-3 py-1 min-h-[20px]">
                    <Typography.Text size="small">
                      {message.content}
                    </Typography.Text>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <Button
            color="primary"
            disabled={readonly}
            onClick={() => {
              const messages = placeholderMessages?.map(item => {
                if (!item.id || item.id === '0') {
                  return {
                    ...item,
                    id: messageId(),
                  };
                }
                return item;
              });
              placeholderModal.open(messages);
            }}
            size="small"
          >
            编辑Placeholder
          </Button>
        </>
      ) : (
        <TextArea
          value={variableValue}
          onChange={(value: string) =>
            onValueChange?.({ key: variableKey, value })
          }
          placeholder="请输入参数值"
          borderless
          autosize={{ minRows: 1, maxRows: 3 }}
          disabled={readonly}
          onFocus={() => setEditorActive(true)}
          onBlur={() => setEditorActive(false)}
          className="!border-0 !bg-transparent !p-0"
        />
      )}
      <PlaceholderModal
        visible={placeholderModal.visible}
        onCancel={placeholderModal.close}
        onOk={messageList => {
          onValueChange?.({
            key: variableKey,
            messageList,
          });
          placeholderModal.close();
        }}
        data={placeholderModal.data}
        variableKey={variableKey || ''}
      />
    </div>
  );
}
