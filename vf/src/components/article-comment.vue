<template>
    <div>
        <v-textarea rows="2" placeholder="댓글 작성" auto-grow outlined append-icon="mdi-comment-plus" @click:append="addComment" clearable hide-details></v-textarea>
        <v-list>
            <v-list-item>
                <v-chip color="info" class="mr-4">
                    <v-avatar>
                        <v-icon>mdi-account</v-icon>
                    </v-avatar>사람이름
                </v-chip>
                hihi
                <v-spacer />
                <v-btn icon class="mr-2"><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn icon class="mr-2"><v-icon>mdi-delete</v-icon></v-btn>
                <v-btn icon class="mr-2"><v-icon>mdi-thumb-up</v-icon></v-btn>
                <span>1</span>
            </v-list-item>
        </v-list>
    </div>
</template>
<script>
export default {
  methods: {
    addComment () {
      console.log('comment')
    }
  }
}
</script>
