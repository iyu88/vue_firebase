<template>
    <article-form v-if="newArticle" :boardTitle='boardTitle' v-on:cancelArticle="toggleForm" ></article-form>
    <v-container v-else fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-card>
            <v-card-title>
                <span width="100" class="mt-4 mr-4">
                    <v-select solo dense :items="things" placeholder="전체" outlined small color="info">}</v-select>
                </span>
                게시판 이름
                <v-spacer/>
                    <v-btn icon @click="openInfo">
                        <v-icon>mdi-alert-circle-outline</v-icon>
                    </v-btn>
                    <v-btn icon @click="$store.commit('toggleViewMode')">
                        <v-icon>mdi-text-box-outline</v-icon>
                    </v-btn>
                    <v-btn icon @click="newArticle =!newArticle">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
            </v-card-title>
            <v-divider/>
            <v-alert v-if="items.length === 0" type="warning" border="top" icon="mdi-alert-decagram" prominent class="ma-2">읽어올 게시물이 존재하지 않습니다.</v-alert>
            <template v-else-if="$store.state.boardViewMode">
                <v-list-item v-for="(item,i) in items" :key="i" :to="`${$route.path}/${item.pathTo}`">
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-btn color="info" small class="mr-2"> {{ item.category }}
                                <v-icon right>mdi-menu-right</v-icon>
                            </v-btn> {{ item.createdAt.toDate().toLocaleString() }}
                        </v-list-item-title>
                        <v-list-item-title>
                            {{ item.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="mt-2">
                            {{ item.content }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-sheet>
                            <v-icon class="mr-2">mdi-eye</v-icon>
                            <span>{{ item.readCount}}</span>
                        </v-sheet>
                        <v-sheet>
                            <v-icon class="mr-2">mdi-comment</v-icon>
                            <span>{{ item.commentCount }}</span>
                        </v-sheet>
                        <v-sheet>
                            <v-icon class="mr-2">mdi-thumb-up</v-icon>
                            <span>{{ item.likeCount }}</span>
                        </v-sheet>
                        <v-sheet class="mt-2">
                            <user-name :user="item.user.displayName"></user-name>
                        </v-sheet>
                    </v-list-item-action>
                </v-list-item>
            </template>
            <template v-else v-for="(item,i) in items">
                <v-card :key="i" :to="`${$route.path}/${item.pathTo}`">
                    <v-subheader>
                        <v-btn color="info" small class="mr-2"> {{ item.category }}
                            <v-icon right>mdi-menu-right</v-icon>
                        </v-btn> {{ item.createdAt.toDate().toLocaleString() }}
                    </v-subheader>
                    <v-card-title>
                        {{ item.title }}
                    </v-card-title>
                    <v-card-text>
                        {{ item.content }}
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        생성일 : <time-display :time="item.createdAt"></time-display>
                    </v-card-actions>
                    <v-card-actions>
                        <v-spacer/>
                        수정일 : <time-display :time="item.updatedAt"></time-display>
                    </v-card-actions>
                    <v-card-actions>
                        <v-spacer />
                        작성자 : <user-name :user="item.user.displayName"></user-name>
                    </v-card-actions>
                    <v-card-actions>
                        <v-spacer/>
                        <v-sheet class="mr-2">
                            <v-icon left>mdi-eye</v-icon>
                            <span>{{ item.readCount }}</span>
                        </v-sheet>
                        <v-sheet class="mr-2">
                            <v-icon left>mdi-comment</v-icon>
                            <span>{{ item.commentCount }}</span>
                        </v-sheet>
                        <v-sheet class="mr-2">
                            <v-icon left>mdi-thumb-up</v-icon>
                            <span>{{ item.likeCount }}</span>
                        </v-sheet>
                    </v-card-actions>
                </v-card>
            </template>
        </v-card>
    </v-container>
</template>
<script>
import ArticleForm from '@/components/article-form.vue'
import TimeDisplay from '@/components/time-display.vue'
import UserName from '@/components/user-name.vue'

export default {
  components: { ArticleForm, TimeDisplay, UserName },
  props: ['boardTitle'],
  data () {
    return {
      things: ['전체', '일반', '공지', '중요'],
      newArticle: false,
      items: [],
      unsubscribe: null
    }
  },
  created () {
    this.subscribe()
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    async subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      this.unsubscribe = await this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }
        sn.docs.forEach(doc => {
          const temp = doc.data()
          // temp.createdAt = temp.createdAt.toDate().toString()
          // temp.updatedAt = temp.updatedAt.toDate().toString()
          this.items.push(temp)
        })
      })
    },
    toggleForm () {
      this.newArticle = !this.newArticle
    },
    openInfo () {
    }
  }
}
</script>
