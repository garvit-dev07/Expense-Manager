const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

app.use('/', authRoutes);
app.use('/', expenseRoutes);
app.use('/api', authRoutes);
app.use('/api', expenseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Expense API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();