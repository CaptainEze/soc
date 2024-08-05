
class XenonValidator {
    validateEmail = (text)=>{
        if(text==''||text==undefined||text==null) return [false,'Field is empty'];
        else if(text.substr(0) == '.') return [false,'email cannot start with a .'];
        else if(!text.match(/@/g)) return [false,'@ required in an email'];
        else if(text.match(/@/g).length>1) return [false,'more than one occurence of @'];
        else if(text.match(/\.\./g)) return [false,'.. double dots invalid'];
        else{
            let [name,domain] = text.split('@');
            if(name == ''||name == 'undefined') return [false,'name part of email before @ cannot be empty'];
            if(domain.substr(0)=='.') return [false,'domain cannot start with a .'];
            if(domain.match(/[^-a-zA-Z0-9\._]/)) return [false, 'invalid character string in the domain'];
            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) return [true,'valid email'];
            else return [false,'invalid email'];
        }
    }

    validateName = (text)=>{
        if(text == ''||text==undefined||text==null) return [false,'Field is empty'];
        else{
            if(/^[A-Za-z\s\-']+$/.test(text)) return [true,'valid name'];
            else return [false,'invalid name'];
        }
    }

    validatePassword = (text,mi=8,ma=16,nu=true,uc=true,sp=true)=>{
        if(text == ''||text==undefined||text==null) return [false,'Field is empty'];
        else if(text.length<mi||text.length>ma) return [false,`password must be between ${mi} and ${ma}`];
        if(nu && !/[0-9]/.test(text)) return [false, 'password must contain at least one number'];
        if(uc && !/[A-Z]/.test(text)) return [false, 'password must contain at least one uppercase letter'];
    if(sp && !/[!@#$%^&*/]/.test(text)) return [false, 'password must contain at least one special character'];
        return [true,'password is valid'];
    }

    validteFileType = (fileName,validExtensions)=>{
        let fileTypes = validExtensions.split(','), fileExt = fileName.split('.')[fileName.split('.').length-1],state=false;
        
        fileTypes.forEach(el=>{
            if(el === fileExt) state = true;
        })
        return state;
    }
}
const XenonValidate = new XenonValidator();
module.exports = XenonValidate;