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
          <b-container class="mt-1">
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
              buttonTitle="Добавить новый счёт"
              @send="(accountData) => addNewAccount(accountData, 'accountsWithRemainingBalances')"
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
                      v-model="accountsWithRemainingBalances.items[data.index].accountNumber"
                      type="text"
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
                      <b-button size="sm" class="mx-1" @click="deleteRow(row.item.id, 'accountsWithRemainingBalances')">
                        Удалить
                      </b-button>
                      <b-button size="sm" class="mx-1" @click="editRow(row, 'accountsWithRemainingBalances')">
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

            <div v-if="!isShowTransactionsTable">
              <v-add-form
                :listProperties="formsNewOperation"
                buttonTitle="Добавить новую операцию"
                @send="(accountData) => addNewAccount(accountData, 'transactionsByAccount')"
              ></v-add-form>
              <b-row>
                <b-col>
                  <b-table :items="transactionsByAccount.items" :fields="transactionsByAccount.fields">
                    <template #cell(OpDate)="data">
                      <b-form-input
                        v-if="transactionsByAccount.items[data.index].isEdit"
                        v-model="transactionsByAccount.items[data.index].OpDate"
                        type="text"
                      ></b-form-input>
                      <span v-else>{{ data.value }}</span>
                    </template>
                    <template #cell(AcctDB)="data">
                      <b-form-input
                        v-if="transactionsByAccount.items[data.index].isEdit"
                        v-model="transactionsByAccount.items[data.index].AcctDB"
                        type="text"
                      ></b-form-input>
                      <span v-else>{{ data.value }}</span>
                    </template>
                    <template #cell(AcctCr)="data">
                      <b-form-input
                        v-if="transactionsByAccount.items[data.index].isEdit"
                        v-model="transactionsByAccount.items[data.index].AcctCr"
                        type="text"
                      ></b-form-input>
                      <span v-else>{{ data.value }}</span>
                    </template>
                    <template #cell(Amount)="data">
                      <b-form-input
                        v-if="transactionsByAccount.items[data.index].isEdit"
                        v-model="transactionsByAccount.items[data.index].Amount"
                        type="text"
                      ></b-form-input>
                      <span v-else>{{ data.value }}</span>
                    </template>
                    <template #cell(settings)="row">
                      <div class="d-flex justify-content-end">
                        <b-button size="sm" class="mx-1" @click="deleteRow(row.item.id, 'transactionsByAccount')">
                          Удалить
                        </b-button>
                        <b-button size="sm" class="mx-1" @click="editRow(row, 'transactionsByAccount')">
                          {{ !transactionsByAccount.items[row.index].isEdit ? 'Изменить' : 'Сохранить' }}
                        </b-button>
                        <b-button size="sm" class="mx-1" @click="showDetailModal(row)"> Детали </b-button>
                      </div>
                    </template>
                  </b-table>
                </b-col>
              </b-row>
            </div>

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
          {
            key: 'settings',
            label: 'Настройки',
          },
        ],
        items: [],
      },
      isLoading: false,
      isShowDetail: false,
      detailTitle: null,
      detailContent: null,
      formsNewAccount: ['accountNumber', 'remainingBalance'],
      formsNewOperation: ['OpDate', 'AcctDB', 'AcctCr', 'Amount'],
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
      this.detailTitle = `Детальная информация по ${row.item.accountNumber}`;
      console.log('row', row);
      const contentStrings = [];

      for (let element in row.item) {
        if (element !== 'isEdit') {
          contentStrings.push(`${[element]}: ${row.item[element]}`);
        }
      }

      this.detailContent = contentStrings;
    },
    hideDetailModalHandler() {
      this.isShowDetail = false;
    },
    deleteRow(rowId, tableName) {
      const deleteIndex = this[tableName].items.findIndex((element) => {
        return element.id === rowId;
      });

      this[tableName].items.splice(deleteIndex, 1);
    },
    editRow(row, tableName) {
      this[tableName].items[row.index].isEdit = !this[tableName].items[row.index].isEdit;
    },
    addNewAccount(accountData, table) {
      this[table].items.unshift(accountData);
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
