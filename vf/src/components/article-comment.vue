<template>
    <div>
        <v-textarea v-model="userComment" rows="2" placeholder="댓글 작성" auto-grow outlined append-icon="mdi-comment-plus" @click:append="addComment" clearable hide-details></v-textarea>
        <v-list>
          <template v-for="(item, i) in items">
            <v-list :key="i">
              <v-list-item>
                <span class="ml-2" >
                  <user-name :user="item.user"></user-name>
                </span>
                <time-display :time="item.updatedAt"></time-display>
                <v-spacer />
                <v-btn icon class="mr-2" @click="toggleComment(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn icon class="mr-2" @click="deleteComment(item)"><v-icon>mdi-delete</v-icon></v-btn>
                <v-btn icon class="mr-2"><v-icon>mdi-thumb-up</v-icon></v-btn>
                <span>{{ item.likeCount }}</span>
              </v-list-item>
              <div class="ml-6 comment">
              {{ item.content }}
              </div>
              <v-textarea v-if="item.edit" v-model="item.content" rows="2" auto-grow outlined append-icon="mdi-comment-plus" @click:append="editComment(item)" clearable hide-details></v-textarea>
              <v-divider class="mt-4" />
            </v-list>
          </template>
          <v-btn v-if="lastDoc" @click="more" v-intersect='onIntersect' text block color="primary">
            더보기
          </v-btn>
        </v-list>
    </div>
</template>
<script>
import { last } from 'lodash'
import TimeDisplay from '@/components/time-display.vue'
import UserName from '@/components/user-name.vue'
const LIMIT = 5

export default {
  props: ['boardTitle', 'articleTitle'],
  components: { TimeDisplay, UserName },
  data () {
    return {
      items: [],
      userComment: '',
      unsubscribe: null,
      ref: null,
      isEditing: false,
      lastDoc: null
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
      this.ref = this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').doc(this.articleTitle).collection('comments')
      this.unsubscribe = await this.ref.orderBy('createdAt', 'desc').limit(LIMIT).onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }
        this.lastDoc = last(sn.docs)
        sn.docs.forEach(doc => {
          const findItem = this.items.find(item => doc.id === item.id)
          const temp = doc.data()
          if (!findItem) {
            temp.edit = false
            this.items.push(temp)
          } else {
            findItem.updatedAt = temp.updatedAt
            findItem.content = temp.content
            findItem.likeCount = temp.likeCount
            findItem.likeUid = temp.likeUid
          }
        })
        this.items.sort((before, after) => {
          const beforeid = Number(before.uid)
          const afterid = Number(after.uid)
          return afterid - beforeid
        })
      }, console.err)
    },
    async addComment () {
      console.log('comment')
      if (!this.$store.state.fireUser) this.$toasted.global.error('로그인이 필요한 서비스입니다.')
      if (!this.userComment) this.$toasted.global.error('댓글 내용을 입력해주세요.')
      const newComment = {
        createdAt: new Date(),
        updatedAt: new Date(),
        content: this.userComment,
        likeCount: 0,
        likeUid: [],
        uid: this.$store.state.fireUser.uid,
        id: new Date().getTime().toString(),
        user: {
          displayName: this.$store.state.fireUser.displayName,
          photoURL: this.$store.state.fireUser.photoURL,
          email: this.$store.state.fireUser.email
        }
      }
      try {
        this.items = []
        // const batch = this.$firebase.firestore().batch()
        // batch.update(this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').doc(this.articleTitle), {commentCount : this.$firebase.firestore.FieldValue.increment(1) })
        // batch.set(this.ref.doc(newComment.uid), newComment)
        // await batch.commit()
        await this.ref.doc(newComment.id).set(newComment)
      } finally {
        this.$toasted.global.notice('Successfully Uploaded')
        this.userComment = ''
      }
    },
    async deleteComment (item) {
      if (!this.$store.state.fireUser) this.$toasted.global.error('로그인이 필요한 서비스입니다.')
      // this.items.splice(item, 1)
      console.log(this.items)
      try {
        // const batch = this.$firebase.firestore().batch()
        // batch.update(this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').doc(this.articleTitle), {commentCount : this.$firebase.firestore.FieldValue.increment(-1) })
        // batch.delete(this.ref.doc(item.uid))
        // await batch.commit()
        await this.ref.doc(item.id).delete()
        const i = this.items.findIndex(el => el.id === item.id)
        this.items.splice(i, 1)
      } finally {
        this.$toasted.global.notice('The comment has been successfully deleted.')
      }
    },
    toggleComment (item) {
      item.edit = !item.edit
    },
    async editComment (item) {
      console.log(item)
      if (!this.$store.state.fireUser) this.$toasted.global.error('로그인이 필요한 서비스입니다.')
      if (!item.content) this.$toasted.global.error('수정할 댓글을 입력해주세요.')
      const newEditComment = {
        createdAt: item.createdAt,
        updatedAt: new Date(),
        content: item.content,
        likeCount: item.likeCount,
        likeUid: item.likeUid,
        uid: item.uid,
        id: new Date().getTime().toString(),
        user: {
          displayName: this.$store.state.fireUser.displayName,
          photoURL: this.$store.state.fireUser.photoURL,
          email: this.$store.state.fireUser.email
        }
      }
      try {
        console.log(newEditComment.id)
        this.items = []
        await this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').doc(this.articleTitle).collection('comments').doc(newEditComment.id).update(newEditComment)
      } finally {
        item.edit = false
        this.$toasted.global.notice('Successfully Editted')
      }
    },
    async more () {
      if (!this.lastDoc) this.$toasted.global.error('No more Data')
      this.$toasted.global.notice('Load More')
      const sn = await this.ref.orderBy('createdAt', 'desc').startAfter(this.lastDoc).limit(LIMIT).get()
      this.lastDoc = last(sn.docs)
      sn.docs.forEach(doc => {
        const exists = this.items.some(item => doc.id === item.id)
        if (!exists) {
          const item = doc.data()
          item.edit = false
          this.items.push(item)
        }
      })
      this.items.sort((before, after) => {
        const beforeid = Number(before.id)
        const afterid = Number(after.id)
        return afterid - beforeid
      })
    },
    onIntersect (entries, observer, isIntersecting) {
      if (isIntersecting) this.more()
    }
  }
}
</script>

<style scoped>
.comment {
  white-space: pre-wrap;
}
</style>
