import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    if (this.transactions.length === 0) {
      return { income: 0, outcome: 0, total: 0 };
    }

    const balance: Balance = {
      income: this.transactions.reduce((total, current) => {
        return current.type === 'income' ? total + current.value : total;
      }, 0),
      outcome: this.transactions.reduce((total, current) => {
        return current.type === 'outcome' ? total + current.value : total;
      }, 0),
      total: this.transactions.reduce((total, current) => {
        return current.type === 'income'
          ? total + current.value
          : total - current.value;
      }, 0),
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (type === 'outcome' && this.getBalance().total - value < 0) {
      throw Error('Invalid transaction.');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
