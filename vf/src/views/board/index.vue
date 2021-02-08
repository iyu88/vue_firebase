<template>
  <board-form v-if="newBoard" :newBoard="newBoard" v-on:cancelBoard="toggleForm"></board-form>
  <v-container v-else fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
   <v-card>
     <v-card-title>
       게시판 목록
       <v-spacer />
       <v-btn icon class="mr-2" @click="toggleForm">
         <v-icon>mdi-plus</v-icon>
       </v-btn>
       <v-btn icon class="mr-2" @click="check">
         <v-icon>mdi-check</v-icon>
       </v-btn>
     </v-card-title>
     <v-card-text>
       <v-row>
         <v-col>
           <template v-for="(item, i) in items">
            <v-card :key="i" x-large class="mr-4 mb-4" :to=item.to exact>
              <v-card-title>
                {{ item.title }}
              </v-card-title>
              <v-card-text>
                {{ item.createdAt }}
              </v-card-text>
              <v-card-text>
                {{ item.categories }}
              </v-card-text>
              <v-card-text>
                {{ item.tags }}
              </v-card-text>
            </v-card>
          </template>
         </v-col>
       </v-row>
     </v-card-text>
  </v-card>
  </v-container>
</template>
<script>
import BoardForm from '@/components/board-form.vue'

export default {
  components: { BoardForm },
  data () {
    return {
      newBoard: false,
      unsubscribe: null,
      items: []
    }
  },
  created () {
    this.subscribe()
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    toggleForm () {
      this.newBoard = !this.newBoard
    },
    async subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      try {
        this.unsubscribe = await this.$firebase.firestore().collection('boards').onSnapshot((sn) => {
          sn.docs.forEach((doc) => {
            const item = doc.data()
            if (!doc.exists) {
              return
            }
            const temp = []
            temp.title = item.title
            temp.createdAt = item.createdAt
            temp.categories = item.categories
            temp.tags = item.tags
            this.items.push(temp)
            console.log(this.items)
          })
        })
      } finally {
        this.$toasted.global.notice('Data Loaded')
      }
    },
    check () {
      this.items.forEach((item) => {
        console.log(item.title)
        console.log(item.description)
        console.log(item.categories)
        console.log(item.tags)
      })
    }
  }
}
</script>
