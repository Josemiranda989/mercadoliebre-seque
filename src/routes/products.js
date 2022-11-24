// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')

// ************ Controller Require ************
const productsController = require('../controllers/productsController');
const validationCreate = require('../middlewares/validation');

// ************ Multer ************
// 1. requerimos multer
//2. configuramos el storage (destination, filename)
// 3.generar middleware upload
//4. utilizar el middleware en la ruta (mismo nombre del campo del formulario)
//5. en el controlador guardamos el nombre de archivo que usamos aca

//EJS
//6. Agregar un input type file con el mismo name que pasamons en la ruta
//7. agregar el enctype al form 
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, 'public/images/products')
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({storage: storage})

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); 
router.post('/', upload.single('image'),validationCreate, productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/detail/:id', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.patch('/edit/:id', upload.any(),productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/delete/:id', productsController.destroy); 


module.exports = router;
