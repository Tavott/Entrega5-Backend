import passport from "passport"
import { Router } from "express"
import { userVali } from "../middleware/userValidation.js"
import { MongoUserManager } from "../dao/mongo/MongoUserManager.js"
import { createHash, isValidPassword } from "../ultis/bcrypt.js"

const router = Router()

const mongoUserManager = new MongoUserManager

// App ID: 344559

// Client ID: Iv1.f6f9007f8c6ed191
// secretClient :5e051b4a831bb47a48d69f4226aa79804ac3c638
router.get('/', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        
        let user = await mongoUserManager.getUser(username)
        console.log(user);
        if (!user) {
            res.send({status: 'error', message: 'Usuario no existe'})
        }

        if(!isValidPassword(user, password)){
            res.send({status: 'error', message: 'Contraseña incorrecta'})
        }

        if (username !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
            req.session.user = username
            req.session.admin = false
            req.session.usuario = true
            console.log('usted es usuario')
            res.redirect('http://localhost:8080/products')
        } else {
            req.session.user = username
            req.session.admin = true
            req.session.usuario = false
            console.log('usted es admin')
            res.redirect('http://localhost:8080/products')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if(!err) res.redirect('http://localhost:8080/auth')
            else res.send({status:'Logout error', message: err})
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', userVali, async (req, res)=>{
    const { first_name, last_name, age, roll = 'user', email, password } = req.body
    let user = { first_name, last_name, age, roll, email, password: createHash(password) }

    try {
        let exist = await mongoUserManager.getUser(email)
        
        if(exist) {
            res.send({status:'error', message: 'El usuario ya existe'})
        }else{
            await mongoUserManager.addUser(user)
            res.redirect('http://localhost:8080/auth/login')
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/failregister', (req, res)=>{
    res.send({status: 'error', message: 'fallo el registro'})
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if(!err) res.redirect('http://localhost:8080/auth/login')
            else res.send({status:'Logout error', message: err})
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/github', passport.authenticate('github',{scope: ['user:email']}))

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res)=>{
    console.log('req: ',req.user)
    req.session.user = req.user.first_name
    req.session.admin = false
    req.session.usuario = true
    res.redirect('http://localhost:8080/products')
})


export default router