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
          <v-card-text>
            <router-link
              to="/jsdoc"
            >
              back to overview
            </router-link>

            <v-divider></v-divider>

            <v-list dense>
              <div
                v-for="(category, i) in tableOfContents"
                :key="`toc-category-${i}`"
              >
                <v-subheader>
                  {{ category.kind }}
                </v-subheader>

                <v-list-item
                  v-for="(member, j) in category.members"
                  :key="`toc-member-${i}-${j}`"
                  :to="member.to"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ member.longname }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        :cols="bodyCols"
      >
        <div v-if="bodyElements && (bodyElements.length > 0)">
          <div class="text-h4 mb-4">
            {{ bodyElements [0].longname }} <v-chip>{{ bodyElements [0].kind }}</v-chip>
            <v-divider></v-divider>
          </div>

          <div v-for="(bodyElement, k) in bodyElements" :key="`body-${k}`" style="overflow-wrap: break-word;">
            <hr v-if="k > 0" class="mt-8">

            <div v-if="bodyClassDescHtml" v-html="bodyClassDescHtml"></div>
            <div v-if="bodyElement.augments" class="text-h6 mt-8">
              Extends: {{ bodyElement.augments.join(', ') }}
            </div>
            <div v-if="bodyElement.kind === 'class'" class="text-h5 mt-8 mb-4">
              new {{ bodyElement.longname }}(...)
              <v-divider></v-divider>
            </div>
            <div v-if="bodyElement.kind === 'function'" class="text-h5 mt-8 mb-4">
              {{ bodyElement.virtual && !bodyElement.overrides ? '&lt;abstract&gt;' : '' }}
              {{ bodyElement.async ? 'async' : '' }}
              {{ bodyElement.name }}(...)
              <v-divider></v-divider>
            </div>
            <div v-if="bodyDescriptionHtml" v-html="bodyDescriptionHtml"></div>
            <div v-if="bodyElement.type">
              <div class="text-h6 mt-8 mb-4">
                Type
                <v-divider></v-divider>
              </div>
              <ul>
                <li
                  v-for="(name, i) in bodyElement.type.names"
                  :key="`typeName-${i}-${k}`"
                >
                  {{ name }}
                </li>
              </ul>
            </div>
            <div v-if="bodyElement.defaultvalue">
              <div class="text-h6 mt-8 mb-4">
                Default Value
                <v-divider></v-divider>
              </div>
              <ul>
                <li>
                  {{ bodyElement.defaultvalue }}
                </li>
              </ul>
            </div>
            <div v-if="bodyElement.params">
              <div class="text-h6 mt-8 mb-4">
                Parameters
                <v-divider></v-divider>
              </div>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(param, i) in bodyElement.params"
                      :key="`param-${i}-${k}`"
                    >
                      <td><code>{{ param.name }}</code></td>
                      <td><code>{{ param.type.names.join(' ') }}</code></td>
                      <td>{{ param.description }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
            <div v-if="bodyElement.returns">
              <div class="text-h6 mt-8 mb-4">
                Returns
                <v-divider></v-divider>
              </div>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(ret, i) in bodyElement.returns"
                      :key="`return-${i}-${k}`"
                    >
                      <td><code>{{ ret.type.names.join(' ') }}</code></td>
                      <td>{{ ret.description }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
            <div v-if="bodyElement.properties">
              <div class="text-h6 mt-8 mb-4">
                Properties
                <v-divider></v-divider>
              </div>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(prop, i) in bodyElement.properties"
                      :key="`prop-${i}-${k}`"
                    >
                      <td><code>{{ prop.name }}</code></td>
                      <td><code>{{ prop.type.names.join(' ') }}</code></td>
                      <td>{{ prop.description }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
            <div v-if="bodyElement.see">
              <div class="text-h6 mt-8 mb-4">
                See also
                <v-divider></v-divider>
              </div>
              <ul
                v-for="(type, i) in bodyElement.see"
                :key="`see-${i}-${k}`"
              >
                <li>
                  {{ type }}
                </li>
              </ul>
            </div>
            <div v-if="bodyElement.inherited && bodyElement.inherits">
              <div class="text-h6 mt-8 mb-4">
                Inherits
                <v-divider></v-divider>
              </div>
              <ul>
                <li>
                  {{ bodyElement.inherits }}
                </li>
              </ul>
            </div>
            <div v-if="bodyElement.overrides">
              <div class="text-h6 mt-8 mb-4">
                Overrides
                <v-divider></v-divider>
              </div>
              <ul>
                <li>
                  {{ bodyElement.overrides }}
                </li>
              </ul>
            </div>
            <div v-if="bodyElement.examples">
              <div class="text-h6 mt-8 mb-4">
                Examples
                <v-divider></v-divider>
              </div>
              <v-row
                v-for="(example, i) in bodyElement.examples"
                :key="`example-${i}-${k}`"
              >
                <code><pre>{{ example }}</pre></code>
              </v-row>
            </div>
          </div>
        </div>
        <div
          v-if="references && references.length"
        >
          <v-row>
            <v-col class="text-h5 mt-8 mb-4">
              References
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row
            v-for="(category, i) in references"
            :key="`category-${i}`"
          >
            <v-col cols="12" class="text-h6 mt-8 mb-4">
              {{ category.kind }}
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <v-row
                v-for="(member, j) in category.members"
                :key="`member-${i}-${j}`"
                class="mx-4"
              >
                <v-col class="py-0">
                  <router-link
                    v-if="member.to"
                    :to="member.to"
                  >
                    {{ member.longname }}
                  </router-link>
                  <div
                    v-if="!member.to"
                  >
                    {{ member.longname }}
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div v-if="false && bodyElements">
          <hr class="mt-8">
          <code><pre class="dw-wrap-text">{{ JSON.stringify(bodyElements, null, 2) }}</pre></code>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import marked from 'marked';
import logger from '@/logger';
import state from '@/state';

export default {
  data: () => ({
    jsdoc: null,

    tableOfContents: null,
    toByLongname: null,
    bodyElements: null,
    bodyClassDescHtml: null,
    bodyDescriptionHtml: null,
    references: null,
  }),

  computed: {
    bodyCols() {
      return this.tableOfContents ? 9 : 12;
    },
  },

  watch: {
    '$route'() {
      this.updateView();
    },
  },

  mounted() {
    state.runAsyncInFg(async () => {
      const httpResponse = await fetch('doc.json');

      if (!httpResponse.ok) {
        throw new Error(`Unable to fetch jsdoc data`);
      }

      const contentType = httpResponse.headers.get('Content-Type');
      if (!contentType) {
        throw new Error('Missing content type');
      } else if (!/^application\/json(;.*)?$/.test(contentType)) {
        throw new Error(`Unexpected content type ${contentType}`);
      }

      const jsdoc = await httpResponse.json();

      // logger.debug(jsdoc);

      // const info = jsdoc.docs.reduce((memo, doc) => {
      //   const key = doc.memberof;
      //   if (!memo.has(key)) {
      //     memo.set(key, {
      //       count: 0,
      //     });
      //   }
      //   memo.get(key).count += 1;
      //   return memo;
      // }, new Map());

      // logger.debug(info);

      this.jsdoc = jsdoc;

      jsdoc.docs.reduce((memo, doc) => {
        const key = doc.longname;
        const value = doc.kind;
        if (!memo.has(key)) {
          memo.set(key, value);
        } else if (memo.get(key) === value) {
          // nop
        } else {
          throw new Error(`Multiple kinds for same longname`);
        }
        return memo;
      }, new Map());

      // this.toByLongname = jsdoc.docs.reduce((memo, doc) => {
      //   const key = doc.longname;
      //   if (memo.has(key)) {
      //     throw new Error(`Non-unique longname found: ${key}: ${memo.get(key)} vs ${doc.kind}`);
      //   }
      //   memo.set(key, `/jsdoc/${doc.kind}/${doc.longname}`);
      //   return memo;
      // }, new Map());

      const unhandledKeys = [];
      for (const doc of jsdoc.docs) {
        for (const key of Object.keys(doc)) {
          switch (key) {
          case 'comment':
          case 'meta':
          case 'description':
          case 'params':
          case 'returns':
          case 'name':
          case 'longname':
          case 'kind':
          case 'memberof':
          case 'scope':
          case '___id':
          case '___s':
          case 'type':
          case 'properties':
          case 'augments':
          case 'classdesc':
          case 'examples':
          case 'defaultvalue':
          case 'see':
          case 'files':
          case 'virtual':
          case 'async':
          case 'alias':
            break;
          default:
            if (!unhandledKeys.includes(key)) {
              unhandledKeys.push(key);
              logger.debug(`Unhandled key "${key}" in`, doc.longname);
            }
            break;
          }
        }
      }

      this.updateView();
    });
  },

  methods: {
    updateView() {
      const { pathMatch: longname } = this.$route.params;
      // logger.debug({ longname });

      let bodyElements, allReferences;
      if (!longname) {
        allReferences = this.jsdoc.docs.reduce((memo, doc) => {
          if (doc.kind === 'package') {
            // nop
          } else if (doc.memberof) {
            // nop
          } else {
            memo.push({
              ...doc,
              to: `/jsdoc/${encodeURIComponent(doc.longname)}`,
            });
          }
          return memo;
        }, []);
      } else {
        bodyElements = this.jsdoc.docs.filter(doc => (doc.longname === longname));

        allReferences = this.jsdoc.docs.reduce((memo, doc) => {
          if (doc.memberof !== longname) {
            // nop
          } else {
            memo.push({
              ...doc,
              to: `/jsdoc/${encodeURIComponent(doc.longname)}`,
            });
          }
          return memo;
        }, []);

        if (allReferences.length === 0) {
          const parentLongname = longname.replace(/#[^#]+$/, '');

          allReferences = this.jsdoc.docs.reduce((memo, doc) => {
            if (doc.memberof !== parentLongname) {
              // nop
            } else {
              memo.push({
                ...doc,
                to: `/jsdoc/${encodeURIComponent(doc.longname)}`,
              });
            }
            return memo;
          }, []);
        }
      }

      const references = allReferences.reduce((memo, ref) => {
        let category = memo.find(category => category.kind === ref.kind);
        if (!category) {
          category = {
            kind: ref.kind,
            members: [],
          };
          memo.push(category);
        }
        category.members.push(ref);
        return memo;
      }, []);

      references.sort((l, r) => {
        if (l.kind < r.kind) {
          return -1;
        } else if (l.kind > r.kind) {
          return 1;
        } else {
          return 0;
        }
      });

      for (const ref of references) {
        ref.members.sort((l, r) => {
          if (l.longname < r.longname) {
            return -1;
          } else if (l.longname > r.longname) {
            return 1;
          } else {
            return 0;
          }
        });
      }

      const firstBodyElement = bodyElements && bodyElements [0];
      this.tableOfContents = (firstBodyElement && (references.length > 0)) ? references : null;
      this.bodyElements = bodyElements;
      this.bodyClassDescHtml = firstBodyElement && firstBodyElement.classdesc && marked(firstBodyElement.classdesc);
      this.bodyDescriptionHtml = firstBodyElement && firstBodyElement.description && marked(firstBodyElement.description);
      this.references = firstBodyElement ? null : references;

      window.scrollTo(0, 0);
    },
  },
};
</script>

<style>
.dw-wrap-text {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>