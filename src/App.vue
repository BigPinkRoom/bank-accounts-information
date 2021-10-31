<template>
  <div>
    <b-overlay :show="isLoading" rounded="sm">
      <!-- <b-toast id="example-toast" title="BootstrapVue" static> Hello, world! This is a toast message. </b-toast> -->
      <b-container fluid class="px-0">
        <v-main-menu :links="links" />
      </b-container>
      <b-container v-if="!isLoading">
        <router-view />
      </b-container>
    </b-overlay>
  </div>
</template>

<script>
import MainMenu from './components/MainMenu';
import { mapMutations, mapActions, mapGetters } from 'vuex';

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
  computed: {
    ...mapGetters(['isLoading']),
  },
  methods: {
    ...mapMutations(['INCREASE_LOADING', 'DECREASE_LOADING']),
    ...mapActions(['initializationOperationsDays']),

    async initializeOperationsDays() {
      this.INCREASE_LOADING();
      await this.initializationOperationsDays();
      this.DECREASE_LOADING();
    },
  },
  async created() {
    await this.initializeOperationsDays();
  },
};
</script>

<style lang="scss"></style>
