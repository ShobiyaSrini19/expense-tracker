import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { expenseAPI } from './services/api';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await expenseAPI.getAll();
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await expenseAPI.create(expenseData);
      fetchExpenses();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (expenseData) => {
    try {
      await expenseAPI.update(editingExpense._id, expenseData);
      fetchExpenses();
      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const startEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleSave = (expenseData) => {
    if (editingExpense) {
      handleEditExpense(expenseData);
    } else {
      handleAddExpense(expenseData);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Expense Tracker</h1>
      </header>

      <main className="app-main">
        <div className="container">
          {!showForm ? (
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary add-expense-btn"
            >
              Add New Expense
            </button>
          ) : (
            <ExpenseForm
              expense={editingExpense}
              onSave={handleSave}
              onCancel={cancelEdit}
            />
          )}

          <ExpenseList
            expenses={expenses}
            onEdit={startEdit}
            onDelete={handleDeleteExpense}
          />
        </div>
      </main>
    </div>
  );
}

export default App;