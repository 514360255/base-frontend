/*
 * @Author: 郭郭
 * @Date: 2025/9/3
 * @Description:
 */
import * as Icons from '@ant-design/icons';
import React, { memo } from 'react';

interface DynamicIconProps {
  iconName?: string;
  style?: React.CSSProperties;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ iconName, style }) => {
  if (!iconName) return null;

  // 尝试匹配 Outlined、Filled、TwoTone 等
  const Icon =
    (Icons as any)[`${iconName}Outlined`] ||
    (Icons as any)[`${iconName}Filled`] ||
    (Icons as any)[`${iconName}TwoTone`] ||
    (Icons as any)[`${iconName}`] ||
    null;

  if (!Icon) {
    console.warn(`Icon ${iconName} not found in @ant-design/icons`);
    return null;
  }

  return <Icon style={style} />;
};

export default memo(DynamicIcon);
