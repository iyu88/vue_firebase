<template>
    <v-container fluid :class="this.$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-card scrollable>
            <v-card-title>
                {{ chatNumberId }} / {{ this.chatInfo.chatTitle }}
            </v-card-title>
            <v-card-actions>
                <v-text-field v-model="myMessage" hide-details outlined clearable append-icon="mdi-plus" @click:append="sendMessage" @keypress.enter="sendMessage" />
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
export default {
  data () {
    return {
      chatNumberId: null,
      myMessage: '',
      chatInfo: [],
      chatLog: [],
      loading: false,
      unsubcribe: null
    }
  },
  created () {
    console.log(this.$route.params.roomNumber)
    this.chatNumberId = this.$route.params.roomNumber
    this.getChatInfo()
    this.subscribe()
  },
  destroy () {
    if (this.unsubcribe) this.unsubcribe()
  },
  methods: {
    async getChatInfo () {
      try {
        this.chatInfo = await this.$firebase.firestore().collection('chats').doc(this.chatNumberId).get()
      } finally {
        console.log(this.chatInfo)
      }
    },
    async subscribe () {
      if (this.unsubcribe) this.unsubcribe()
      this.unsubcribe = await this.$firebase.firestore().collection('chats').doc(this.chatNumberId).onSnapshot(doc => {
        if (!doc.exists) {
          this.chatLog = []
          return
        }
        const temp = doc.data()
        this.chatLog.push(temp)
      })
    },
    async sendMessage () {
      if (!this.$store.state.firestore) throw Error('로그인이 필요한 서비스입니다.')
      console.log(this.myMessage)
      const newMessage = {
        content: this.myMessage,
        createdAt: new Date(),
        uid: new Date().getTime().toString(),
        user: {
          displayName: this.$store.state.fireUser.displayName,
          photoURL: this.$store.state.fireUser.photoURL,
          email: this.$store.state.fireUser.email
        }
      }
      try {
        await this.$firebase.firestore().collection('chats').doc(this.chatNumberId).collection('logs').doc(newMessage.uid).set(newMessage)
      } finally {
        this.$toasted.global.notice('Send Message')
        this.myMessage = ''
      }
    }
  }
}
</script>
