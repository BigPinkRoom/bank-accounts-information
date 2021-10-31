<template>
  <div>
    <v-workarea>
      <template #content>
        <b-overlay :show="isLoading" rounded="sm">
          <b-container>
            <b-row>
              <b-col>
                <b-table
                  :fields="transactions.fields"
                  :items="transactions.items"
                  select-mode="single"
                  selectable
                  @row-selected="onTransactionsSelected"
                >
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-table :fields="accounts.fields" :items="accounts.items"> </b-table>
              </b-col>
            </b-row>
          </b-container>
        </b-overlay>
      </template>
    </v-workarea>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Workarea from '@/components/Workarea';
import api from '@/api';
import { transactionsServices } from '@/services/transactions';
import { accountsServices } from '@/services/accounts';

export default {
  name: 'Operations',
  components: {
    VWorkarea: Workarea,
  },
  data() {
    return {
      transactions: {
        fields: [
          {
            key: 'OpDate',
            label: 'Дата операционного дня',
          },
          {
            key: 'AcctCr',
            label: 'Счёт кредита',
          },
          {
            key: 'AcctDB',
            label: 'Счёт дебета',
          },
          {
            key: 'Amount',
            label: 'Сумма',
          },
          {
            key: 'settings',
            label: 'Настройки',
          },
        ],
        items: [],
      },
      accounts: {
        fields: [
          {
            key: 'Acct',
            label: 'Номер счёта',
          },
          {
            key: 'Ost',
            label: 'Остаток',
          },
          {
            key: 'settings',
            label: 'Настройки',
          },
        ],
        items: [],
      },
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(['getAllOperationsDays', 'getOperationsDay']),
  },
  methods: {
    async setTransactions() {
      this.isLoading = true;

      try {
        const response = await api.transactions.get();
        const result = transactionsServices.get.convertToArray({
          transactions: response,
        });
        console.log('result', result);
        this.transactions.items = result;
      } catch (error) {
        console.log('error', error);
      } finally {
        this.isLoading = false;
      }
    },
    async onTransactionsSelected(rows) {
      const transactionDate = rows[0].OpDate;
      const firstAccountNumber = rows[0].AcctCr;
      const secondAccountNumber = rows[0].AcctDB;

      this.isLoading = true;
      try {
        const responseAccounts = await api.accounts.get();
        const responseTransactions = await api.transactions.get();
        const result = accountsServices.getAccountsByTransaction.convertToArray({
          transactions: responseTransactions,
          accounts: responseAccounts,
          transactionDate,
          firstAccountNumber,
          secondAccountNumber,
        });
        this.accounts.items = result;
        this.selectedRow = rows[0];
      } catch (error) {
        console.log('error', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.setTransactions();
  },
};
</script>

<style></style>
