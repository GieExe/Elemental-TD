import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.post("/api/players", async (req, res) => {
  const { email, name } = req.body;
  const player = await prisma.player.upsert({
    where: { email },
    update: { name },
    create: { email, name }
  });
  res.json(player);
});

app.post("/api/score", async (req, res) => {
  const { email, score } = req.body;
  const player = await prisma.player.findUnique({ where: { email }});
  if (!player) return res.status(404).json({ error: "no player" });
  await prisma.score.create({ data: { playerId: player.id, score }});
  if (score > player.bestScore) {
    await prisma.player.update({ where: { id: player.id }, data: { bestScore: score }});
  }
  res.json({ ok: true });
});

app.get("/api/leaderboard", async (req, res) => {
  const top = await prisma.player.findMany({
    orderBy: { bestScore: "desc" },
    take: 20,
    select: { name: true, bestScore: true }
  });
  res.json(top);
});

app.listen(4000, ()=> console.log("API running on :4000"));
