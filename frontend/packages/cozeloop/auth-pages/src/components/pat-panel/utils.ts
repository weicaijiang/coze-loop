// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { I18n } from '@cozeloop/i18n-adapter';
import { DurationDay } from '@cozeloop/api-schema/foundation';

function getFormattedFutureDate(value: string): string {
  if (value === DurationDay.Permanent) {
    return '∞';
  }
  const currentDate = new Date();
  const futureDate = new Date(
    currentDate.getTime() + Number(value) * 24 * 60 * 60 * 1000,
  );

  return formatDate(futureDate);
}

export function formatDate(
  date?: Date,
  fmt: 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' = 'YYYY-MM-DD',
): string {
  if (!date) {
    return '-';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (fmt === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  } else {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}

export function getExpirationOptions() {
  const dataOptionsList = [
    { label: '1天', value: DurationDay.Day1 },
    { label: '30天', value: DurationDay.Day30 },
    { label: '60天', value: DurationDay.Day60 },
    { label: '90天', value: DurationDay.Day90 },
    { label: '180天', value: DurationDay.Day180 },
    { label: '365天', value: DurationDay.Day365 },
    { label: '永久', value: DurationDay.Permanent },
    { label: I18n.t('customize_key_1'), value: 'custom' },
  ];
  const newOptions = dataOptionsList.map(item => {
    const { value } = item;
    if (value === 'custom') {
      return item;
    }
    const date = getFormattedFutureDate(value);

    return {
      label:
        value === DurationDay.Permanent
          ? 'Permanent'
          : I18n.t('expired_time_days_1', { num: Number(value), date }),
      value,
    };
  });
  return newOptions;
}

const MAX_EXPIRATION_DAYS = 30;

export function disabledDate(date?: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysLater = new Date(
    today.getTime() + MAX_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
  );

  if (!date) {
    return false;
  }

  const inputDate = new Date(date);

  return (
    inputDate < today ||
    inputDate.getTime() === today.getTime() ||
    inputDate > thirtyDaysLater
  );
}

export function getDetailTime(v?: number | string) {
  const d = typeof v === 'undefined' ? undefined : Number(v);
  if (typeof d === 'undefined' || isNaN(d) || d === -1 || d === 0) {
    return '-';
  }
  return formatDate(new Date(d * 1000), 'YYYY-MM-DD HH:mm:ss');
}

export function getExpirationTime(v?: number | string) {
  const d = typeof v === 'undefined' ? undefined : Number(v);
  if (typeof d === 'undefined' || isNaN(d)) {
    return '-';
  }

  if (d === -1) {
    return I18n.t('api_status_permanent_1');
  }

  return formatDate(new Date(d * 1000));
}

export function getStatus(d: number | string) {
  if (d === -1) {
    return true;
  }
  const current = Date.now() / 1000;
  return Number(d) >= current;
}
