CREATE TABLE "rag_document_embeddings" (
    "id" TEXT NOT NULL,
    "chunkKey" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceLabel" TEXT,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" vector(2048),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rag_document_embeddings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "rag_document_embeddings_chunkKey_key" ON "rag_document_embeddings"("chunkKey");
CREATE INDEX "idx_rag_document_embeddings_sourceType" ON "rag_document_embeddings"("sourceType");
CREATE INDEX "idx_rag_document_embeddings_sourceId" ON "rag_document_embeddings"("sourceId");