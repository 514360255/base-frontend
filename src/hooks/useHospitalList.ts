/*
 * @Author: 郭郭
 * @Date: 2025/10/31
 * @Description:
 */

import { queryHospitalPage } from '@/api/hospital';
import { useEffect } from 'react';

export function useHospitalList(
  columns: any[],
  setColumns: (data: any) => any,
  accountId?: string,
) {
  useEffect(async () => {
    const { list }: any = await queryHospitalPage({ pageSizeZero: true, pageSize: 0, accountId });
    console.log(list, '>>>>>');
    // setColumns(transformValueEnum(columns, list, 'hospitalId'));
  }, []);
}
