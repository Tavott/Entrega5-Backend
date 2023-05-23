import { Router } from "express"
import { MongoCartManager } from "../dao/mongo/MongoCartManager.js"

const router = Router()

const mongoCartManager = new MongoCartManager

router.post('/', async (req, res) => {
    await mongoCartManager.createCart()

    res.send({mensaje: "carrito creado"})
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params              // se recibe cid de los parametros
    const {limit = 1 , page = 1, query} = req.query
    try {
        const cartProducts = await mongoCartManager.getCartProducts(cid, limit, page)
        
        res.send(cartProducts)
    } catch (error) {
        console.log(error)
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params         // se reciben cid, pid de los parametros

    try {
        await mongoCartManager.uploadProduct(cid, pid)

        res.send({mensaje: "producto agregado al carrito"})

    } catch (error) {
        console.log(error)
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params         // se reciben cid, pid de los parametros

    try {
        await mongoCartManager.deleteProduct(cid, pid)

        res.send({mensaje: "producto eliminado del carrito"})

    } catch (error) {
        console.log(error)
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params         // se reciben cid, pid de los parametros

    try {
        await mongoCartManager.uploadProduct(cid, pid)

        res.send({mensaje: "producto agregado al carrito"})

    } catch (error) {
        console.log(error)
    }
})

router.delete('/:cid', async (req, res) => {
    const { cid, pid } = req.params         // se reciben cid, pid de los parametros

    try {
        await mongoCartManager.deleteCartProducts(cid)

        res.send({mensaje: "todos los productos eliminados del carrito"})

    } catch (error) {
        console.log(error)
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params         // se reciben cid, pid de los parametros
    const data = req.body

    try {
        await mongoCartManager.arrayProductsUpdate(cid, data)

        res.send({mensaje: "Array de productos agregado al carrito"})

    } catch (error) {
        console.log(error)
    }
})

export default router