<template>
  <b-container>
    <b-button size="sm" class="m-1" @click="clickShowHandler"> {{ showForms ? 'Закрыть' : buttonTitle }} </b-button>
    <div v-if="showForms">
      <b-row v-for="property in listProperties" :key="property">
        <b-col>
          <b-form-input size="sm" class="m-1" v-model="properties[property]"></b-form-input>
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
        this.$emit('send', this.properties);
      }
    },
    createProperties() {
      console.log('this list properties', this.listProperties);
      this.listProperties.forEach((property) => {
        this.properties[property] = '';
      });
    },
  },
  mounted() {
    this.createProperties();
  },
};
</script>
