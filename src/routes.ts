import express, { response } from 'express';
import connection from './database/connection';


const routes = express.Router();

routes.get('/items',async (req,res)=>{
   
    const items = await connection('items').select('*')

    const serializedItems = items.map(item =>{  //map para percorrer array
        return {
            id: item.id,
            title: item.title,
            image_url: `http://localhost:3000/uploads/${item.image}`
        }
    })

    return res.json(serializedItems);

 })

 routes.post('/points', async(req,res)=>{
//    console.log(req.body)
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = req.body;

    const trx = await connection.transaction(); //para transação, caso erro é executado um rollback

    const insertedIds = await trx('points').insert({
     
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        
        
    });

    const pointItems = items.map((item_id: number) =>{
        return{
            item_id,
            point_id:insertedIds[0]
        }
    })

    const point_id = insertedIds[0];
    
    await trx('point_items').insert(pointItems);
    return res.json({
        success:true
    })

 })


export default routes;