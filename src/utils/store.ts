const Local = {
  setKey(key: string) {
    return key;
  },
  // 设置缓存
  set<T>(key: string, val: T, local: boolean = true) {
    if (local) {
      // @ts-ignore
      window.localStorage.setItem(Local.setKey(key), JSON.stringify(val));
    } else {
      // @ts-ignore
      window.sessionStorage.setItem(Local.setKey(key), JSON.stringify(val));
    }
  },
  // 获取缓存
  get(key: string, local: boolean = true) {
    let json = '{}';
    if (local) {
      // @ts-ignore
      json = <string>window.localStorage.getItem(Local.setKey(key) || '{}');
    } else {
      // @ts-ignore
      json = <string>window.sessionStorage.getItem(Local.setKey(key) || '{}');
    }
    return JSON.parse(json);
  },
  // 移除缓存
  remove(key: string, local: boolean = true) {
    if (local) {
      // @ts-ignore
      window.localStorage.removeItem(Local.setKey(key));
    } else {
      // @ts-ignore
      window.sessionStorage.removeItem(Local.setKey(key));
    }
  },
  // 移除全部缓存
  clear(local: boolean = true) {
    if (local) {
      // @ts-ignore
      window.localStorage.clear();
    } else {
      // @ts-ignore
      window.sessionStorage.clear();
    }
  },
};
export default Local;
