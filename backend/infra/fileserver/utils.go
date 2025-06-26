// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package fileserver

import "io"

type rr interface {
	io.Reader
	io.ReaderAt
}

func NopCloser(r rr) Reader {
	return &nopCloser{r}
}

type nopCloser struct {
	rr
}

func (nopCloser) Close() error { return nil }
