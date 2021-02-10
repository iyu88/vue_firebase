<template>
    <div class="mr-2 ml-2" italic>
        {{ time.toDate().toLocaleString() }}
    </div>
</template>
<script>
export default {
  props: ['time']
}
</script>
