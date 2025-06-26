// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: Apache-2.0
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;

  const content: any;
  export default content;
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
