// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package queueprocessor

import (
	"github.com/coze-dev/cozeloop/backend/modules/observability/domain/trace/entity/collector/processor"
)

const (
	procType = "queue"
)

func NewFactory() processor.Factory {
	return processor.NewFactory(
		procType,
		createDefaultConfig,
		createTracesProcessor,
	)
}
