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
          <b-container class="mt-2">
            <v-add-form
              :listProperties="formsNewOperationsDay"
              buttonTitle="Добавить операционный день"
              @send="(accountData) => addNewAccount(accountData, 'operationsDays')"
            ></v-add-form>
            <b-row>
              <b-col>
                <b-table
                  :fields="operationsDays.fields"
                  :items="operationsDays.items"
                  select-mode="single"
                  selectable
                  @row-selected="onOperationsDaySelected"
                >
                  <template #cell(OperationDate)="data">
                    <b-form-input
                      v-if="operationsDays.items[data.index].isEdit"
                      v-model="operationsDays.items[data.index].OperationDate"
                      type="text"
                    ></b-form-input>
                    <span v-else>{{ data.value }}</span>
                  </template>
                  <template #cell(settings)="row">
                    <div class="d-flex justify-content-end">
                      <b-button size="sm" class="mx-1" @click="deleteRow(row.item.id, 'operationsDays')">
                        Удалить
                      </b-button>
                      <b-button size="sm" class="mx-1" @click="editRow(row, 'operationsDays')">
                        {{ !operationsDays.items[row.index].isEdit ? 'Изменить' : 'Сохранить' }}
                      </b-button>
                      <b-button size="sm" class="mx-1" @click="showDetailModal(row)"> Детали </b-button>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-row>

            <v-add-form
              :listProperties="formsNewOperation"
              buttonTitle="Добавить новую операцию"
              @send="(accountData) => addNewAccount(accountData, 'transactions')"
            ></v-add-form>

            <b-row v-if="!isShowTransactionsTable">
              <b-col>
                <b-table :fields="transactions.fields" :items="transactions.items">
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
            <b-row v-else>
              <b-col class="text-center">
                {{ selectedRow ? 'На этот день, нет транзакций' : 'Выберите день для просмотра транзакций' }}</b-col
              >
            </b-row>
          </b-container>
        </b-overlay>
      </template>
    </v-workarea>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';
import Workarea from '@/components/Workarea';
import DetailModal from '@/components/Detail';
import AddForm from '@/components/AddForm';
import api from '@/api';
import { transactionsServices } from '@/services/transactions';

export default {
  name: 'Operations',
  components: {
    VWorkarea: Workarea,
    VDetailModal: DetailModal,
    VAddForm: AddForm,
  },
  data() {
    return {
      selectedRow: null,
      operationsDays: {
        fields: [
          {
            key: 'OperationDate',
            label: 'Дата операционного дня',
          },
          {
            key: 'settings',
            label: 'Настройки',
          },
        ],
        items: [],
      },
      transactions: {
        fields: [
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
      isLoading: false,
      isShowDetail: false,
      detailTitle: null,
      detailContent: null,
      formsNewOperation: ['OperationDate'],
      formsNewOperationsDay: ['AcctCr', 'AcctDB', 'Amount'],
    };
  },
  computed: {
    ...mapGetters(['getAllOperationsDays', 'getOperationsDay']),
    isShowTransactionsTable() {
      return !this.transactions.items.length;
    },
  },
  methods: {
    setOperationsDays() {
      this.operationsDays.items = this.getAllOperationsDays.map((day) => {
        return {
          id: uuid.v4(),
          OperationDate: day,
          isEdit: false,
        };
      });
    },
    async onOperationsDaySelected(rows) {
      const operationsDay = rows[0].OperationDate;
      this.isLoading = true;
      try {
        const response = await api.transactions.get();
        const result = transactionsServices.getByOperationsDay.convertToArray({
          operationsDay,
          transactions: response,
        });
        this.transactions.items = result;
        this.selectedRow = rows[0];
      } catch (error) {
        console.error('error', error);
      } finally {
        this.isLoading = false;
      }
    },
    showDetailModal(row) {
      this.isShowDetail = true;
      this.detailTitle = `Детальная информация по ${row.item.id}`;
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
  },
};
</script>

<style></style>
