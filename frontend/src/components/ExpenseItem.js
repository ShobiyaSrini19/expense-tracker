import React from 'react';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="expense-item">
      <div className="expense-info">
        <h3 className="expense-description">{expense.description}</h3>
        <div className="expense-details">
          <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
          <span className="expense-category">{expense.category}</span>
          <span className="expense-date">
            {new Date(expense.date).toLocaleDateString()}
          </span>
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