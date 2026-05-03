import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";

const toVectorLiteral = (vector: number[]) => `[${vector.join(",")}]`;

export class IndexingService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  async indexDocument(
    chunkKey: string,
    sourceType: string,
    sourceId: string,
    content: string,
    sourceLabel?: string,
    metadata?: Record<string, unknown>,
  ) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
      const vectorLiteral = toVectorLiteral(embedding);

      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO "rag_document_embeddings"
        (
          "id",
          "chunkKey",
          "sourceType",
          "sourceId",
          "sourceLabel",
          "content",
          "metadata",
          "embedding",
          "updatedAt"
        )
        VALUES
        (
          ${Prisma.raw("gen_random_uuid()")},
          ${chunkKey},
          ${sourceType},
          ${sourceId},
          ${sourceLabel || null},
          ${content},
          ${JSON.stringify(metadata || {})} :: jsonb,
          CAST(${vectorLiteral} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
          "sourceType" = EXCLUDED."sourceType",
          "sourceId" = EXCLUDED."sourceId",
          "sourceLabel" = EXCLUDED."sourceLabel",
          "content" = EXCLUDED."content",
          "metadata" = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW()
        `);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async indexTutorsData() {
    try {
      console.log("Fetching tutors data for indexing....");
      const tutors = await prisma.tutorProfile.findMany({
        where: {
          user: {
            status: "ACTIVE",
          },
        },
        include: {
          user: true,
          category: true,
          reviews: true,
        },
      });

      let indexedCount = 0;

      for (const tutor of tutors) {
        // Calculate average rating
        const avgRating =
          tutor.reviews.length > 0
            ? Number(
              (
                tutor.reviews.reduce((acc, r) => acc + r.rating, 0) /
                tutor.reviews.length
              ).toFixed(1),
            )
            : 0;

        // Format reviews
        const reviewsText =
          tutor.reviews.length > 0
            ? tutor.reviews
              .map((r) => `- Rating: ${r.rating}/5. Comment: ${r.comment}`)
              .join("\n")
            : "No reviews yet.";

        const content = `Tutor Name: ${tutor.user.name}
            Experience: ${tutor.experience} years
            Hourly Rate: $${tutor.hourlyRate}
            Category: ${tutor.category.name}
            Bio: ${tutor.bio}
            Average Rating: ${avgRating}/5

            Student Reviews:
            ${reviewsText}`;

        const metadata = {
          tutorId: tutor.id,
          userId: tutor.userId,
          name: tutor.user.name,
          category: tutor.category.name,
          averageRating: avgRating,
          experience: tutor.experience,
          hourlyRate: tutor.hourlyRate,
        };

        const chunkKey = `tutor-${tutor.id}`;

        await this.indexDocument(
          chunkKey,
          "TUTOR",
          tutor.id,
          content,
          tutor.user.name,
          metadata,
        );

        indexedCount++;
      }

      // console.log(`Successfully Indexed ${indexedCount} tutors.`);

      return {
        success: true,
        message: `Successfully Indexed ${indexedCount} tutors.`,
        indexedCount,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}