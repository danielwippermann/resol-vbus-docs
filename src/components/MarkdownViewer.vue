<template>
  <v-container>
    <v-row>
      <v-col
        v-if="tableOfContents"
        cols="3"
      >
        <v-card
          tile
        >
          <v-list dense>
            <div
              v-for="(category, i) in tableOfContents"
              :key="`category-${i}`"
            >
              <v-subheader>
                {{ category.title }}
              </v-subheader>

              <v-list-item
                v-for="(item, j) in category.items"
                :key="`item-${i}-${j}`"
                :to="item.to"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list>
        </v-card>
      </v-col>
      <v-col
        :cols="bodyCols"
      >
        <div class="markdown-body">
          <h1 v-if="tableOfContents && title" v-text="title"></h1>
          <div v-html="htmlContent"></div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import 'github-markdown-css/github-markdown.css';

import marked from 'marked';

// import logger from '@/logger';
import state from '@/state';
import { assertValidUrlPart } from '@/utils';

const tocByLayout = {
  tutorials: [{
    title: 'Getting started',
    items: [{
      to: '/md/docs/installation-tutorial',
      title: 'Install the resol-vbus module',
    }, {
      to: '/md/docs/connectin-tutorial',
      title: 'Creating and establishing a connection',
    }, {
      to: '/md/docs/live-data-tutorial',
      title: 'Receive And Display Live Data',
    }, {
      to: '/md/docs/customizer-tutorial',
      title: 'Load and Save Configuration',
    }, {
      to: '/md/docs/vbus-recording-converter-tutorial',
      title: 'Process recorded VBus data',
    }]
  }],

  docs: [{
    title: 'General',
    items: [{
      to: '/md/docs/docs',
      title: 'Overview',
    // }, {
    //   to: '/md/docs/getting-started',
    //   title: 'Getting Started',
    }],
  // }, {
  //   title: 'Models',
  //   items: [{
  //     to: '/md/docs/header-class',
  //     title: 'vbus.Header',
  //   }, {
  //     to: '/md/docs/packet-class',
  //     title: 'vbus.Packet',
  //   }, {
  //     to: '/md/docs/datagram-class',
  //     title: 'vbus.Datagram',
  //   }, {
  //     to: '/md/docs/telegram-class',
  //     title: 'vbus.Telegram',
  //   }, {
  //     to: '/md/docs/header-set-class',
  //     title: 'vbus.HeaderSet',
  //   }, {
  //     to: '/md/docs/header-set-consolidator-class',
  //     title: 'vbus.HeaderSetConsolidator',
  //   }],
  // }, {
  //   title: 'Connections',
  //   items: [{
  //     to: '/md/docs/connection-class',
  //     title: 'vbus.Connection',
  //   }, {
  //     to: '/md/docs/serial-connection-class',
  //     title: 'vbus.SerialConnection',
  //   }, {
  //     to: '/md/docs/tcp-connection-class',
  //     title: 'vbus.TcpConnection',
  //   }],
  // }, {
  //   title: 'Converters',
  //   items: [{
  //     to: '/md/docs/converter-class',
  //     title: 'vbus.Converter',
  //   }, {
  //     to: '/md/docs/vbus-recording-converter-class',
  //     title: 'vbus.VBusRecordingConverter',
  //   }, {
  //     to: '/md/docs/dlx-json-converter-class',
  //     title: 'vbus.DLxJsonConverter',
  //   }, {
  //     to: '/md/docs/text-converter-class',
  //     title: 'vbus.TextConverter',
  //   }],
  // }, {
  //   title: 'Recorders',
  //   items: [{
  //     to: '/md/docs/recorder-class',
  //     title: 'vbus.Recorder',
  //   }, {
  //     to: '/md/docs/filesystem-recorder-class',
  //     title: 'vbus.FileSystemRecorder',
  //   }, {
  //     to: '/md/docs/dlx-recorder-class',
  //     title: 'vbus.DLxRecorder',
  //   }],
  // }, {
  //   title: 'Customizers',
  //   items: [{
  //     to: '/md/docs/customizer-class',
  //     title: 'vbus.Customizer',
  //   }, {
  //     to: '/md/docs/connection-customizer-class',
  //     title: 'vbus.ConnectionCustomizer',
  //   }],
  // }, {
  //   title: 'DataSources',
  //   items: [{
  //     to: '/md/docs/data-source-class',
  //     title: 'vbus.DataSource',
  //   }, {
  //     to: '/md/docs/serial-data-source-class',
  //     title: 'vbus.SerialDataSource',
  //   }, {
  //     to: '/md/docs/tcp-data-source-class',
  //     title: 'vbus.TcpDataSource',
  //   }],
  // }, {
  //   title: 'DataSourceProviders',
  //   items: [{
  //     to: '/md/docs/data-source-provider-class',
  //     title: 'vbus.DataSourceProvider',
  //   }, {
  //     to: '/md/docs/serial-data-source-provider-class',
  //     title: 'vbus.SerialDataSourceProvider',
  //   }, {
  //     to: '/md/docs/tcp-data-source-provider-class',
  //     title: 'vbus.TcpDataSourceProvider',
  //   }],
  }, {
    title: 'Technical Specifications',
    items: [{
      to: '/md/docs/vbus-specification',
      title: 'RESOL VBus Specification',
    }, {
      to: '/md/docs/vbus-packets',
      title: 'RESOL VBus Packet List',
    }, {
      to: '/md/docs/vbus-recording-file-format',
      title: 'VBus Recording File Format',
    }, {
      to: '/md/docs/vbus-specification-file-format-v1',
      title: 'VBus Spec. File Format v1',
    }, {
      to: '/md/docs/vbus-over-tcp',
      title: 'VBus Over TCP',
    }, {
      to: '/md/docs/dlx-data-download-api',
      title: 'DLx Data Download API',
    }],
  }],
};

