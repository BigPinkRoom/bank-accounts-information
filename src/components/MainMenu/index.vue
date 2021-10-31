<template>
  <b-navbar toggleable="lg" type="dark" variant="info" class="px-3">
    <b-navbar-brand href="#">Bank accounts information</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav class="d-flex justify-content-end">
      <b-navbar-nav class="ml-auto">
        <b-nav-item :to="link.code" v-for="link in links" :key="link.code">{{ link.title }}</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'MainMenu',
  props: {
    links: {
      type: Array,
    },
  },
};
</script>

<style></style>
