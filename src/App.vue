<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
    >
      <v-app-bar-title>resol-vbus</v-app-bar-title>

      <router-link
        to="/"
        class="dw-router-link"
      >
        About
      </router-link>

      <router-link
        to="/md/docs/tutorials"
        class="dw-router-link"
      >
        Tutorials
      </router-link>

      <router-link
        to="/md/docs/docs"
        class="dw-router-link"
      >
        Documentation
      </router-link>

      <router-link
        to="/md/docs/examples"
        class="dw-router-link"
      >
        Examples
      </router-link>

      <router-link
        to="/md/docs/support"
        class="dw-router-link"
      >
        Support
      </router-link>

      <v-spacer></v-spacer>

      {{ version.describe }}
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-overlay :value="state.asyncFgJobCount > 0">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <v-snackbar
      v-model="state.errorAlertVisible"
      color="red"
    >
      {{ state.errorAlertMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="state.errorAlertVisible = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import state from '@/state';
import version from '@/version.json';

export default {
  data: () => ({
    state,
    version,
  }),
};
</script>

<style scoped>
.dw-router-link {
  color: white;
  margin-left: 1em;
  margin-right: 1em;
}
</style>