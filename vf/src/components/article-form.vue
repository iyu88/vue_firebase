<template>
    <v-container fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-card v-if="!this.articleTitle">
            <v-card-title>
            새로운 게시물 생성
                <v-spacer />
                <v-btn icon @click="saveArticle"><v-icon>mdi-content-save</v-icon></v-btn>
                <!-- <v-btn icon :to="`/${board}`"><v-icon>mdi-close</v-icon></v-btn> -->
                <v-btn icon @click="$emit('cancelArticle')"><v-icon>mdi-close</v-icon></v-btn>
                <v-btn icon @click="check"><v-icon>mdi-check</v-icon></v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                        <v-select v-model="newArticle_items.category" :items="this.boardCategories" outlined label="카테고리를 선택하세요." solo></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="newArticle_items.tags" :items="this.boardTags" outlined label="태그를 선택하세요." multiple solo chips></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="newArticle_items.title" label="게시물 제목" outlined clearable required/>
                    </v-col>
                    <v-col cols="12">
                        <editor initialValue='' ref="editor" initialEditType="wysiwyg"></editor>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card v-else>
            <v-card-title>
            게시물 편집하기
                <v-spacer />
                <v-btn icon @click="saveArticle"><v-icon>mdi-content-save</v-icon></v-btn>
                <!-- <v-btn icon :to="`/${board}`"><v-icon>mdi-close</v-icon></v-btn> -->
                <v-btn icon @click="$emit('cancelEditing')"><v-icon>mdi-close</v-icon></v-btn>
                <v-btn icon @click="check"><v-icon>mdi-check</v-icon></v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                        <v-select v-model="newArticle_items.category" :items="this.boardCategories" outlined label="카테고리를 선택하세요." solo></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="newArticle_items.tags" :items="this.boardTags" outlined label="태그를 선택하세요." multiple solo chips></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="newArticle_items.title" label="게시물 제목" outlined clearable required/>
                    </v-col>
                    <v-col cols="12">
                        <editor v-if="content" :initialValue="content" ref="editor" initialEditType="wysiwyg"></editor>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
export default {
  props: ['boardTitle', 'articleTitle'],
  data () {
    return {
      boardCategories: [],
      boardTags: [],
      newArticle_items: {
        category: '',
        tags: [],
        title: '',
        uid: '',
        user: {
          displayName: this.$store.state.fireUser.displayName,
          photoURL: this.$store.state.fireUser.photoURL,
          email: this.$store.state.fireUser.email
        }
      },
      content: null
    }
  },
  created () {
    // console.log(this.newArticle_items.uid, this.newArticle_items.user)
    this.$firebase.firestore().collection('boards').doc(this.boardTitle).onSnapshot(doc => {
      if (doc.exists) {
        const docInfo = doc.data()
        this.boardCategories = docInfo.categories
        this.boardTags = docInfo.tags
      }
    })
    if (this.articleTitle) {
      this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').doc(this.articleTitle).onSnapshot(doc => {
        if (doc.exists) {
          const articleInfo = doc.data()
          this.newArticle_items.category = articleInfo.category
          this.newArticle_items.tags = articleInfo.tags
          this.newArticle_items.title = articleInfo.title
          this.content = articleInfo.content
        }
      })
    }
  },
  methods: {
    check () {
      console.log(this.boardTitle)
      const a = new Date().getTime().toString()
      console.log(a)
    },
    async saveArticle () {
      console.log('save')
      this.newArticle_items.uid = this.$store.state.fireUser.uid
      if (this.newArticle_items.uid === '') throw Error('로그인이 필요합니다.')
      // console.log(this.newArticle_items)
      const md = this.$refs.editor.invoke('getMarkdown')
      if (!this.newArticle_items.category || !this.newArticle_items.tags || !this.newArticle_items.title || !md) throw Error('필수 항목입니다. 반드시 입력해주세요!')
      const newSave = {
        category: this.newArticle_items.category,
        tags: this.newArticle_items.tags,
        title: this.newArticle_items.title,
        content: md,
        uid: this.newArticle_items.uid,
        user: this.newArticle_items.user
      }
      try {
        if (!this.articleTitle) {
          newSave.createdAt = new Date()
          newSave.updatedAt = new Date()
          newSave.pathTo = new Date().getTime().toString()
          newSave.commentCount = 0
          newSave.readCount = 0
          newSave.likeCount = 0
          newSave.likeUid = []
          await this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').doc(newSave.pathTo).set(newSave)
          this.$router.push(this.$route.path + '/' + newSave.pathTo)
        } else {
          newSave.updatedAt = new Date()
          await this.$firebase.firestore().collection('boards').doc(this.boardTitle).collection('articles').doc(this.articleTitle).update(newSave)
          this.$emit('cancelEditing')
        }
      } finally {
        this.$toasted.global.notice('Success to Upload!!')
      }
    }
  }
}
</script>
