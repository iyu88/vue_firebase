<template>
    <board-list :boardTitle='list'></board-list>
</template>
<script>
import BoardList from '@/components/board-list.vue'

export default {
  components: { BoardList },
  computed: {
    list () {
      return this.$route.params.list
    }
  }
}
</script>
