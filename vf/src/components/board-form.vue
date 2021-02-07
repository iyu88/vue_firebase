<template>
    <v-container fluid :class="$vuetify.breakpoint.xs ? 'pa-0': ''">
        <v-card>
            <v-card-title>
            새로운 게시판 생성
                <v-spacer />
                <v-card-actions>
                    <v-btn icon @click="saveBoard"><v-icon>mdi-content-save</v-icon></v-btn>
                    <!-- <v-btn icon :to="`/${board}`"><v-icon>mdi-close</v-icon></v-btn> -->
                    <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
                </v-card-actions>
            </v-card-title>
            <v-divider />
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="카테고리" outlined clearable />
                    </v-col>
                    <v-col cols="8">
                        <v-text-field label="태그" outlined clearable />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="제목" outlined clearable />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-textarea label="설명" outlined row="3" />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text>
                <v-card outlined>
                    <v-subheader>
                        등록한 카테고리
                    </v-subheader>
                    <v-card-text>
                        <v-chip color="info" small outlined class="mr-2 mb-2">hi
                            <v-icon small right @click="removeCategory">mdi-close</v-icon>
                        </v-chip>
                    </v-card-text>
                    <v-card-actions>
                        <div width="100">
                            <v-text-field v-model="newCategory" label="카테고리" append-icon="mdi-plus" @click:append="addCategory" outlined hide-details/>
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
                        <v-chip color="info" small class="mr-2 mb-2">bye
                            <v-icon small right @click="removeTag">mdi-close</v-icon>
                        </v-chip>
                    </v-card-text>
                    <v-card-actions>
                        <div width="100">
                            <v-text-field v-model="newTag" label="태그" append-icon="mdi-plus" @click:append="addTag" outlined hide-details/>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
export default {
  data () {
    return {
      newCategory: null,
      newTag: null
    }
  },
  methods: {
    async saveBoard () {
    },
    removeCategory () {
      console.log('removeCategory')
    },
    addCategory () {
      console.log('addCategory')
      this.newCategory = ''
    },
    removeTag () {
      console.log('removeTag')
    },
    addTag () {
      console.log('addTag')
      this.newTag = ''
    }
  }
}
</script>
