<template>
    <v-container fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <!--
        <v-sheet v-if="loading" class="pa-3">
          <v-skeleton-loader type="table-heading, card" max-height="400"></v-skeleton-loader>
        </v-sheet>
        <v-alert v-else-if="Object.keys(chatInfo).length === 0 && !loading" color="error">채팅방에 입장할 수 없습니다.</v-alert>
        <v-card v-else-if="Object.keys(chatInfo).length !== 0 && !loading">
        -->
        <v-card v-if="chatInfo">
            <v-card-title>
                {{ chatNumberId }} / {{ chatInfo.chatTitle }}
                <v-spacer />
                <span class="body-1 mr-2">
                  <time-display :time="chatInfo.createdAt"></time-display>
                </span>
                <v-divider vertical class="mr-2" />
                <v-btn icon @click="userList = !userList">
                  <v-icon>mdi-checkbox-marked-outline</v-icon>
                </v-btn>
                <v-dialog v-model="userList" width="400px">
                  <v-card-title>
                    유저 리스트
                    <v-spacer />
                    <v-btn icon @click="userList = !userList">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <template v-for="(user, i) in chatInfo.userList">
                        <v-list-item :key="i">
                          {{ i+1 }} .
                          <v-chip class="ml-2" color="info">{{ user.displayName }}</v-chip>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-card-text>
                </v-dialog>
                <v-btn icon @click="goBack">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
              <v-card outlined>
                <v-list height="500px">
                  <template v-for="(log, i) in chatLogs">
                    <v-list-item v-if="log.user.uid === fireUser" :key="i">
                      <v-spacer />
                      <v-chip class="mr-2">
                      {{ log.content }}
                      </v-chip>
                      :
                      <user-name :user="log.user" class="ml-2"></user-name>
                    </v-list-item>
                    <v-list-item v-else :key="i">
                      <user-name :user="log.user" class="mr-2"></user-name>
                      :
                      <v-chip class="ml-2">
                      {{ log.content }}
                      </v-chip>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card>
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="myMessage" hide-details outlined clearable append-icon="mdi-plus" @click:append="sendMessage" @keypress.enter="sendMessage" />
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
import UserName from '@/components/user-name.vue'
import TimeDisplay from '@/components/time-display.vue'

export default {
  components: { UserName, TimeDisplay },
  data () {
    return {
      chatNumberId: null,
      chatInfo: null,
      chatLogs: [],
      myMessage: '',
      userList: false,
      loading: false,
      unsubscribe: null
    }
  },
  created () {
    this.chatNumberId = this.$route.params.roomNumber
    console.log(this.chatNumberId)
    this.getChatInfo()
    this.subscribe()
  },
  destroy () {
    if (this.unsubscribe) this.unsubscribe()
  },
  computed: {
    fireUser () {
      return this.$store.state.fireUser.uid
    }
  },
  methods: {
    async getChatInfo () {
      // if (!this.$store.state.fireUser) throw Error('로그인이 필요합니다.')
      try {
        const uInfo = {
          displayName: this.$store.state.fireUser.displayName,
          photoURL: this.$store.state.fireUser.photoURL,
          email: this.$store.state.fireUser.email,
          uid: this.$store.state.fireUser.uid
        }
        console.log(uInfo)
        await this.$firebase.firestore().collection('chats').doc(this.chatNumberId).update({
          userList: this.$firebase.firestore.FieldValue.arrayUnion(uInfo)
        })
        const getInfo = await this.$firebase.firestore().collection('chats').doc(this.chatNumberId).get()
        this.chatInfo = getInfo.data()
      } finally {
        this.$toasted.global.notice('Enter the chat room')
        this.loading = true
      }
    },
    async subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      this.chatLogs = []
      this.unsubscribe = await this.$firebase.firestore().collection('chats').doc(this.chatNumberId).collection('logs').onSnapshot(sn => {
        if (sn.empty) {
          this.chatLogs = []
          return
        }
        sn.docs.forEach(doc => {
          const findLog = this.chatLogs.find(log => doc.uid === log.uid)
          const temp = doc.data()
          if (!findLog) {
            this.chatLogs.push(temp)
          } else {
            findLog.content = temp.content
            findLog.createdAt = temp.createdAt
            // findLog.uid = temp.uid
            // findLog.user = temp.user
          }
        })
      })
    },
    async sendMessage () {
      if (!this.$store.state.fireUser) throw Error('로그인이 필요한 서비스입니다.')
      console.log(this.myMessage)
      const newMessage = {
        content: this.myMessage,
        createdAt: new Date(),
        uid: new Date().getTime().toString(),
        user: {
          displayName: this.$store.state.fireUser.displayName,
          photoURL: this.$store.state.fireUser.photoURL,
          email: this.$store.state.fireUser.email,
          uid: this.$store.state.fireUser.uid
        }
      }
      try {
        this.chatLogs = []
        await this.$firebase.firestore().collection('chats').doc(this.chatNumberId).collection('logs').doc(newMessage.uid).set(newMessage)
      } finally {
        this.$toasted.global.notice('Send Message')
        this.myMessage = ''
      }
    },
    goBack () {
      this.$router.push({ path: '/chatRoom' })
    }
  }
}
</script>
