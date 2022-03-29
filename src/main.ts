import * as express from 'express';
import * as fs from 'fs';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as multer from 'multer';
import { GifAnalyzer } from 'gif-analyzer';
import helmet from 'helmet';

import CONFIG from './config';

const multerInstance = multer({
    dest: './temp',
    limits: { fileSize: 1 * 1E9 }
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/analyze', multerInstance.single('gif'), (req: any, res: any) => {
    try {
        const file = req.file?.path ?? '';

        if (!file) {
            return req.status(400).send('No "gif" file provided');
        }

        const gifBuffer = fs.readFileSync(file);
        const gifAnalyzer = new GifAnalyzer(gifBuffer);
        res.send(gifAnalyzer.rfcParts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
    
});

app.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`);
});