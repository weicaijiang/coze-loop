// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package mq

import (
	"context"

	"github.com/coze-dev/cozeloop/backend/modules/observability/domain/trace/entity"
)

//go:generate mockgen -destination=mocks/producer.go -package=mocks . ITraceProducer
type ITraceProducer interface {
	IngestSpans(ctx context.Context, data *entity.TraceData) error
}
