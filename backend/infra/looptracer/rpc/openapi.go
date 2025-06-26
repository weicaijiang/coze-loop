// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package rpc

import (
	"github.com/coze-dev/cozeloop/backend/kitex_gen/coze/loop/foundation/file/fileservice"
	"github.com/coze-dev/cozeloop/backend/kitex_gen/coze/loop/observability/observabilitytraceservice"
)

var loopTracerHandler *LoopTracerHandler

type LoopTracerHandler struct {
	LocalFileService  fileservice.Client
	LocalTraceService observabilitytraceservice.Client
}

func SetLoopTracerHandler(fileClient fileservice.Client, traceService observabilitytraceservice.Client) {
	loopTracerHandler = &LoopTracerHandler{fileClient, traceService}
}

func GetLoopTracerHandler() *LoopTracerHandler {
	return loopTracerHandler
}
