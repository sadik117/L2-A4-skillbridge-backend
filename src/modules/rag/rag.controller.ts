import { Request, Response } from "express";
import { RAGService } from "./rag.service";

const ragService = new RAGService();

const ingestTutors = async (req: Request, res: Response) => {

  const result = await ragService.ingestTutorsData();

  res.status(200).json({
    success: true,
    message: "Tutors data ingesetion completed!",
    data: result,
  });
};


const queryRag = async (req: Request, res: Response) => {
  const { query, limit, sourceType } = req.body;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Query is required",
    });
  }

  const result = await ragService.generateAnswer(
    query,
    limit ?? 5,
    sourceType,
    true,
  );

  res.status(200).json({
    success: true,
    message: "Answer generated successfully!",
    data: result,
  });
};

export const ragController = {
  ingestTutors,
  queryRag,
};