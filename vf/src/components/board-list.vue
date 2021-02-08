<template>
    <v-container fluid>
        <v-card>
            <v-card-title>
                <span width="100" class="mt-4 mr-4">
                    <v-select solo dense :items="items" placeholder="전체" outlined small color="info">}</v-select>
                </span>
                게시판 이름
                <v-spacer/>
                    <v-btn icon @click="openInfo">
                        <v-icon>mdi-alert-circle-outline</v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon>mdi-text-box-outline</v-icon>
                    </v-btn>
                    <v-btn icon @click="newArticle">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
            </v-card-title>
            <v-divider/>
            <template>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>
                            <v-btn color="info" small class="mr-2"> {{ title }}
                                <v-icon right>mdi-menu-right</v-icon>
                            </v-btn>생성 날짜
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            subTitle
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                            subTitle
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-sheet>
                            <v-icon>mdi-eye</v-icon>
                            <span>1</span>
                        </v-sheet>
                        <v-sheet>
                            <v-icon>mdi-comment</v-icon>
                            <span>1</span>
                        </v-sheet>
                        <v-sheet>
                            <v-icon>mdi-thumb-up</v-icon>
                            <span>1</span>
                        </v-sheet>
                    </v-list-item-action>
                </v-list-item>
            </template>
            <template @click="console.log('hi')">
                <v-card>
                    <v-subheader>
                        <v-btn color="info" small class="mr-2">Hi
                            <v-icon right>mdi-menu-right</v-icon>
                        </v-btn>생성 날짜
                    </v-subheader>
                    <v-card-title>
                        게시물 제목
                    </v-card-title>
                    <v-card-text>
                        Hi
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <time-display></time-display>
                    </v-card-actions>
                    <v-card-actions>
                        <v-spacer />
                        <user-name></user-name>
                    </v-card-actions>
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
                </v-card>
            </template>
        </v-card>
    </v-container>
</template>
<script>
import TimeDisplay from '@/components/time-display.vue'
import UserName from '@/components/user-name.vue'

export default {
  components: { TimeDisplay, UserName },
  data () {
    return {
      items: ['전체', '일반', '공지', '중요'],
      title: 'hi'
    }
  },
  methods: {
    openInfo () {
    },
    newArticle () {
    }
  }
}
</script>
