<template>
  <MarkdownViewer
    :url="url"
  ></MarkdownViewer>
</template>

<script>
// import logger from '@/logger';

import MarkdownViewer from '@/components/MarkdownViewer';

export default {
  components: {
    MarkdownViewer,
  },

  computed: {
    url() {
      return this.$route.params.pathMatch;
    },
  },

  mounted() {
  },
};
</script>

<style>
</style>
