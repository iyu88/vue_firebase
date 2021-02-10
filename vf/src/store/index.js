import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editable: false,
    fireUser: null,
    boardViewMode: localStorage.getItem('boardViewMode') === 'true'
  },
  mutations: {
    setEdit (state, editable) {
      state.editable = editable
    },
    setFireUser (state, fu) {
      state.fireUser = fu
    },
    toggleViewMode (state) {
      state.boardViewMode = !state.boardViewMode
      localStorage.setItem('boardViewMode', state.boardViewMode)
    }
  },
  actions: {
  },
  modules: {
  }
})
