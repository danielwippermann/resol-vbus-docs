<template>
  <v-container>
    <MarkdownViewer
      url="README"
    ></MarkdownViewer>
  </v-container>
</template>

<script>
import MarkdownViewer from '@/components/MarkdownViewer';

export default {
  components: {
    MarkdownViewer,
  },
};
</script>
