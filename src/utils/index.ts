/*
 * @Author: 郭郭
 * @Date: 2025/8/29
 * @Description:
 */

/**
 * 处理菜单树
 * @param data
 */
export const handleTree = (data: any) => {
  return data.map((item: any) => ({
    title: item.name,
    value: item.id,
    children: Array.isArray(item.children) ? handleTree(item.children) : [],
  }));
};
