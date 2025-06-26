// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0

package conf

//go:generate mockgen -destination=mocks/runtime.go -package=mocks . IConfigRuntime
type IConfigRuntime interface {
	NeedCvtURLToBase64() bool
}
