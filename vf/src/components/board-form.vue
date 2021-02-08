<template>
    <v-container fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-card>
            <v-card-title>
            새로운 게시판 생성
                <v-spacer />
                <v-btn icon @click="saveBoard"><v-icon>mdi-content-save</v-icon></v-btn>
                <!-- <v-btn icon :to="`/${board}`"><v-icon>mdi-close</v-icon></v-btn> -->
                <v-btn icon @click="$emit('cancelBoard')"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text>
                <v-row>
                    <v-col cols="8">
                        <v-text-field v-model="newBoard_items.title" label="게시판 제목" outlined clearable required />
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="newPath" label="게시판 경로" outlined clearable required />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-textarea v-model="newBoard_items.description" label="게시판 설명" outlined rows="4" required />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text>
                <v-card outlined>
                    <v-subheader>
                        등록한 카테고리
                    </v-subheader>
                    <v-card-text>
                        <v-chip color="info" small outlined class="mr-2 mb-2" v-for="(category, i) in newBoard_items.categories" :key="i"> {{ category }}
                            <v-icon small right @click="removeCategory(category)">mdi-close</v-icon>
                        </v-chip>
                    </v-card-text>
                    <v-card-actions>
                        <div width="100">
                            <v-text-field v-model="newCategory" label="카테고리" append-icon="mdi-plus" @click:append="addCategory" @keypress.enter="addCategory" outlined hide-details/>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-card-text>
            <v-card-text>
                <v-card outlined>
                    <v-subheader>
                        등록한 태그
                    </v-subheader>
                    <v-card-text>
                        <v-chip color="info" small class="mr-2 mb-2" v-for="(tag, i) in newBoard_items.tags" :key="i"> {{ tag }}
                            <v-icon small right @click="removeTag(tag)">mdi-close</v-icon>
                        </v-chip>
                    </v-card-text>
                    <v-card-actions>
                        <div width="100">
                            <v-text-field v-model="newTag" label="태그" append-icon="mdi-plus" @click:append="addTag" @keypress.enter="addTag" outlined hide-details/>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
export default {
  props: ['newBoard'],
  data () {
    return {
      newBoard_items: {
        categories: [],
        tags: [],
        title: '',
        description: '',
        uid: '',
        user: {
          displayName: this.$store.state.fireUser.displayName,
          photoURL: this.$store.state.fireUser.photoURL,
          email: this.$store.state.fireUser.email
        }
      },
      newCategory: '',
      newTag: '',
      newPath: ''
    }
  },
  created () {
    console.log(this.newBoard_items.uid, this.newBoard_items.user)
  },
  methods: {
    async saveBoard () {
      this.newBoard_items.uid = this.$store.state.fireUser.uid
      if (this.newBoard_items.uid === '') this.$toasted.global.error('로그인이 필요합니다.')
      if (!this.newBoard_items.title || !this.newBoard_items.description || !this.newPath) this.$toasted.global.notice('Please fill all the blanks.')
      const newSave = {
        categories: this.newBoard_items.categories,
        tags: this.newBoard_items.tags,
        title: this.newBoard_items.title,
        description: this.newBoard_items.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        readCount: 0,
        commentCount: 0,
        likeCount: 0,
        uid: this.$store.state.fireUser.uid,
        user: {
          displayName: this.newBoard_items.user.displayName,
          photoURL: this.newBoard_items.user.photoURL,
          email: this.newBoard_items.user.email
        }
      }
      try {
        await this.$firebase.firestore().collection('boards').doc(this.newPath.substr(1)).set(newSave)
      } finally {
        this.$toasted.global.notice('Successfully Uploaded!!')
      }
      this.$router.push('/board/' + this.newPath.substr(1))
    },
    removeCategory (category) {
      console.log('removeCategory')
      const index = this.newBoard_items.categories.findIndex(el => el === category)
      this.newBoard_items.categories.splice(index, 1)
    },
    addCategory () {
      if (!this.newCategory) throw Error('카테고리를 입력해주세요.')
      if (this.newBoard_items.categories.includes(this.newCategory)) throw Error('이미 존재하는 카테고리입니다.')
      console.log(this.newCategory)
      this.newBoard_items.categories.push(this.newCategory)
      this.newCategory = ''
    },
    removeTag (tag) {
      console.log('removeTag')
      const index = this.newBoard_items.tags.findIndex(el => el === tag)
      this.newBoard_items.tags.splice(index, 1)
    },
    addTag () {
      if (!this.newTag) throw Error('태그를 입력해주세요.')
      if (this.newBoard_items.tags.includes(this.newTag)) throw Error('이미 존재하는 태그입니다.')
      console.log(this.newTag)
      this.newBoard_items.tags.push(this.newTag)
      this.newTag = ''
    }
  }
}
</script>
