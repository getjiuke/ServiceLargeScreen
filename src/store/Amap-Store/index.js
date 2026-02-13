export default {
    namespaced: true,
    state: {
        Temporary: null,      //临时数据
        SelectDate: null,      //选择日期
    },
    getters: {},
    mutations: {
        SetTemporary: (state, newvalue) => {
            state.Temporary = newvalue;
        },
        SetSelectDate: (state, newvalue) => {
            state.SelectDate = newvalue;
        }
    },
    actions: {}
}