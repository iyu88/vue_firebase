<template>
    <div class="display-2 font-weight-bold mt-4" align="center" >
        <h2>404 NOT FOUND</h2>
        <span>This URL ( {{ url }} ) does NOT exists!!</span>
        <br />
        <span>Please Enter the right URL or Click <v-btn color="error" x-large :to="`/`">HERE</v-btn> to go back to Home Page</span>
    </div>
</template>
<script>
export default {
  data () {
    return {
      url: this.$route.path
    }
  }
}
</script>
