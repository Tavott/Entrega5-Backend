import { Router } from "express"
import { MongoProductManager } from "../dao/mongo/mongoProductManager.js"
import { MongoCartManager } from "../dao/mongo/MongoCartManager.js"
import { auth } from "../middleware/auth.js"

const mongoProductManager = new MongoProductManager
const mongoCartManager = new MongoCartManager

const router = Router()

router.get('/products', auth, async (req, res)=>{
    const {limit = 1 , page = 1, query} = req.query
    let filtro = {}
    query? filtro = {category: query} : filtro = {}
    try {
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await mongoProductManager.getProducts(limit, page, filtro)
        
        let datos = {
            productos: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit,
            query,
            username: req.session.user
        }
        res.render('home', datos)
    } catch (error) {
        console.log(error)
    }
})

router.get('/carts/:cid', async (req, res)=>{
    const {cid} = req.params
    const {limit = 1 , page = 1} = req.query
    console.log(limit)
    try {
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await mongoCartManager.getCartProducts(cid, limit, page)
        let data = docs[0].products
        let datos = {
            productos: data,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit
        }
        res.render('carts', datos)
    } catch (error) {
        console.log(error)
    }
})

router.get('/realtimeproducts', (req, res)=>{
    res.render('realTimeProducts')
})

router.get('/chat', (req, res)=>{
    res.render('chat')
})

export default router