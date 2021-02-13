<template>
    <v-chip class="ml-2" color="info">
        <v-avatar left>
            <v-img :src="user.photoURL"></v-img>
        </v-avatar>
        {{ user.displayName }}
    </v-chip>
</template>
<script>
export default {
  props: ['user']
}
</script>
