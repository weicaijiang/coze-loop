// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package traceutil

import "github.com/coze-dev/cozeloop/backend/pkg/errorx"

func GetTraceStatusCode(err error) int32 {
	if statusErr, ok := errorx.FromStatusError(err); ok {
		return statusErr.Code()
	}
	return -1
}
