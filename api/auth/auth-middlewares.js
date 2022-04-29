const validateAuthRequestBody = (req,res,next) => { 
    if(!req.body.username || !req.body.password) return next({message:'username and password required',status:400})
    next()
}

module.exports = {
    validateAuthRequestBody,
}