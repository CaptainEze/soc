const {UserModel} = require('../db/mongoModels');

const createUser = async (data) =>{
    if(data.email && data.password && data.verif){
        try{
            const user = new UserModel(data);
            await user.save();
            return user;
        } catch (err){
            console.log(err);
            console.log('Error writing to database');
            return null
        }
    }
    else return null;
}

const fetchUser = async (email) =>{
    try {
        const user = await UserModel.findOne({email});
        return user;
    } catch(err){
        console.log(err);
        console.log('Error reading from database');
        return null
    }
}

const verifyUser = async (_email) =>{
    try {
        const user = await UserModel.findOneAndUpdate({
            email : _email
        },{
            verified : true
        },{
            new : true
        });
        return user;
    } catch(err){
        console.log(err);
        console.log('Error updating database');
        return null
    }
}

module.exports = {
    createUser,
    fetchUser,
    verifyUser
}