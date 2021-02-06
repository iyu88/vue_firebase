<template>
  <v-app>
    <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <site-title :title="site.title"></site-title>
    <v-spacer/>
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
    }
  }
}
</script>
