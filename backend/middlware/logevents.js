const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logevents=async(message,logname)=>{
    const dateTime=`${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`;
    const logitem=`${dateTime}\t${uuid}\n`;

    try{

        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs'));
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logname),logitem);
    }catch(e){
        console.log(e);
    }

}

const logger=(req,res,next)=>{
    logevents(`${req.method}\t${req.header.origin}\t${req.url}`,'reqLog.txt');
    
}
module.exports={logger,logevents};