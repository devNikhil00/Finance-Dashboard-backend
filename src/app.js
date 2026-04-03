const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 200,
	standardHeaders: true,
	legacyHeaders: false,
	message: 'Too many requests, please try again later.'
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(apiLimiter);

app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Finance Dashboard Backend API is running',
		data: {
			healthCheck: '/api/health',
			auth: '/api/auth',
			records: '/api/records',
			dashboard: '/api/dashboard/summary'
		}
	});
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
