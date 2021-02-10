<template>
    <v-chip class="ml-2">
        <v-avatar>
            <v-icon>mdi-account</v-icon>
        </v-avatar>
        {{ user }}
    </v-chip>
</template>
<script>
export default {
  props: ['user']
}
</script>
