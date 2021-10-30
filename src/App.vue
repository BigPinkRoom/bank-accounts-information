<template>
  <div>
    <b-container fluid class="px-0">
      <v-main-menu :links="links" />
    </b-container>
    <b-container>
      <router-view />
    </b-container>
  </div>
</template>

<script>
import MainMenu from './components/MainMenu';

export default {
  name: 'App',
  components: {
    vMainMenu: MainMenu,
  },
  data() {
    return {
      links: [
        {
          title: 'Счета',
          code: 'accounts',
        },
        {
          title: 'Операционные дни',
          code: 'operations-days',
        },
        {
          title: 'Операции',
          code: 'operations',
        },
      ],
    };
  },
};
</script>

<style lang="scss"></style>
