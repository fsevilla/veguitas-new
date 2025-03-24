import express from 'express';
import { engine } from 'express-handlebars';
import { config } from 'dotenv';
config();

import { dbConnect } from './models/db';


import routes from './routes';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/assets', express.static(path.join(__dirname, '..', 'public')));

app.use(routes);

dbConnect().then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`App is running in port ${port}`);
    });
}).catch(e => {
    console.log('Failed to connect to MongoDB: ', e);
});
