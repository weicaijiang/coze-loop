// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
export const getUrlParamWithDelete = (key: string) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(key);
  urlParams.delete(key);
  window.history.pushState({}, '', urlParams.toString());
  return value;
};
