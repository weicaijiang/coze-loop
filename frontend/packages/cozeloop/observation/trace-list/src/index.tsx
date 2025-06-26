// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
import { PrimaryPage } from '@cozeloop/components';

import { useTraceTimeRangeOptions } from '@/hooks/use-trace-time-range-options';
import { TraceProvider } from '@/contexts/trace-context';
import { SPAN_TAB_OPTION_LIST } from '@/consts/filter';

import { type InitValue } from './utils/url';
import { type ConvertSpan } from './typings/span';
import { type SizedColumn } from './typings/index';
import { usePageStay } from './hooks/use-page-stay';
import { useFetchMetaInfo } from './hooks/use-fetch-meta-info';
import { useColumns } from './hooks/use-column';
import { PLATFORM_ENUM_OPTION_LIST } from './consts/filter';
import { COLUMN_RECORD, SPAN_COLUMNS } from './consts';
import { useFetchTraces } from './components/queries/table/hooks/use-fetch-traces';
import { Queries } from './components/queries';
import { QueryFilterBar } from './components/filter-bar';
import { CozeLoopTraceBanner } from './components/banner';

const TOOLTIP_CONTENT = {
  all_span: '查询所有 SpanID，以上报埋点为粒度进行展示',
  root_span: '根据 TraceID 查询，以调用入口为粒度进行展示',
  llm_span: '仅查询和模型调用相关的埋点',
};

const TraceListApp = () => {
  usePageStay();

  const datePickerOptions = useTraceTimeRangeOptions();
  const { selectedColumns, cols, onColumnsChange, defaultColumns } = useColumns(
    {
      columnsList: SPAN_COLUMNS,
      columnConfig: COLUMN_RECORD as unknown as Record<
        string,
        SizedColumn<ConvertSpan>
      >,
      storageOptions: {
        enabled: true,
        key: 'trace-selected-columns-open',
      },
    },
  );
  useFetchMetaInfo();

  const { spans, noMore, loading, loadMore, loadingMore, traceListCode } =
    useFetchTraces();

  return (
    <div className="h-full max-h-full w-full flex-1 max-w-full overflow-hidden !min-w-[980px] flex flex-col">
      <CozeLoopTraceBanner />
      <PrimaryPage
        pageTitle="Trace"
        filterSlot={
          <QueryFilterBar
            datePickerOptions={datePickerOptions}
            columns={cols}
            defaultColumns={defaultColumns}
            onColumnsChange={onColumnsChange}
            platformEnumOptionList={PLATFORM_ENUM_OPTION_LIST}
            spanListTypeEnumOptionList={SPAN_TAB_OPTION_LIST}
            tooltipContent={TOOLTIP_CONTENT}
          />
        }
        className="!pb-0"
      >
        <Queries
          moduleName="analytics_trace_list"
          selectedColumns={selectedColumns}
          columns={cols}
          spans={spans}
          noMore={noMore}
          loading={loading}
          loadMore={loadMore}
          loadingMore={loadingMore}
          traceListCode={traceListCode}
        />
      </PrimaryPage>
    </div>
  );
};

const initPlatformConfig: InitValue = {
  value: ['cozeloop', 'prompt'],
  defaultValue: 'cozeloop',
  format: 'string',
};

const initSpanListTypeConfig: InitValue = {
  value: ['root_span', 'all_span', 'llm_span'],
  defaultValue: 'root_span',
  format: 'string',
};

export default () => (
  <TraceProvider
    spanListType={initSpanListTypeConfig}
    platformType={initPlatformConfig}
  >
    <TraceListApp />
  </TraceProvider>
);
