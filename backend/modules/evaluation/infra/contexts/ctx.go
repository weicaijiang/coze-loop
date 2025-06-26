// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package contexts

import (
	"context"
)

type ctxWriteDBKey struct{}

type ctxWriteDBVal struct{}

func WithCtxWriteDB(ctx context.Context) context.Context {
	return context.WithValue(ctx, ctxWriteDBKey{}, ctxWriteDBVal{})
}

func CtxWriteDB(ctx context.Context) bool {
	return ctx.Value(ctxWriteDBKey{}) != nil
}

func WithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, "user_id", userID)
}

func GetUserID(ctx context.Context) string {
	userID, ok := ctx.Value("user_id").(string)
	if !ok {
		return ""
	}
	return userID
}

//const (
//	ctxCacheKeyWriteDB = "ctx_cache_write_db"
//)
//
//func WithCtxCacheWriteDB(ctx context.Context) {
//	ctxcache.Store(ctx, ctxCacheKeyWriteDB, ctxWriteDBVal{})
//}
//
//func CtxCacheWriteDB(ctx context.Context) bool {
//	_, ok := ctxcache.Pop(ctx, ctxCacheKeyWriteDB)
//	return ok
//}
