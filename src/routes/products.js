import { Router } from "express"
import productsModel from "../models/products.js"
import { MongoProductManager } from "../dao/mongo/mongoProductManager.js"

const router = Router()

const mongoProductManager = new MongoProductManager

router.get('/', async (req, res)=>{
    const {limit, page = 1} = req.query       // se recibe limit del query
    try {
        let data = await mongoProductManager.getProducts(limit)

        res.send(data.docs)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:pid', async (req, res)=>{
    const {pid} = req.params        // se recibe pid de los parametros
    try {
        const allProducts = await mongoProductManager.getProducts()
        const productById = await mongoProductManager.getProductById(pid)

        pid ? res.send(productById) : res.send(allProducts)
    } catch (error) {
        console.log(error)
    }
})

router.post('/',async (req, res)=>{
    const { title, description, code, price, status, stock, category, thumbnail } = req.body

    if (title == '' || description == '' || code == '' || price == '' || status == '' || stock == '' || category == '') {
        res.send({aviso: "datos invalidos"})
    }else{
        try {
            await mongoProductManager.addProduct(title, description, price, thumbnail, code, stock, status, category)

            res.send({aviso: "producto agregado"})
        } catch (error) {
            console.log(error)
        }
    }
})

router.put('/:pid',async (req, res)=>{
    const {pid} = req.params
    const { title, description, code, price, status, stock, category, thumbnail } = req.body

    if (title == undefined || description == undefined || code == undefined || price == undefined || status == undefined || stock == undefined || category == undefined) {
        res.send({mensaje: "datos invalidos"})
    }else{
        let  obj =  { title, description, code, price, status, stock, category, thumbnail }
        try {
            await mongoProductManager.updateProduct(pid, obj)

            res.send({aviso: "producto actualizado"})
        } catch (error) {
            console.log(error)
        }
    }
})

router.delete('/:pid',async (req, res)=>{
    const {pid} = req.params        // se recibe pid de los parametros
    
    try {
        await mongoProductManager.deleteProduct(pid)

        res.send({aviso: "producto eliminado"})
    } catch (error) {
        console.log(error)
    }
})

export default router