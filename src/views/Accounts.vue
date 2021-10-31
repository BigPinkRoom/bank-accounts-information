<template>
  <div>
    <workarea>
      <template #content>
        <b-overlay :show="isLoading" rounded="sm">
          <b-container>
            <b-row>
              <b-col>
                <b-form-datepicker
                  id="example-datepicker"
                  v-model="selectedDate"
                  :date-info-fn="setDateClass"
                  :initial-date="initialDate"
                  class="accounts-datepicker mb-2"
                  selectable
                  select-mode="single"
                ></b-form-datepicker>
              </b-col>
            </b-row>
            <b-row v-if="!isEmptyTable">
              <b-col>
                <b-table
                  :fields="accountsWithRemainingBalances.fields"
                  :items="accountsWithRemainingBalances.items"
                ></b-table>
              </b-col>
            </b-row>
            <b-row v-if="!isEmptyTable">
              <b-col>
                <b-table :items="itemsSecond"> </b-table>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col> На этот день, нет банковских операций </b-col>
            </b-row>
          </b-container>
        </b-overlay>
      </template>
    </workarea>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Workarea from '@/components/Workarea';
import api from '@/api';
import { accountsServices } from '@/services/accounts';
// import { operationsDaysServices } from '@/services/operationsDays';

export default {
  name: 'Accounts',
  components: {
    Workarea,
  },
  data() {
    return {
      datesWithOperationsDays: [],
      selectedDate: null,
      accountsWithRemainingBalances: {
        fields: [
          {
            key: 'accountNumber',
            label: 'Номер счёта',
          },
          {
            key: 'remainingBalance',
            label: 'Остаток',
          },
        ],
        items: [],
      },
      itemsSecond: [
        {
          test: 1,
          test2: 2,
        },
      ],
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(['getAllOperationsDays', 'getOperationsDay']),

    initialDate() {
      if (this.datesWithOperationsDays.length) {
        return this.datesWithOperationsDays[this.datesWithOperationsDays.length - 1];
      } else {
        return new Date();
      }
    },
    isEmptyTable() {
      return !this.accountsWithRemainingBalances.items.length;
    },
  },
  watch: {
    async selectedDate(value) {
      await this.setAccountsWithBalance(value);
    },
  },
  methods: {
    ...mapActions(['addOperationsDay', 'UpdateOperationsDayStatus', 'deleteOperationsDay']),

    setOperationsDays() {
      this.datesWithOperationsDays = this.getAllOperationsDays;
    },

    async setAccountsWithBalance(selectedDate) {
      this.isLoading = true;

      try {
        const responseAccounts = await api.accounts.get();
        const responseTransactions = await api.transactions.get();
        const result = accountsServices.getAccountsWithBalance.convertData({
          accounts: responseAccounts,
          transactions: responseTransactions,
          selectedDate,
        });
        this.accountsWithRemainingBalances.items = result;
      } catch (error) {
        console.log('error', error);
      } finally {
        this.isLoading = false;
      }
    },

    setStartDate(datesWithOperationsDays) {
      if (datesWithOperationsDays.length) {
        this.selectedDate = datesWithOperationsDays[datesWithOperationsDays.length - 1];
      } else {
        this.selectedDate = new Date();
      }
    },

    setDateClass(ymd) {
      const match = this.datesWithOperationsDays.find((date) => date === ymd);
      return match ? 'table-info' : '';
    },
  },
  mounted() {
    this.setOperationsDays();
    this.setStartDate(this.datesWithOperationsDays);
  },
};
</script>

<style lang="scss">
.accounts-datepicker .table-info {
  background-color: var(--bs-info);
}
</style>
