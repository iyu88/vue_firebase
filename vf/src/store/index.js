import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editable: false,
    fireUser: null
  },
  mutations: {
    setEdit (state, editable) {
      state.editable = editable
    },
    setFireUser (state, fu) {
      state.fireUser = fu
    }
  },
  actions: {
  },
  modules: {
  }
})
