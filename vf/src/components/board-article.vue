<template>
    <v-container fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-card>
            <v-subheader>
                <v-btn color="info">{{ item.category }}
                    <v-icon right>mdi-menu-right</v-icon>
                </v-btn>
                <v-card-title>
                    {{ item.title }}
                </v-card-title>
                <v-spacer />
                <v-btn icon class="ml-2">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon class="ml-2">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon class="ml-2">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-subheader>
            <v-divider />
            <v-card-text>
                {{ item.content }}
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                생성일 : <time-display :time="item.createdAt"></time-display>
            </v-card-actions>
            <v-card-actions>
                <v-spacer />
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
            <v-divider/>
            <v-card-actions>
                <v-row no-gutters>
                    <v-col cols="4">
                        <v-btn text block>
                            <v-icon>mdi-menu-left</v-icon>
                            이전
                        </v-btn>
                    </v-col>
                    <v-col cols="4" class="d-flex">
                        <v-divider vertical></v-divider>
                        <v-btn text block>
                            <v-icon>mdi-menu</v-icon>
                            목록
                        </v-btn>
                        <v-divider vertical></v-divider>
                    </v-col>
                    <v-col cols="4">
                        <v-btn text block>
                            다음
                            <v-icon>mdi-menu-right</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
            <v-divider />
            <v-card-text>
                <article-comment></article-comment>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import ArticleComment from '../components/article-comment.vue'
import TimeDisplay from '@/components/time-display.vue'
import UserName from '@/components/user-name.vue'

export default {
  components: { ArticleComment, TimeDisplay, UserName },
  props: ['boardTitle', 'articleTitle'],
  data () {
    return {
      items: [],
      item: [],
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
      this.unsubscribe = await this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').doc(this.articleTitle).onSnapshot(doc => {
        if (!doc.exists) {
          this.items = []
          return
        }
        const temp = doc.data()
        // temp.createdAt = temp.createdAt.toDate()
        // temp.updatedAt = temp.updatedAt.toDate()
        this.item = temp
      }, console.err)
    }
  }
}
</script>
