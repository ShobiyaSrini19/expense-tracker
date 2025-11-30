import React from 'react';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="expense-item">
      <div className="expense-info">
        <h3 className="expense-description">{expense.description}</h3>
        <div className="expense-details">
          <span className="expense-amount">{formatAmount(expense.amount)}</span>
          <span className="expense-category">{expense.category}</span>
          <span className="expense-date">{formatDate(expense.date)}</span>
        </div>
      </div>
      <div className="expense-actions">
        <button 
          onClick={() => onEdit(expense)}
          className="btn btn-edit"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(expense._id)}
          className="btn btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;