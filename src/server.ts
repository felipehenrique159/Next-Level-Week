import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import connection from './database/connection';

const app = express();

app.use(cors())
app.use(express.json()) 
app.use(routes)

app.listen(3000)

app.use('/uploads', express.static(path.resolve(__dirname,'..','uploads')))  //para acessar dados estaticos

