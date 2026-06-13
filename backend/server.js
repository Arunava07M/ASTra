import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Route Mount
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error', 
        details: err.message 
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`AST Engine running on http://localhost:${PORT}`);
});