import path from 'path';
import fs from 'fs';

const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) });

export default async function handler(req, res){
    const method = req?.method;
    const id = parseInt(req?.query.id);
    const recordFromBody = req?.body;
    const jsonFile = path.resolve("./", "db.json");

    switch(method){
        case "POST":
            await postMethod();
            break;
        case "PUT":
            await putMethod();
            break;
        case "DELETE":
            await deleteMethod();
            break;
        default:
            res.status(501).send(`Method ${method} not implemented`);
            console.error(`Method ${method} not implemented`);
    }

    async function putMethod(){
        try{
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const data = JSON.parse(readFileData).speakers;
            if(!data){
                res.status(404).send('Error: not found 404');
            } else{
                const newSpeakersArray = data.map((rec) => {
                    return rec.id == id ? recordFromBody : rec;
                });
                writeFile(jsonFile, JSON.stringify({speakers : newSpeakersArray}, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.status(200).send(JSON.stringify(recordFromBody,null, 2));
                console.log(`PUT  api/speakers/${id} status 200`);
            }
        } catch(e){
            console.error(`PUT error ${id}`, e);
            res.status(500).send(`PUT error ${id}`);
        } 
    }

    async function postMethod(){
        try{
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const data = JSON.parse(readFileData).speakers;
            if(!data){
                res.status(404).send('Error: not found 404');
            } else{
                const newId = data.reduce((acc, curr) => {
                    const idCurrent = parseInt(curr.id);
                    return idCurrent > acc ? idCurrent : acc;
                }, 0) + 1;

                const newSpeakerRec = { ...recordFromBody, id: newId.toString()};

                const newSpeakersArray = [newSpeakerRec, ...data];
                writeFile(jsonFile, JSON.stringify({speakers : newSpeakersArray}, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.status(200).send(JSON.stringify(newSpeakerRec,null, 2));
                console.log(`POST  api/speakers/${id} status 200`);
            }
        } catch(e){
            console.error(`POST error ${id}`, e);
            res.status(500).send(`POST error ${id}`);
        } 
    }

    async function deleteMethod(){
        try{
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const data = JSON.parse(readFileData).speakers;
            if(!data){
                res.status(404).send('Error: not found 404');
            } else{
                const newSpeakersArray = data.filter((rec) => {
                    return rec.id != id;
                });
                writeFile(jsonFile, JSON.stringify({speakers : newSpeakersArray}, null, 2));
                res.setHeader("Content-Type", "application/json");
                res.status(200).send(JSON.stringify(data.find(rec => rec.id ==id),null, 2));
                console.log(`DELETE  api/speakers/${id} status 200`);
            }
        } catch(e){
            console.error(`DELETE error ${id}`, e);
            res.status(500).send(`DELETE  error ${id}`);
        } 
    }

}