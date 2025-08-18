/*
 * @Author: 郭郭
 * @Date: 2025/8/18
 * @Description:
 */

const formModel = {
  namespace: 'formState',
  state: {
    data: {},
  },
  effects: {
    *getFormState({ payload }: { payload: any }, { put }: any) {
      yield put({ type: 'data', payload });
    },
  },
  // 同步函数 更新数据
  reducers: {
    setFormState(state: any, action: any) {
      return { ...state, ...action.payload };
    },
  },
};
