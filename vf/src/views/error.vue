<template>
    <div class="display-2 font-weight-bold mt-4" align="center" >
        <h2>404 NOT FOUND</h2>
        <v-text>This URL ( {{ url }} ) does NOT exists!!</v-text>
        <br />
        <v-text>Please Enter the right URL or Click <v-btn color="error" x-large :to="`/`">HERE</v-btn> to go back to Home Page</v-text>
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
