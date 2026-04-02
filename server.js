import express from 'express';
import router from './routes.js';
import cors from 'cors';

const app = express();

// Middleware (important)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Routes
app.use('/api', router);

// Server start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});