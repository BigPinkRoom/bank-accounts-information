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
                <b-table
                  :fields="transactions.fields"
                  :items="transactions.items"
                  select-mode="single"
                  selectable
                  @row-selected="onTransactionsSelected"
                >
                  <template #cell(OpDate)="data">
                    <b-form-input
                      v-if="transactions.items[data.index].isEdit"
                      v-model="transactions.items[data.index].OpDate"
                      type="text"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(AcctCr)="data">
                    <b-form-input
                      v-if="transactions.items[data.index].isEdit"
                      v-model="transactions.items[data.index].AcctCr"
                      type="text"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(AcctDB)="data">
                    <b-form-input
                      v-if="transactions.items[data.index].isEdit"
                      v-model="transactions.items[data.index].AcctDB"
                      type="text"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(Amount)="data">
                    <b-form-input
                      v-if="transactions.items[data.index].isEdit"
                      v-model="transactions.items[data.index].Amount"
                      type="text"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(settings)="row">
                    <div class="d-flex justify-content-end">
                      <b-button size="sm" class="mx-1" @click="deleteRow(row.item.id, 'transactions')">
                        Удалить
                      </b-button>
                      <b-button size="sm" class="mx-1" @click="editRow(row, 'transactions')">
                        {{ !transactions.items[row.index].isEdit ? 'Изменить' : 'Сохранить' }}
                      </b-button>
                      <b-button size="sm" class="mx-1" @click="showDetailModal(row)"> Детали </b-button>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-table :fields="accounts.fields" :items="accounts.items">
                  <template #cell(Acct)="data">
                    <b-form-input
                      v-if="accounts.items[data.index].isEdit"
                      v-model="accounts.items[data.index].Acct"
                      type="text"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(Ost)="data">
                    <b-form-input
                      v-if="accounts.items[data.index].isEdit"
                      v-model="accounts.items[data.index].Ost"
                      type="text"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(settings)="row">
                    <div class="d-flex justify-content-end">
                      <b-button size="sm" class="mx-1" @click="deleteRow(row.item.id, 'accounts')"> Удалить </b-button>
                      <b-button size="sm" class="mx-1" @click="editRow(row, 'accounts')">
                        {{ !accounts.items[row.index].isEdit ? 'Изменить' : 'Сохранить' }}
                      </b-button>
                      <b-button size="sm" class="mx-1" @click="showDetailModal(row)"> Детали </b-button>
                    </div>
                  </template>
                </b-table>
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
import DetailModal from '@/components/Detail';
import api from '@/api';
import { transactionsServices } from '@/services/transactions';
import { accountsServices } from '@/services/accounts';

export default {
  name: 'Operations',
  components: {
    VWorkarea: Workarea,
    VDetailModal: DetailModal,
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
      isShowDetail: false,
      detailTitle: null,
      detailContent: null,
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
        this.transactions.items = result;
      } catch (error) {
        console.error('error', error);
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
        console.error('error', error);
      } finally {
        this.isLoading = false;
      }
    },
    showDetailModal(row) {
      this.isShowDetail = true;
      this.detailTitle = `Детальная информация по ${row.item.id} счёту`;
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
  },
  mounted() {
    this.setTransactions();
  },
};
</script>

<style></style>
