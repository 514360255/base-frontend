/*
 * @Author: 郭郭
 * @Date: 2025/8/11
 * @Description:
 */

const IndexModel = {
  namespace: 'login',
  state: {},
  effects: {
    *userInfo({ payload }: { payload: any }, { put }: any) {
      yield put({ type: 'setUserInfo', payload });
    },
  },
  // 同步函数 更新数据
  reducers: {
    setUserInfo(state: any, action: any) {
      return { ...state, ...action.payload };
    },
  },
};

export default IndexModel;
