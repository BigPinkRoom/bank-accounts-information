<template>
  <b-modal :visible="show" id="modal-detail" @hide="emitHide" hide-footer>
    <template #modal-title>
      {{ title }}
    </template>

    <slot name="content"></slot>
  </b-modal>
</template>

<script>
export default {
  name: 'ModalDetail',
  props: {
    title: {
      type: String,
    },
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {
    emitHide() {
      this.$emit('modalHide');
    },
  },
};
</script>
