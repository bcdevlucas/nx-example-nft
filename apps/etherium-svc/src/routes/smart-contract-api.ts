import express from 'express';
const router = express.Router();

import * as logic from '../service/logic';

router.get("/", async (req,res,next) => {
    const message = await logic.getMessage();
    res.send(message);
})

router.post("/", async (req,res, next) => {
  const message = await logic.setMessage(req.body.message);
  // res.send(message.transactionHash);
})

export default router;
