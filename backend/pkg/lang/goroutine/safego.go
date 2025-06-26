// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package goroutine

import (
	"context"
)

func Go(ctx context.Context, fn func()) {
	go func() {
		defer Recovery(ctx)
		fn()
	}()
}
