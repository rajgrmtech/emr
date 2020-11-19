// This file is structured based on https://github.com/client-side/vuex-orm-examples-nuxt/tree/master/store
import Vue from 'vue'
import Vuex from 'vuex'

import VuexclientTblOfCtSearchPhrases from '@vuex-orm/plugin-search'
import VuexORM from '@vuex-orm/core'
import VuexORMLocalForage from 'vuex-orm-localforage'

// Use for local storage
import VuexPersist from 'vuex-persist'

import axios from 'axios'
import VuexORMAxios from '@vuex-orm/plugin-axios'

// Ref: https://github.com/eldomagan/vuex-orm-localforage#installation
import vstOfTabsAndDialogInEditLayerModule from '~/components/non-temporal/components-container-in-change-layer/vst-of-tabs-and-dialog-in-cl'

import VueStateOfMapDrawerModule from '~/components/non-temporal/map/vue-state-of-map-drawer'
import VueStateOfDeletedDrawerModule from '~/components/non-temporal/ct-deleted-rows/vue-state-of-deleted-drawer'
import VueStateOfCollepseModule from '~/components/non-temporal/paper-view-of-appt-note-with-amendment-or-modify-feature/set-item-in-expend-state'

import database from '~/store/import-tables-and-register-to-client-side-database'

// Ref: https://stackoverflow.com/a/62247034
const { v1: uuidv1 } = require('uuid')
VuexORM.use(VuexORMAxios, { axios })
VuexORM.use(VuexclientTblOfCtSearchPhrases, {
  tokenize: true, // Ref: https://github.com/client-side/plugin-search#configurations needed so "goal add" works when list has "add goal"
  matchAllTokens: true, // needed so "goal add" shows only opyion 1 when list has "add goal" and "multi rate goal"
  threshold: 0.1, // height and weight are very close and need to be distinguished so set thresold to .1
})

Vue.use(uuidv1)

Vue.use(Vuex)
VuexORM.use(VuexORMLocalForage, { database })

//Initialize VuexPersist: https://flaviocopes.com/vuex-persist-localstorage/
const vuexPersist = new VuexPersist({
  key: 'sc-pf',
  storage: window.localStorage,
})

const createStore = () => {
  return new Vuex.Store({
    state: () => ({}),
    modules: {
      vstObjTabsInCL: vstOfTabsAndDialogInEditLayerModule,

      // Full form: view state object feed drawer
      vstObjMapDrawer: VueStateOfMapDrawerModule,
      vstObjDeletedDrawer: VueStateOfDeletedDrawerModule,
      vstObjExpendState: VueStateOfCollepseModule,
    },
    plugins: [VuexORM.install(database), vuexPersist.plugin],
  })
}

export default createStore
