// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package rpc

import "context"

//go:generate mockgen -destination=mocks/file.go -package=mocks . IFileProvider
type IFileProvider interface {
	GetDownloadUrls(context.Context, string, []string) (map[string]string, error)
}
