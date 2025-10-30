/*
 * @Author: 郭郭
 * @Date: 2025/10/22
 * @Description:
 */

import { useSearchParams } from 'react-router-dom';

// 自定义查询query参数
export function useQuery() {
  const [searchParams] = useSearchParams();
  return searchParams;
}
