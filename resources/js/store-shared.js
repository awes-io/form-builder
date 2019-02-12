export default {

    state: {},

    mutations: {

        setData: (state, { param, data }) => {
            Vue.set(state, param, data)
        }
    }
}