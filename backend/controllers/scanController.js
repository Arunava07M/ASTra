import fs from 'fs';
import { getAllFiles } from '../services/fileScanner.js';
import { parseFiles } from '../services/astParser.js';
import { buildGraph } from '../utils/graphBuilder.js';

export const scanDirectory = async (req, res, next) => {
    try {
        const { targetPath } = req.body;

        if (!targetPath) {
            return res.status(400).json({ error: "Please provide a targetPath." });
        }

        if (!fs.existsSync(targetPath)) {
            return res.status(400).json({ error: "The provided path does not exist on this machine." });
        }

        // 1. Recursively locate all files
        const files = getAllFiles(targetPath);

        // 2. Parse out AST data and local imports
        const parsedData = parseFiles(files, targetPath);

        // 3. Construct React Flow structured payload
        const graphPayload = buildGraph(parsedData);

        res.json(graphPayload);
    } catch (error) {
        next(error);
    }
};