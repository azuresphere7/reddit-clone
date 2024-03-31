import { CommentSchema } from "@/lib/validations";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { APIResponse } from "@/utils/interface";

export const commentRouter = createTRPCRouter({
  // Create a new comment to the post
  create: publicProcedure.input(CommentSchema).mutation(async ({ ctx, input }): Promise<APIResponse> => {
    try {
      await ctx.db.comment.create({
        data: {
          content: input.content,
          votes: 0,
          postId: input.postId,
          parentId: input.parentId,
          userName: input.userName,
          userAvatar: input.userAvatar,
        },
      });

      return {
        success: true,
        message: "Successfully commented!",
      };
    } catch (error) {
      return {
        success: false,
        message: "Internal Server Error!",
        error,
      };
    }
  }),
});
