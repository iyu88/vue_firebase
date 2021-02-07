<template>
    <v-container fluid>
        <v-card>
            <v-subheader>
                <v-btn color="info">HAHA
                    <v-icon right>mdi-menu-right</v-icon>
                </v-btn>
                <v-card-text>
                    게시물 제목
                </v-card-text>
                <v-spacer />
                <v-btn icon @click="addArticle" class="ml-2">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="removeArticle" class="ml-2">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon class="ml-2">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-subheader>
            <v-divider />
            <v-card-text>
                here is the article content
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-sheet class="mr-2">
                    <v-icon left>mdi-eye</v-icon>
                    <span>1</span>
                </v-sheet>
                <v-sheet class="mr-2">
                    <v-icon left>mdi-comment</v-icon>
                    <span>1</span>
                </v-sheet>
                <v-sheet class="mr-2">
                    <v-icon left>mdi-thumb-up</v-icon>
                    <span>1</span>
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

export default {
  components: { ArticleComment },
  data () {
    return {}
  },
  methods: {
    addArticle () {
      console.log('addArticle')
    },
    removeArticle () {
      console.log('removeArticle')
    }
  }
}
</script>
