import { Request, Response } from 'express';
import connection from '../database/connection';

class PointsController {


    async show(req: Request,res: Response){
        const { id } = req.params;

        const point = await connection('points').where('id',id).first();



        if(!point){
            return res.status(400).json({message: 'Point not found'});
        }

        const items = await connection('items').join('point_items','items.id','=','point_items.item_id')
        .where('point_items.point_id',id).select('items.title')
      
       return res.json({point,items});
      

    }

    async create(req: Request, res: Response) {

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
     
        const point = {

            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,


        }
        const insertedIds = await trx('points').insert(point);

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id: insertedIds[0]
            }
        })

        const point_id = insertedIds[0];

        await trx('point_items').insert(pointItems);
        return res.json({
            id:point_id,
            ... point, //retornar todas as propriedades
        })
    }
}

export default PointsController;
