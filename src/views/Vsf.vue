<template>
  <v-container>
    <v-row>
      <v-col class="text-h4">
        VBus Specification (Version {{ specFileDatecode }})
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <div v-if="!kind">
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              Devices
              <v-spacer></v-spacer>
              <v-text-field
                v-model="deviceSearch"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="deviceHeaders"
                :items="deviceItems"
                :search="deviceSearch"
                dense
              ></v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              Packets
              <v-spacer></v-spacer>
              <v-text-field
                v-model="packetSearch"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="packetHeaders"
                :items="packetItems"
                :search="packetSearch"
                dense
              >
                <template v-slot:item.actions="{ item }">
                  <router-link
                    :to="item.toFields"
                  >
                    Fields
                  </router-link>
                  &bull;
                  <router-link
                    :to="item.toBytes"
                  >
                    Bytes
                  </router-link>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-if="kind === 'fields'">
      <v-row>
        <v-col cols="12" class="mt-4 elevation-2">
          <v-row>
            <v-col>
              <router-link to="/vsf">back to overview</router-link>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-h5">
              Fields: {{ title }}
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Factor</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(field, i) in fields" :key="`field-${i}`">
                      <td>
                        {{ field.id }}
                      </td>
                      <td>
                        {{ field.name }}
                      </td>
                      <td>
                        {{ field.factor }}
                      </td>
                      <td>
                        {{ field.unit }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <div v-if="kind === 'bytes'">
      <v-row>
        <v-col cols="12" class="mt-4 elevation-2">
          <v-row>
            <v-col>
              <router-link to="/vsf">back to overview</router-link>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-h5">
              Structure: {{ title }}
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Offset</th>
                      <th>Mask</th>
                      <th>Name</th>
                      <th>Factor</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(byte, i) in bytes" :key="`byte-${i}`">
                      <td>
                        {{ byte.offset }}
                      </td>
                      <td>
                        {{ byte.mask }}
                      </td>
                      <td>
                        {{ byte.name }}
                      </td>
                      <td>
                        {{ byte.factor }}
                      </td>
                      <td>
                        {{ byte.unit }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Specification from 'resol-vbus/src/specification';
import SpecificationFile from 'resol-vbus/src/specification-file';

import logger from '@/logger';
import state from '@/state';

function formatHex(value, length, prefix) {
  if (!prefix) {
    prefix = '';
  } else if (prefix === true) {
    prefix = '0x';
  }
  return `${prefix}${value.toString(16).toUpperCase().padStart(length, '0')}`;
}

function getDeviceName(deviceSpec) {
  if (deviceSpec.selfAddress === 0) {
    return `Any device`;
  } else {
    return `${deviceSpec.fullName} (${formatHex(deviceSpec.selfAddress, 4, true)})`;
  }
}

function getPacketName(packetSpec) {
  return `${getDeviceName(packetSpec.destinationDevice)} <= ${getDeviceName(packetSpec.sourceDevice)}, command ${formatHex(packetSpec.command, 4, true)}`;
}

export default {
  props: {
    kind: String,
    id: String,
  },

  data: () => ({
    specFile: null,
    spec: null,
    specFileDatecode: null,
    deviceSearch: '',
    deviceHeaders: [{
      text: 'Address',
      value: 'selfAddress',
    }, {
      text: 'Name',
      value: 'name',
    }],
    deviceItems: [],
    packetSearch: '',
    packetHeaders: [{
      text: 'Destination <= Source',
      value: 'name',
    }, {
      text: 'Actions',
      value: 'actions',
      sortable: false,
    }],
    packetItems: [],
    title: null,
    fields: null,
    bytes: null,
  }),

  watch: {
    '$route'() {
      this.updateView();
    },
  },

  mounted() {
    state.runAsyncInFg(async () => {
      const httpResponse = await fetch('resol-vbus/src/vbus_specification.vsf');

      if (!httpResponse.ok) {
        throw new Error(`Unable to load VSF`);
      }

      const vsfBytes = await httpResponse.arrayBuffer();

      const vsfBuffer = Buffer.from(vsfBytes);

      const specFile = new SpecificationFile(vsfBuffer);
      const spec = new Specification({
        specificationFile: specFile,
      });

      this.specFile = specFile;
      this.spec = spec;
      this.specFileDatecode = specFile.datecode;

      this.updateView();
    });
  },

  methods: {
    updateView() {
      this.devices = null;
      this.packets = null;
      this.fields = null;
      this.bytes = null;

      if (!this.id) {
        // logger.debug('Without packet ID');
        // logger.debug(this.specFile);

        this.deviceItems = this.specFile.deviceTemplates.map(dt => {
          return {
            selfAddress: formatHex(dt.selfAddress, 4, true),
            name: dt.name.en || dt.name.de || dt.name.fr,
          };
        });

        this.packetItems = this.specFile.packetTemplates.map(pt => {
          const packetSpec = this.spec.getPacketSpecification(0, pt.destinationAddress, pt.sourceAddress, pt.command);

          // logger.debug(packetSpec);

          return {
            name: getPacketName(packetSpec),
            toBytes: `/vsf/bytes/${packetSpec.packetId}`,
            toFields: `/vsf/fields/${packetSpec.packetId}`,
          };
        });
      } else if (this.id.length === 12) {
        // logger.debug(`With device ID "${this.id}"`);
      } else if (this.id.length === 20) {
        // logger.debug(`With packet ID "${this.id}"`);

        const packetSpec = this.spec.getPacketSpecification(this.id);

        this.title = `${getPacketName(packetSpec)} (${packetSpec.packetId})`;

        if (this.kind === 'fields') {
          this.fields = packetSpec.packetFields.map(pf => {
            return {
              id: `${packetSpec.packetId}_${pf.fieldId}`,
              name: pf.name.en || pf.name.de || pf.name.fr,
              factor: pf.factor.toFixed(pf.type.precision),
              unit: pf.type.unit.unitText,
            };
          });
        } else if (this.kind === 'bytes') {
          const bytes = packetSpec.packetFields.reduce((memo, pf) => {
            return pf.parts.reduce((memo, part) => {
              const offset = part.offset + (part.bitPos >>> 3);
              const mask = (part.mask !== 255) ? formatHex(part.mask, 2, true) : '';

              memo.push({
                offset,
                mask,
                name: pf.name.en || pf.name.de || pf.name.fr,
                factor: (pf.factor * part.factor).toFixed(pf.type.precision),
                unit: pf.type.unit.unitText,
                bitPos: part.bitPos,
              });
              return memo;
            }, memo);
          }, []);

          bytes.sort((l, r) => {
            let result = l.offset - r.offset;
            if (result === 0) {
              result = l.bitPos - r.bitPos;
            }
            return result;
          });

          this.bytes = bytes;
        }
      } else {
        logger.error(`Unexpected ID "${this.id}"`);
      }

      window.scrollTo(0, 0);
    },
  },
};
</script>

<style>

</style>