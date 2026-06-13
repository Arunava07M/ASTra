import express from 'express';
import { scanDirectory } from '../controllers/scanController.js';

const router = express.Router();

router.post('/scan', scanDirectory);

export default router;