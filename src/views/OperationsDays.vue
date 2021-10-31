<template>
  <div>
    <v-workarea>
      <template #content>
        <b-overlay :show="isLoading" rounded="sm">
          <b-container>
            <b-row>
              <b-col>
                <b-table
                  :fields="operationsDays.fields"
                  :items="operationsDays.items"
                  select-mode="single"
                  selectable
                  @row-selected="onOperationsDaySelected"
                >
                </b-table>
              </b-col>
            </b-row>
            <b-row>
              <b-col> </b-col>
            </b-row>
            <b-row v-if="!isShowTransactionsTable">
              <b-col>
                <b-table :fields="transactions.fields" :items="transactions.items"> </b-table>
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
import { mapGetters } from 'vuex';
import Workarea from '@/components/Workarea';
import api from '@/api';
import { transactionsServices } from '@/services/transactions';

export default {
  name: 'Operations',
  components: {
    VWorkarea: Workarea,
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
          OperationDate: day,
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
        console.log('error', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.setOperationsDays();
  },
};
</script>

<style></style>
