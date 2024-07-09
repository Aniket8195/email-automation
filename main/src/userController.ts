import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { decode } from "jsonwebtoken";
const router = express.Router();
const prisma = new PrismaClient();

router.get('/user/details/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/user/addTemplate',async(req:Request,res:Response)=>{
   try {
    const {name , label, subject , body} = req.body;
    const jwt= req.headers.authorization||'';
    const token=jwt.split(' ')[1];
    const decoded:any=decode(token);
    const userId=decoded.userId;
    console.log(userId);
    console.log(name);
    console.log(label);
    console.log(subject);
    console.log(body);

   const template=await prisma.template.create(
    {
        data:{
            name:name,
            label:label,
            subject:subject,
            body:body,
            userId:userId
        }
    }
   );
   console.log(template);
   res.status(200).json(template);
   } catch (error:any) {
    res.status(500).json({error:error.message});
    console.log(error);
   }

});

router.get('/user/getTemplates',async(req:Request,res:Response)=>{
    try {
        const jwt= req.headers.authorization||'';
        const token=jwt.split(' ')[1];
        const decoded:any=decode(token);
        const userId=decoded.userId;
        const templates=await prisma.user.findUnique({
            where:{id:userId}
        }).templates();
        res.status(200).json(templates);
    } catch (error:any) {
        res.status(500).json({error:error.message});
    }
});
router.post('/user/scheduleMail',async(req:Request, res:Response)=>{
   try {
    const {templateId,recipient,subject ,body ,sendAt}=req.body;
    const jwt= req.headers.authorization||'';
    const token=jwt.split(' ')[1];
    const decoded:any=decode(token);
    const userId=decoded.userId;
    const schedule=await prisma.schedule.create({
        data:{
            userId:userId,
            templateId:templateId,
            recipient:recipient,
            subject:subject,
            body:body,
            sendAt:sendAt,
            status:1
            
        }
    });
    res.status(200).json(schedule);
   } catch (error:any) {
    res.status(500).json({error:error.message});
   }
});
router.get('/user/getScheduledMails',async(req:Request,res:Response)=>{
    try {
        const jwt= req.headers.authorization||'';
        const token=jwt.split(' ')[1];
        const decoded:any=decode(token);
        const userId=decoded.userId;
        const schedules=await prisma.user.findUnique({
            where:{id:userId}
        }).schedules();
        res.status(200).json(schedules);
    } catch (error:any) {
        res.status(500).json({error:error.message});
    }
});
router.post('/user/updateScheduledMail',async(req:Request,res:Response)=>{
    try {
        const {scheduleId,recipient,subject,body,sendAt}=req.body;
        const schedule=await prisma.schedule.update({
            where:{id:scheduleId},
            data:{
                recipient:recipient,
                subject:subject,
                body:body,
                sendAt:sendAt
            }
        });
        res.status(200).json(schedule);
    } catch (error:any) {
        res.status(500).json({error:error.message});
    }
});
router.post('/user/deleteScheduledMail',async(req:Request,res:Response)=>{
    try {
        const {scheduleId}=req.body;
        const schedule=await prisma.schedule.delete({
            where:{id:scheduleId}
        });
        res.status(200).json(schedule);
    } catch (error:any) {
        res.status(500).json({error:error.message});
    }
});
router.post('/user/deleteTemplate',async(req:Request,res:Response)=>{
    try {
        const {templateId}=req.body;
        const template=await prisma.template.delete({
            where:{id:templateId}
        });
        res.status(200).json(template);
    } catch (error:any) {
        res.status(500).json({error:error.message});
    }
});
export default router;
