const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const app = express();

const allowed_origins = [
  'http://localhost:8081',
  'http://localhost:3200',
  process.env.FRONTEND_URL, // Use environment variable for production/deployment
].filter(Boolean);


app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins if '*' is in the list, otherwise check specific origins
    if (!origin || allowed_origins.includes('*') || allowed_origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

const PORT = process.env.PORT || 5200;

const admin_register_routes = require('./src/routes/admin_register_routes');
app.use('/', admin_register_routes);

const admin_login_routes = require('./src/routes/admin_login_routes');
app.use('/', admin_login_routes);

const user_register_routes = require('./src/routes/user_register_routes');
app.use('/', user_register_routes);

const user_login_routes = require('./src/routes/user_login_routes');
app.use('/', user_login_routes);

const read_users_routes = require('./src/routes/read_users_routes');
app.use('/', read_users_routes);

const add_new_items_routes = require('./src/routes/add_new_items_routes');
app.use('/', add_new_items_routes);

const get_items_routes = require('./src/routes/get_items_routes');
app.use('/', get_items_routes);

const get_all_items_routes = require('./src/routes/get_all_items_routes');
app.use('/', get_all_items_routes);

const delete_item_routes = require('./src/routes/delete_item');
app.use('/', delete_item_routes);

const delete_user_routes = require('./src/routes/delete_user');
app.use('/', delete_user_routes);

const mark_item_bought_routes = require('./src/routes/mark_item_bought');
app.use('/', mark_item_bought_routes);

const dashboard_routes = require('./src/routes/dashboard_routes');
app.use('/', dashboard_routes);

const get_future_items_routes = require('./src/routes/get_future_items_routes');
app.use('/', get_future_items_routes);

const change_password_routes = require('./src/routes/change_password_routes');
app.use('/', change_password_routes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} and bound to 0.0.0.0`);
  });
}

module.exports = app;
