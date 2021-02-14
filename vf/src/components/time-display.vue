<template>
    <div class="mr-2 ml-2">
        {{ time.toDate().toLocaleString() }}
    </div>
</template>
<script>
export default {
  props: ['time']
}
</script>
