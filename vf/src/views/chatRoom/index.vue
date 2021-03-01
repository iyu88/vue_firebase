<template>
    <v-container fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-card>
            <v-card-title>
                채팅방 목록
                <v-spacer />
                <v-btn icon @click="createChatRoom">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn icon @click="closeChatList">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-dialog v-model="newChat" max-width="400px">
                    <v-card-title>
                        newChat Form
                        <v-spacer />
                        <v-btn icon @click="saveChatInfo">
                            <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                        <v-btn icon @click="newChat = !newChat">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="chatTitle" small placeholder="채팅방 이름" outlined hide-details></v-text-field>
                    </v-card-text>
                </v-dialog>
            </v-card-title>
            <v-skeleton-loader v-if="loading"></v-skeleton-loader>
            <v-card-text v-else>
                <v-alert v-if="Object.keys(rooms).length === 0" type="warning" border="top" icon="mdi-alert-decagram" prominent class="ma-2">채팅방이 존재하지 않습니다.</v-alert>
                <v-list v-else>
                    <template v-for="(room, i) in rooms">
                        <v-list-item :key="i" :to="`${$route.path}/${room.id}`">
                            {{ room.chatTitle }} / [ 인원수 : {{ room.userList.length }} ]
                            <v-spacer />
                            개설자 :
                            <span class="ml-2">
                                <user-name :user="room.user"></user-name>
                            </span>
                        </v-list-item>
                    </template>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import UserName from '@/components/user-name.vue'

export default {
  components: { UserName },
  data () {
    return {
      rooms: [],
      loading: false,
      newChat: false,
      chatTitle: '',
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
      try {
        this.loading = true
        this.unsubscribe = await this.$firebase.firestore().collection('chats').onSnapshot(sn => {
          if (sn.empty) {
            this.rooms = []
            return
          }
          sn.docs.forEach(doc => {
            const temp = doc.data()
            this.rooms.push(temp)
          })
        })
      } finally {
        this.$toasted.global.notice('ChatRoom has been loaded')
        this.loading = false
      }
    },
    createChatRoom () {
      const chatId = new Date().getTime().toString()
      console.log('newChatRoom : ' + chatId)
      this.newChat = !this.newChat
    },
    closeChatList () {
      console.log('goBack')
    },
    async saveChatInfo () {
      console.log('saveChatInfo')
      if (!this.$store.state.fireUser) throw Error('로그인이 필요합니다.')
      if (this.chatTitle === '') throw Error('채팅방 제목을 입력해주세요.')
      const chatInfo = {
        chatTitle: this.chatTitle,
        createdAt: new Date(),
        uid: this.$store.state.fireUser.uid,
        id: new Date().getTime().toString(),
        user: {
          displayName: this.$store.state.fireUser.displayName,
          photoURL: this.$store.state.fireUser.photoURL,
          email: this.$store.state.fireUser.email,
          uid: this.$store.state.fireUser.uid
        },
        userList: []
      }
      try {
        await this.$firebase.firestore().collection('chats').doc(chatInfo.id).set(chatInfo)
      } finally {
        this.newChat = !this.newChat
        this.chatTitle = ''
        this.$toasted.global.notice('Chat List Updated')
      }
    }
  }
}
</script>
