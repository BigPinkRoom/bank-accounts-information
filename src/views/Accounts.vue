<template>
  <div>
    <v-workarea>
      <template #content>
        <b-overlay :show="isLoading" rounded="sm">
          <v-detail-modal :title="detailTitle" :show="isShowDetail" @modalHide="hideDetailModalHandler">
            <template #content>
              <p v-for="item in detailContent" :key="item.accountNumber">{{ item }}</p>
            </template>
          </v-detail-modal>
          <b-container>
            <b-row>
              <b-col>
                <b-form-datepicker
                  id="example-datepicker"
                  v-model="selectedDate"
                  :date-info-fn="setDateClass"
                  :initial-date="initialDate"
                  class="accounts-datepicker my-2"
                ></b-form-datepicker>
              </b-col>
            </b-row>

            <v-add-form
              :listProperties="formsNewAccount"
              buttonTitle="Создать новый счёт"
              @send="addNewAccount"
            ></v-add-form>

            <b-row v-if="!isEmptyAccountsTable">
              <b-col>
                <b-table
                  :fields="accountsWithRemainingBalances.fields"
                  :items="accountsWithRemainingBalances.items"
                  select-mode="single"
                  selectable
                  @row-selected="onAccountSelected"
                >
                  <template #cell(accountNumber)="data">
                    <b-form-input
                      v-if="accountsWithRemainingBalances.items[data.index].isEdit"
                      type="text"
                      v-model="accountsWithRemainingBalances.items[data.index].accountNumber"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(remainingBalance)="data">
                    <b-form-input
                      v-if="accountsWithRemainingBalances.items[data.index].isEdit"
                      type="text"
                      v-model="accountsWithRemainingBalances.items[data.index].remainingBalance"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(settings)="row">
                    <div class="d-flex justify-content-end">
                      <b-button size="sm" class="mx-1" @click="deleteRow(row.item.accountNumber)"> Удалить </b-button>
                      <b-button size="sm" class="mx-1" @click="editRowHandler(row)">
                        {{ !accountsWithRemainingBalances.items[row.index].isEdit ? 'Изменить' : 'Сохранить' }}
                      </b-button>
                      <b-button size="sm" class="mx-1" @click="showDetailModal(row)"> Детали </b-button>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col class="text-center"> На этот день, нет банковских операций </b-col>
            </b-row>
            <b-row v-if="!isShowTransactionsTable">
              <b-col>
                <b-table :items="transactionsByAccount.items" :fields="transactionsByAccount.fields"> </b-table>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col class="text-center">
                {{ selectedRow ? 'На этот день, нет транзакций' : 'Выберите счёт для просмотра его транзакций' }}</b-col
              >
            </b-row>
          </b-container>
        </b-overlay>
      </template>
    </v-workarea>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Workarea from '@/components/Workarea';
import DetailModal from '@/components/Detail';
import AddForm from '@/components/AddForm';
import api from '@/api';
import { accountsServices } from '@/services/accounts';
import { transactionsServices } from '@/services/transactions';

export default {
  name: 'Accounts',
  components: {
    VWorkarea: Workarea,
    VDetailModal: DetailModal,
    VAddForm: AddForm,
  },
  data() {
    return {
      datesWithOperationsDays: [],
      selectedDate: null,
      selectedRow: null,
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
          {
            key: 'settings',
            label: 'Настройки',
          },
        ],
        items: [],
      },
      transactionsByAccount: {
        fields: [
          {
            key: 'OpDate',
            label: 'Дата операционного дня',
          },
          {
            key: 'AcctDB',
            label: 'Счет дебета',
          },
          {
            key: 'AcctCr',
            label: 'Cчет кредита',
          },
          {
            key: 'Amount',
            label: 'Сумма',
          },
        ],
        items: [],
      },
      isLoading: false,
      isShowDetail: false,
      detailTitle: null,
      detailContent: null,
      formsNewAccount: ['accountNumber', 'remainingBalance'],
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
    isEmptyAccountsTable() {
      return !this.accountsWithRemainingBalances.items.length;
    },
    isShowTransactionsTable() {
      return !this.transactionsByAccount.items.length;
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
        const result = accountsServices.getAccountsWithBalance.convertToArray({
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

    async onAccountSelected(rows) {
      const accountNumber = rows[0].accountNumber;

      this.isLoading = true;

      try {
        const response = await api.transactions.get();
        const result = transactionsServices.getByAccountNumber.convertToArray({
          accountNumber,
          transactions: response,
        });

        this.transactionsByAccount.items = result;
        this.selectedRow = rows[0];
      } catch (error) {
        console.log('error', error);
      } finally {
        this.isLoading = false;
      }
    },
    showDetailModal(row) {
      this.isShowDetail = true;
      this.detailTitle = `Детальная информация по ${row.item.accountNumber} счёту`;
      console.log('row', row);
      const contentStrings = [];

      for (let element in row.item) {
        contentStrings.push(`${[element]}: ${row.item[element]}`);
      }

      console.log('content strings', contentStrings);

      this.detailContent = contentStrings;
    },
    hideDetailModalHandler() {
      this.isShowDetail = false;
    },
    async deleteRow(rowId) {
      const deleteIndex = this.accountsWithRemainingBalances.items.findIndex((account) => {
        return account.accountNumber === rowId;
      });

      this.accountsWithRemainingBalances.items.splice(deleteIndex, 1);
    },
    editRowHandler(row) {
      this.accountsWithRemainingBalances.items[row.index].isEdit =
        !this.accountsWithRemainingBalances.items[row.index].isEdit;
    },
    addNewAccount(accountData) {
      this.accountsWithRemainingBalances.items.unshift(accountData);
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
