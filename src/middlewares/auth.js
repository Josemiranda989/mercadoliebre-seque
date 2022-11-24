const path = require('path');
const fs = require('fs');

const userFilePath = path.join(__dirname, '../data/user.json');
const users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

const userLoginInfoFilePath = path.join(__dirname, '../data/userLoginInfo.json');
const usersLoginInfo = JSON.parse(fs.readFileSync(userLoginInfoFilePath, 'utf-8'));


module.exports = (req, res, next) => {
    // Por defecto el usuario no está logeado
    res.locals.user = false;
    
    
    // Si existe el usuario en session
    if (req.session.user) {
        // Se lo pasamos a la vista
        res.locals.user = req.session.user;
        
        
        return next();
        
        // O si tiene la cookie de recordar
    } else if (req.cookies.rememberToken) {     
        
        const userToken = usersLoginInfo.find(user => user.token = req.cookies.rememberToken);
        
        
        // y existe el token en nuestra base
        if (userToken) {       
            let user = users.find(user => user.id ==userToken.id)
            
            // y existe el usuario en nuestra base
            if(user) {
                delete user.password;
                
                // Se lo pasamos a la sesión a la vista
                req.session.user = user;
                res.locals.user = user;
                
                
            }
        }
    }
    
    next();
}