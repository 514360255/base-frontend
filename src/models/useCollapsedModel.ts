/*
 * @Author: 郭郭
 * @Date: 2025/10/27
 * @Description:
 */
import { useState } from 'react';

export default () => {
  const [collapsed, setCollapsed] = useState(false);

  return {
    collapsed,
    setCollapsed,
  };
};
