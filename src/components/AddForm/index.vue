<template>
  <b-container>
    <b-button size="sm" class="m-1" @click="clickShowHandler"> {{ showForms ? 'Закрыть' : buttonTitle }} </b-button>
    <div v-if="showForms">
      <b-row v-for="property in listProperties" :key="property.id">
        <b-col>
          <b-form-input size="sm" class="m-1" :placeholder="property" v-model="properties[property]"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button size="sm" class="m-1" @click="clickSendHandler"> Ок </b-button>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import { uuid } from 'vue-uuid';

export default {
  name: 'AddForm',
  props: {
    buttonTitle: {
      type: String,
      default() {
        return '+';
      },
    },
    listProperties: {
      type: Array,
    },
  },
  data() {
    return {
      properties: {},
      showForms: false,
    };
  },
  methods: {
    closeForm() {
      this.showForms = !this.showForms;
    },
    clickShowHandler() {
      this.closeForm();
    },
    clickSendHandler() {
      let check = true;
      for (let property in this.properties) {
        if (this.properties[property] === '') {
          check = false;
        }
      }

      this.closeForm();

      if (check) {
        const cloneProperties = {};
        Object.assign(cloneProperties, this.properties);

        this.$emit('send', cloneProperties);
      }
    },
    createProperties() {
      this.listProperties.forEach((property) => {
        this.properties[property] = '';
      });
      this.properties.id = uuid.v4();
      this.properties.isEdit = false;
    },
  },
  mounted() {
    this.createProperties();
  },
};
</script>
