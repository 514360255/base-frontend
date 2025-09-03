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
    ...(item.children && Array.isArray(item.children)
      ? { children: handleTree(item.children) }
      : {}),
  }));
};

/**
 * 查找节点
 * @param root
 * @param target
 * @param key
 */
export const findNode = (root: any, target: string, key: string = 'value') => {
  if (!Array.isArray(root)) return {};
  const stack = [...root];
  while (stack.length > 0) {
    const current = stack.pop();
    if (`${current[key]}` === `${target}`) return current;
    if (Array.isArray(current.children) && current.children.length > 0) {
      for (let i = current.children.length - 1; i >= 0; i--) {
        stack.push(current.children[i]);
      }
    }
  }
  return {};
};

/**
 * 首字母转化为大写
 * @param string
 */
export const capitalizeFirstLetter = (string: string | number) => {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
};

/**
 * 数组类型转化为首字母大写
 * @param strings
 */
export const capitalizeFirstLetters = (strings: string[]) => {
  if (!Array.isArray(strings)) {
    return strings;
  }
  return strings.map(capitalizeFirstLetter);
};
