<template>
  <v-app>
    <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <site-title :title="site.title"></site-title>
    <v-spacer/>
    <v-btn color="warning" @click="myTodo">
      나의 Todo List
    </v-btn>
    <v-dialog v-model="todo" max-width="400px">
      <v-card v-if="!$store.state.fireUser">
        <v-card-title>
          <v-icon class="mr-2">mdi-alert-outline</v-icon>
          로그인이 필요한 서비스입니다.
        </v-card-title>
      </v-card>
      <v-card v-else>
        <v-card-title>
          My Todo List
          <v-spacer />
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="newTask" clearable hide-details append-icon="mdi-plus" @click:append="saveTodo"></v-text-field>
          <v-list>
            <v-list-item v-for="(task, i) in tasks.todos" :key="i">
              {{ i+1 }}. {{ task }}
              <v-spacer />
              <v-btn icon @click="deleteTodo(i)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
    <site-sign></site-sign>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" width="400">
      <site-menu :items="site.menu"></site-menu>
    </v-navigation-drawer>
    <v-content>
      <router-view/>
    </v-content>
    <site-footer :footer="site.footer"></site-footer>
  </v-app>
</template>

<script>
import SiteTitle from '@/views/site/title.vue'
import SiteFooter from '@/views/site/footer.vue'
import SiteMenu from '@/views/site/menu.vue'
import SiteSign from '@/views/site/sign.vue'

export default {
  name: 'App',
  components: { SiteTitle, SiteFooter, SiteMenu, SiteSign },
  data () {
    return {
      todo: false,
      newTask: null,
      tasks: {
        todos: []
      },
      drawer: false,
      site: {
        title: '사이트 이름',
        menu: [
          {
            title: 'haha',
            icon: 'mdi-pencil',
            subItems: [
              {
                title: 'hihi',
                to: '/hihi'
              },
              {
                title: 'home',
                to: '/'
              }
            ]
          },
          {
            title: 'test',
            icon: 'mdi-home'
          }
        ],
        footer: '푸터 이름'
      },
      unsubscribe: null
    }
  },
  created () {
    this.subscribe()
  },
  destroy () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      this.unsubscribe = this.$firebase.database().ref().child('site').on('value', (sn) => {
        const v = sn.val()
        if (!v) {
          this.$firebase.database().ref().child('site').set(this.site)
          return
        }
        this.site = v
      }, (e) => {
        console.log(e.message)
      })
    },
    async myTodo () {
      this.todo = !this.todo
      await this.$firebase.firestore().collection('users').doc(this.$store.state.fireUser.uid).onSnapshot(doc => {
        if (!doc.exists) {
          this.tasks.todos = []
          return
        }
        this.tasks = doc.data()
      })
    },
    async saveTodo () {
      console.log('save')
      if (!this.newTask) throw Error('작업 내용을 입력해주세요.')
      this.tasks.todos.push(this.newTask)
      this.newTask = ''
      try {
        await this.$firebase.firestore().collection('users').doc(this.$store.state.fireUser.uid).set(this.tasks)
      } finally {
        this.$toasted.global.notice('Todo Updated')
      }
    },
    async deleteTodo (index) {
      this.tasks.todos.splice(index, 1)
      await this.$firebase.firestore().collection('users').doc(this.$store.state.fireUser.uid).update(this.tasks)
    }
  }
}
</script>
