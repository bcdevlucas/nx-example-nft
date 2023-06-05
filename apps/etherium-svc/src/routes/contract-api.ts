import express from 'express';
import compile from '../service/compile';
import deploy from '../service/deploy';
const router = express.Router();

// Compile the contract
router.post("/compile", async function (req, res, next) {
  const result = compile();
  res.send(result);
});

// Deploy the contract
router.post("/deploy", async function (req, res, next) {
  const result = await deploy("Namaste");
  res.send(JSON.parse(result).address);
});

export default router;
