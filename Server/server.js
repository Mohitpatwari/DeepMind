import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import path from "path"

const app=express();
app.use(express.json());
app.use(cors());
dotenv.config();
const __dirname=path.resolve();

const API_KEY=process.env.API_KEY;
const PORT=process.env.PORT || 3000;
app.post('/generate-content', async (req,res)=>{

    const options={
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            contents:[{
                parts:[{
                    text:req.body?.contents[0]?.parts[0]?.text
                }]
            }],
            generationConfig:{maxOutputTokens: 50}
        })
    }

    try{

        const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,options);

        const data=await response.json();

        res.json(data.candidates[0].content.parts[0].text);

    } catch(err){
        console.log("Error in fetching data",err);
    }
})

app.use(express.static(path.join(__dirname, "frontened/dist")))
app.get("*", (_,res)=>{
    res.sendFile(path.resolve(__dirname, "frontened", "dist", "index.html"))
})

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
})