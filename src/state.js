import Vue from 'vue';

const state = new Vue({
  data: () => ({
    errorAlertMessage: null,
    errorAlertVisible: false,
    asyncFgJobCount: 0,
  }),

  methods: {
    showErrorAlert(err) {
      let message;
      if (err instanceof Error) {
        message = `An unexpected error occurred: ${err.message}`;
      } else if (typeof err === 'string') {
        message = err;
      } else {
        message = `An unexpected error occurred: ${err}`;
      }
      this.errorAlertMessage = message;
      this.errorAlertVisible = true;
    },

    runAsyncInFg(fn) {
      async function runner() {
        state.asyncFgJobCount += 1;

        try {
          return await fn();
        } finally {
          state.asyncFgJobCount -= 1;
        }
      }

      return runner().then(null, err => {
        state.showErrorAlert(err);
      });
    },
  },
});

export default state;
