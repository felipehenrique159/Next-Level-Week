import express from 'express';

const app = express();

app.listen(3000);

app.get('/users',(req,res)=>{
   res.send('Listagem de usuarios')
})

