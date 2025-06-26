// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package middleware

import (
	"context"

	"github.com/cloudwego/hertz/pkg/app"

	"github.com/coze-dev/cozeloop/backend/pkg/ctxcache"
)

func CtxCacheMW() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		c.Next(ctxcache.Init(ctx))
	}
}
