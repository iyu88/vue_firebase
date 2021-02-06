<template>
    <v-footer app color="primary" dark absolute :footer="footer">
        <v-spacer/>
        <div>{{ new Date().getFullYear() + ' ' + footer }}</div>
        <v-btn icon @click="openDialog"><v-icon>mdi-grease-pencil</v-icon></v-btn>
        <v-dialog v-model="dialog" max-width="400">
            <v-card>
                <v-card-title>
                    Footer 수정
                    <v-spacer/>
                    <v-btn icon @click="save"><v-icon>mdi-content-save</v-icon></v-btn>
                    <v-btn icon @click="dialog = !dialog"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="text" outlined label="New Footer" hide-details></v-text-field>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-footer>
</template>

<script>
export default {
  props: ['footer'],
  data () {
    return {
      dialog: false,
      text: ''
    }
  },
  methods: {
    openDialog () {
      this.dialog = true
    },
    async save () {
      try {
        await this.$firebase.database().ref().child('site').update({ footer: this.text })
      } finally {
        this.dialog = false
      }
    }
  }
}
</script>
