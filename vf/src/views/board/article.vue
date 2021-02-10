<template>
    <board-article :boardTitle='list' :articleTitle='article'></board-article>
</template>
<script>
import BoardArticle from '@/components/board-article.vue'

export default {
  components: { BoardArticle },
  computed: {
    list () {
      return this.$route.params.list
    },
    article () {
      return this.$route.params.article
    }
  }
}
</script>
