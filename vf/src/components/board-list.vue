<template>
    <article-form v-if="newArticle" :boardTitle='boardTitle' v-on:cancelArticle="toggleForm" ></article-form>
    <v-container v-else fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-card>
            <v-card-title>
                <span class="mt-4 mr-4">
                    <v-select solo dense :items="DataOfBoard.categories" placeholder="카테고리 필터" outlined small color="info">}</v-select>
                </span>
                {{ DataOfBoard.title }}
                <v-spacer/>
                    <v-btn icon @click="openInfo">
                        <v-icon>mdi-alert-circle-outline</v-icon>
                    </v-btn>
                    <v-btn icon @click="$store.commit('toggleViewMode')">
                        <v-icon>mdi-text-box-outline</v-icon>
                    </v-btn>
                    <v-btn icon @click="toggleForm">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn icon :to="`/board`">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
            </v-card-title>
            <v-divider/>
            <v-skeleton-loader v-if="loading" type="card, list-item-three-line" class="pa-6" />
            <v-alert v-else-if="!loading && items.length === 0" type="warning" border="top" icon="mdi-alert-decagram" prominent class="ma-2">읽어올 게시물이 존재하지 않습니다.</v-alert>
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
                            <user-name :user="item.user"></user-name>
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
                        작성자 : <user-name :user="item.user"></user-name>
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
                <v-divider />
                </v-card>
            </template>
        </v-card>
        <v-dialog v-model="boardInfo" width="400px">
            <v-card>
                <v-card-title>
                    게시판 정보
                    <v-spacer />
                    <v-card-actions>
                        <v-btn icon>
                            <v-icon>mdi-grease-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="openInfo">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card-title>
                <v-card-text>
                    <v-list-item>
                    게시판 이름 : {{ DataOfBoard.title }}
                </v-list-item>
                <v-divider />
                <v-list-item>
                    생성자 : <user-name :user="DataOfBoard.user"></user-name>
                </v-list-item>
                <v-divider />
                <v-list-item>
                    생성일 : <time-display :time="DataOfBoard.createdAt"></time-display>
                </v-list-item>
                <v-divider />
                <v-list-item>
                    수정일 : <time-display :time="DataOfBoard.updatedAt"></time-display>
                </v-list-item>
                <v-divider />
                <v-list-item>
                    게시판 소개 : {{ DataOfBoard.description}}
                </v-list-item>
                <v-divider />
                <v-list-item>
                    등록 카테고리 :
                    <v-chip v-for="(category,i) in DataOfBoard.categories" :key="i" small outlined color="info" class="mr-2 ml-2">
                        {{ category }}
                    </v-chip>
                </v-list-item>
                <v-divider />
                <v-list-item>
                    등록 태그 :
                    <v-chip v-for="(tag,i) in DataOfBoard.tags" :key="i" small color="info" class="mr-2 ml-2">
                        {{ tag }}
                    </v-chip>
                </v-list-item>
                </v-card-text>
            </v-card>
        </v-dialog>
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
      DataOfBoard: [],
      newArticle: false,
      boardInfo: false,
      items: [],
      ref: null,
      unsubscribe: null,
      loading: true
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
      this.ref = this.$firebase.firestore().collection('boards').doc(this.boardTitle)
      const selectItem = await this.ref.get()
      const boardData = selectItem.data()
      this.DataOfBoard = boardData

      try {
        this.unsubscribe = await this.ref.collection('articles').onSnapshot(sn => {
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
      } finally {
        this.$toasted.global.notice('Data Loaded')
        this.loading = false
      }
    },
    toggleForm () {
      if (!this.$store.state.fireUser) throw Error('Please Login first.')
      this.newArticle = !this.newArticle
    },
    openInfo () {
      this.boardInfo = !this.boardInfo
    }
  }
}
</script>
