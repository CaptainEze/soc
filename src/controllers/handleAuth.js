const utils = require('../utils');
const XenonValidate = require('../models/auth/xenonValidate');

const sendMail = require('../models/mail/mail');
const Mails = require('../models/mail/mails');

const { createUser, fetchUser, verifyUser } = require('../models/user');

// openUser.create()

const authHandler = () => {
    return{
        signUp : async (req,res)=>{
            if(!req.fields) return utils.serverError(res);
            let data = req.fields;
            if(!(data.email && data.pass && data.cpass)) return res.status(400).json({
                status : 1,
                message : 'All fields are required. See API docs for guide'
            });
            if(!XenonValidate.validateEmail(data.email)[0]) return res.json({
                status : 2,
                message : 'Invalid Email'
            });
            const alreadyUser = await fetchUser(data.email);
            if(alreadyUser){
                return res.json({
                    status : 3,
                    message : 'Email already exists. An account was found with this email'
                })
            }
            if(!XenonValidate.validatePassword(data.pass)[0]) return res.json({
                status : 4,
                message : 'Invalid Password'
            });
            if(data.pass !== data.cpass) return res.json({
                status : 5,
                message : 'Passwords don\'t match'
            });
            let passKey = utils.randomPassKey();
            let _tmp = {
                email : data.email,
                password : await utils.hash(data.pass),
                verif : await utils.hash(passKey)
            }
            
            const user = await createUser(_tmp);
            // console.log(user);
            if(user){
                sendMail(
                    {
                        from : 'Spin Bonanza',
                        receiver : data.email,
                        subject : 'Account opening'
                    },
                    Mails.RegSuccess(_tmp.email,passKey),
                    (err,info)=>{
                        if(err){
                            console.log(err);
                            return utils.serverError(res);
                        }
                        
                        // on success of email, respond to client with success 
                        if(/(250|OK)/.test(info.response)){
                            console.log('success');
                            return res.json({
                                status : 0,
                                message : 'Account created successfully',
                            });
                        }
                        else{
                            return utils.serverError(res);
                        }
                    }
                );
            }   
        },

        verifyEmail : async (req,res) =>{
            if(!req.fields) return utils.serverError(res);
            let data = req.fields;
            if(!(data.email && data.verif)) return res.status(400).json({
                status : 1,
                message : 'All fields are required. See API docs for guide'
            });
            if(!XenonValidate.validateEmail(data.email)[0]) return res.json({
                status : 2,
                message : 'Invalid verification link || Invalid Email'
            });
            const alreadyUser = await fetchUser(data.email);
            if(!alreadyUser){
                return res.json({
                    status : 3,
                    message : 'Email not registered. No account was found with this email'
                })
            }
            if(alreadyUser.verified){
                return res.json({
                    status : 4,
                    message : 'Account is already verified'
                })
            }
            if(data.verif.length != 12) return res.json({
                status : 4,
                message : 'Invalid verification link || token'
            });
            const currDate = Date.now();
            console.log(currDate-alreadyUser.regDate.getTime());
            if(((currDate - alreadyUser.regDate.getTime())/864000)>24){
                return res.json({
                    status : 5,
                    message : 'Verification Link expired'
                });
            }
            if(await utils.compare(data.verif,alreadyUser.verif)){
                const verifiedUser = await verifyUser(alreadyUser.email);
                if(verifiedUser && verifiedUser.verified){
                    return res.json({
                        status : 0,
                        message : 'Success',
                    })
                }
                else return utils.serverError(res);
            }
            return res.json({
                status : 6,
                message : 'Invalid Token'
            });
        },

        login : async (req, res) =>{
            if(!req.fields) return utils.serverError(res);
            let data = req.fields;
            if(!(data.email && data.pass)) return res.status(400).json({
                status : 1,
                message : 'All fields are required. See API docs for guide'
            });
            if(!XenonValidate.validateEmail(data.email)[0]) return res.json({
                status : 2,
                message : 'Invalid Email'
            });
            const alreadyUser = await fetchUser(data.email);
            if(!alreadyUser){
                return res.json({
                    status : 3,
                    message : 'No account was found with this email'
                })
            }
            if(!alreadyUser.verified){
                return res.json({
                    status : 4,
                    message : 'User is Unverified'
                })
            }
            const _tmp = {
                email : data.email,
                identity : await utils.hash(req.headers['user-agent'])
            }
            if(await utils.compare(data.pass, alreadyUser.password)){
                return res.json({
                    status : 0,
                    message : 'Login success',
                    token : utils.signJWT(_tmp,'30m')
                })
            }
            return res.json({
                status : 5,
                message : 'Invalid details'
            })
        }
    }
    
}

module.exports = authHandler();