export default {
  props: {
    url: String,
  },

  data: () => ({
    layout: '',
    tableOfContents: null,
    title: '',
    htmlContent: '',
  }),

  computed: {
    bodyCols() {
      return this.tableOfContents ? 9 : 12;
    },
  },

  watch: {
    url() {
      // logger.debug('url prop changed');
      this.loadMarkdown();
    },
  },

  mounted() {
    this.loadMarkdown();
  },

  methods: {
    loadMarkdown() {
      state.runAsyncInFg(async () => {
        // logger.debug(this.url);

        assertValidUrlPart(this.url);

        const httpResponse = await fetch(`resol-vbus/${this.url}.md`);

        if (!httpResponse.ok) {
          throw new Error(`fetch failed`);
        }

        const contentType = httpResponse.headers.get('Content-Type');
        if (!contentType) {
          throw new Error(`no content type returned`);
        } else if (!/^text\/markdown(;.*)?$/.test(contentType)) {
          throw new Error(`unknown content type: ${contentType}`);
        }

        const rawMdContent = await httpResponse.text();

        const md = /^(?:---\nlayout: (.*)\n(?:title: (.*)\n)?(?:resol_vbus: (.*)\n)?---\n)?([^]*)$/.exec(rawMdContent);

        const layout = md [1];
        const title = md [2];
        const mdContent = md [4];

        const baseUrl = new URL(this.url, 'file:///md/');
        // logger.debug(baseUrl);

        const htmlContent = marked(mdContent, {
          tables: true,
          walkTokens(token) {
            if (token.type === 'link') {
              const md = /^([\w/-]+)\.html$/.exec(token.href);
              // logger.debug({ href: token.href, md });
              if (md) {
                const url = new URL(md [1], baseUrl);
                token.href = `#${url.pathname}`;
              }
            }
          },
        });

        // logger.debug(htmlContent);

        this.layout = layout;
        this.tableOfContents = tocByLayout [layout];
        this.title = title;
        this.htmlContent = htmlContent;

        await new Promise(resolve => process.nextTick(resolve));

        window.scrollTo(0, 0);
      });
    },
  },
};
</script>

<style scoped>
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  /* padding: 45px; */
}

@media (max-width: 767px) {
  .markdown-body {
    /* padding: 15px; */
  }
}
</style>
