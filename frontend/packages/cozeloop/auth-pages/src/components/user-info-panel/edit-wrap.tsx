// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { useState, type ReactNode } from 'react';

import cls from 'classnames';
import { IconCozEdit } from '@coze-arch/coze-design/icons';
import { IconButton, Button } from '@coze-arch/coze-design';

import s from './edit-wrap.module.less';

interface Props {
  className?: string;
  displayComponent: ReactNode;
  editableComponent: ReactNode;
  canSave?: boolean;
  loading?: boolean;
  cancelText?: string;
  saveText?: string;
  onSave?: () => Promise<boolean>;
  onCancel?: () => void;
}

export function EditWrap({
  className,
  displayComponent,
  editableComponent,
  canSave,
  loading,
  cancelText = 'Cancel',
  saveText = 'Save',
  onSave,
  onCancel,
}: Props) {
  const [editing, setEditing] = useState(false);
  const cancel = () => {
    onCancel?.();
    setEditing(false);
  };

  const save = async () => {
    const success = await onSave?.();
    success && setEditing(false);
  };

  return (
    <div className={cls(s.container, className)}>
      {editing ? (
        <>
          {editableComponent}
          <Button
            color="primary"
            className={s.btn}
            loading={loading}
            onClick={cancel}
          >
            {cancelText}
          </Button>
          <Button className={s.btn} loading={loading} onClick={save}>
            {saveText}
          </Button>
        </>
      ) : (
        <>
          {displayComponent}
          <IconButton
            icon={<IconCozEdit />}
            size="mini"
            color="secondary"
            className="ml-[8px]"
            onClick={() => setEditing(true)}
          />
        </>
      )}
    </div>
  );
}
