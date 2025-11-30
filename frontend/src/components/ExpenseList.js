import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <h2>Expenses</h2>
        <p className="no-expenses">No expenses recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="expense-header">
        <h2>Expenses</h2>
        <div className="total-amount">
          Total: ₹{totalAmount.toFixed(2)}
        </div>
      </div>
      {expenses.map(expense => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExpenseList;