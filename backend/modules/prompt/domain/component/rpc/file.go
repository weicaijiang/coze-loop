// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package rpc

import "context"

//go:generate mockgen -destination=mocks/file_provider.go -package=mocks . IFileProvider
type IFileProvider interface {
	MGetFileURL(ctx context.Context, keys []string) (urls map[string]string, err error)
}
