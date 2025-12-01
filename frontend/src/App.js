import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { expenseAPI } from './services/api';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    categoriesCount: 0,
    monthlyChange: 0
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await expenseAPI.getAll();
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const calculateStats = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const categories = new Set(expenses.map(expense => expense.category));
    
    // Calculate monthly change (simplified)
    const monthlyChange = expenses.length > 0 ? 12.5 : 0;
    
    setStats({
      totalExpenses: total,
      monthlyExpenses: monthlyExpenses,
      categoriesCount: categories.size,
      monthlyChange: monthlyChange
    });
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
      setShowForm(false);
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

  const formatAmount = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="App">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="app-title">Expense Tracker</h1>
          <div className="user-info">
            <span className="free-account-badge">Free Account</span>
          </div>
        </div>

        {/* Card 1: Total Expenses */}
        <div className="stats-card card-total-expenses">
          <div className="card-header">
            <div className="card-title">Total Expenses</div>
            <div className="card-percentage percentage-positive">
              ↑ 41%
            </div>
          </div>
          <div className="card-value">{formatAmount(stats.totalExpenses)}</div>
          <div className="card-subtitle">Overall spending</div>
          <div className="dashboard-stats">
            <div className="stat-item">
              <div className="stat-number">74B</div>
              <div className="stat-label">Hr</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Groups</div>
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Overview */}
        <div className="stats-card card-monthly-overview">
          <div className="card-header">
            <div className="card-title">This Month</div>
            <div className="card-percentage percentage-positive">
              ↑ 12%
            </div>
          </div>
          <div className="card-value">{formatAmount(stats.monthlyExpenses)}</div>
          <div className="card-subtitle">Monthly spending</div>
          <div className="dashboard-stats">
            <div className="stat-item">
              <div className="stat-number">9.178</div>
              <div className="stat-label">St</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">7</div>
              <div className="stat-label">Groups</div>
            </div>
          </div>
        </div>

        {/* Card 3: Categories */}
        <div className="stats-card card-categories">
          <div className="card-header">
            <div className="card-title">Categories</div>
            <div className="card-percentage percentage-negative">
              ↓ 8%
            </div>
          </div>
          <div className="card-value">{stats.categoriesCount}</div>
          <div className="card-subtitle">Active categories</div>
          <div className="dashboard-stats">
            <div className="stat-item">
              <div className="stat-number">9.200</div>
              <div className="stat-label">St</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">Months</div>
            </div>
          </div>
        </div>

        {/* Card 4: Recent Expenses */}
        <div className="stats-card card-recent-expenses">
          <div className="card-header">
            <h2 className="card-title">Recent Expenses</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              + Add New
            </button>
          </div>
          <div className="expense-list">
            {expenses.length === 0 ? (
              <div className="no-expenses">
                <p>No expenses recorded yet. Add your first expense!</p>
              </div>
            ) : (
              expenses.slice(0, 5).map(expense => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-info">
                    <h3 className="expense-description">{expense.description}</h3>
                    <div className="expense-details">
                      <span className="expense-amount">{formatAmount(expense.amount)}</span>
                      <span className="expense-category">{expense.category}</span>
                      <span className="expense-date">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="expense-actions">
                    <button 
                      onClick={() => startEdit(expense)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 5: Add Expense Form */}
        <div className="stats-card card-add-expense">
          <div className="card-header">
            <h2 className="card-title">
              {showForm ? (editingExpense ? 'Edit Expense' : 'Add Expense') : 'Quick Actions'}
            </h2>
          </div>
          
          {showForm ? (
            <ExpenseForm
              expense={editingExpense}
              onSave={handleSave}
              onCancel={cancelEdit}
            />
          ) : (
            <div className="quick-actions">
              <button 
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '15px' }}
              >
                + Add New Expense
              </button>
              <div className="action-stats">
                <div className="action-stat">
                  <div className="stat-number">5</div>
                  <div className="stat-label">This Month</div>
                </div>
                <div className="action-stat">
                  <div className="stat-number">3</div>
                  <div className="stat-label">Last Week</div>
                </div>
                <div className="action-stat">
                  <div className="stat-number">₹1,500</div>
                  <div className="stat-label">Avg/Month</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;