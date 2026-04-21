import { useEffect, useMemo, useState } from 'react';
import { request } from '../api.js';

const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Education', 'Other'];

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value || 0);

const Dashboard = ({ user, onLogout }) => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('All');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
  });

  const fetchExpenses = async (selectedCategory = category) => {
    const query = selectedCategory === 'All' ? '' : `?category=${encodeURIComponent(selectedCategory)}`;
    const data = await request(`/expenses${query}`);
    setExpenses(data.expenses);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchExpenses().catch((err) => setMessage(err.message));
  }, []);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleCategoryChange = async (event) => {
    const nextCategory = event.target.value;
    setCategory(nextCategory);
    setMessage('');

    try {
      await fetchExpenses(nextCategory);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await request('/expense', {
        method: 'POST',
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      setForm({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().slice(0, 10),
      });
      await fetchExpenses(category);
      setMessage('Expense added successfully.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const categorySummary = useMemo(() => {
    const summary = categories.map((item) => ({
      name: item,
      amount: expenses
        .filter((expense) => expense.category === item)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }));

    return summary.filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const highestCategory = categorySummary[0]?.name || 'None yet';
  const averageExpense = expenses.length ? total / expenses.length : 0;

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">Personal Expense Management</p>
          <h1>Hello, {user?.name}</h1>
        </div>
        <button className="secondary icon-button" onClick={onLogout}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 6H6v12h4M14 8l4 4-4 4M8 12h10" />
          </svg>
          <span>Logout</span>
        </button>
      </header>

      <section className="summary-band">
        <div className="metric-card primary-metric">
          <span>Total Expense</span>
          <strong>INR {money(total)}</strong>
          <small>{expenses.length} entries in view</small>
        </div>
        <div className="metric-card">
          <span>Top Category</span>
          <strong>{highestCategory}</strong>
          <small>Based on selected filter</small>
        </div>
        <div className="metric-card">
          <span>Average Spend</span>
          <strong>INR {money(averageExpense)}</strong>
          <small>Per expense entry</small>
        </div>
      </section>

      <section className="filter-strip" aria-label="Filter expenses by category">
        {['All', ...categories].map((item) => (
          <button
            key={item}
            className={category === item ? 'chip active' : 'chip'}
            type="button"
            onClick={() => handleCategoryChange({ target: { value: item } })}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="workspace-grid">
        <form onSubmit={handleSubmit} className="form expense-form">
          <div className="section-heading">
            <h2>Add Expense</h2>
            <span>Secure entry</span>
          </div>
          <label>
            Title
            <input name="title" value={form.title} onChange={updateField} required />
          </label>
          <label>
            Amount
            <input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={updateField}
              required
            />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={updateField}>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input name="date" type="date" value={form.date} onChange={updateField} required />
          </label>
          <button type="submit" className="icon-button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add Expense</span>
          </button>
          {message && <p className="notice">{message}</p>}
        </form>

        <section className="expense-list">
          <div className="section-heading">
            <h2>Expenses</h2>
            <span>{category === 'All' ? 'All categories' : category}</span>
          </div>

          {categorySummary.length > 0 && (
            <div className="category-bars" aria-label="Expense amount by category">
              {categorySummary.slice(0, 5).map((item) => (
                <div className="bar-row" key={item.name}>
                  <span>{item.name}</span>
                  <div className="bar-track">
                    <i style={{ width: `${Math.max(8, (item.amount / total) * 100)}%` }} />
                  </div>
                  <strong>INR {money(item.amount)}</strong>
                </div>
              ))}
            </div>
          )}

          {expenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 7h16M7 7V5h10v2M6 7l1 13h10l1-13M10 11v5M14 11v5" />
                </svg>
              </div>
              <p className="empty">No expenses found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <tr key={expense._id} style={{ '--row-delay': `${index * 55}ms` }}>
                      <td>{expense.title}</td>
                      <td><span className="pill">{expense.category}</span></td>
                      <td>{new Date(expense.date).toLocaleDateString('en-IN')}</td>
                      <td className="amount">INR {money(expense.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
