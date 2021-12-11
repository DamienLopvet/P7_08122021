const passwordValidator = require('password-validator');

// force User to set up a strong password and limit use of symbols to avoid code injection
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                  
.is().max(12)                                 
.has().uppercase()                              
.has().lowercase()                 
.has().digits()    
.has().symbols()
.has().not().symbols(2)
.has().not().spaces() 

module.exports = ("passwordCheking", passwordSchema)

 