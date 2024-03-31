import { z } from "zod";
import type { PrismaClient } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PostSchema, VoteSchema } from "@/lib/validations";
import { POST_TYPE } from "@/utils/enums";
import type { Post, Comment, Vote, APIResponse } from "@/utils/interface";

// Fetch 2nd level comments of the post with vote data
const getFirstComments = async (db: PrismaClient, postId: number) => {
  const children: Comment[] = await db.comment.findMany({ where: { postId, parentId: null } });

  if (children.length === 0) {
    return [];
  }

  const nestedChildren = await Promise.all(
    children.map(async (child: Comment) => {
      const newChildren = await fetchNestedChildren(db, child.id);
      const voteUsers: Vote[] = await db.vote.findMany({
        where: { postType: POST_TYPE.COMMENT, postId: child.id },
      });

      return {
        ...child,
        votes: voteUsers.reduce((sum: number, vote: Vote) => sum + vote.score, 0),
        voters: voteUsers,
        children: newChildren,
      };
    }),
  );

  return nestedChildren;
};

// Fetch other level child comments using recursion function calling
const fetchNestedChildren = async (db: PrismaClient, parentId: number) => {
  const children: Comment[] = await db.comment.findMany({
    where: { parentId, id: { not: parentId } },
  });

  if (children.length === 0) {
    return [];
  }

  const nestedChildren: Comment[] = await Promise.all(
    children.map(async (child: Comment) => {
      const newChildren = await fetchNestedChildren(db, child.id);
      const voteUsers: Vote[] = await db.vote.findMany({
        where: { postId: child.id },
      });

      return {
        ...child,
        voteUsers,
        votes: voteUsers.reduce((sum: number, vote: Vote) => sum + vote.score, 0),
        children: newChildren,
      };
    }),
  );

  return nestedChildren;
};

export const postRouter = createTRPCRouter({
  // Return all posts or with specific user Id
  get: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }): Promise<APIResponse> => {
      try {
        const postList: Post[] = await ctx.db.post.findMany({
          where: input.userId ? { userId: input.userId } : {},
          orderBy: { createdAt: "desc" },
        });

        const posts = await Promise.all(
          postList.map(async (post) => {
            const voteUsers: Vote[] = await ctx.db.vote.findMany({
              where: { postType: POST_TYPE.POST, postId: post.id },
            });

            return {
              ...post,
              votes: voteUsers.reduce((sum: number, vote: Vote) => sum + vote.score, 0),
              voters: voteUsers,
            };
          }),
        );

        return {
          success: true,
          result: posts,
        };
      } catch (error) {
        return {
          success: false,
          message: "Internal Server Error!",
          error,
        };
      }
    }),

  // Find post by Id
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }): Promise<APIResponse> => {
    const { id } = input;

    try {
      const post = await ctx.db.post.findUnique({ where: { id } });
      const voteUsers: Vote[] = await ctx.db.vote.findMany({
        where: { postId: id },
      });
      const children = await getFirstComments(ctx.db, id);

      if (post) {
        return {
          success: true,
          result: {
            ...post,
            votes: voteUsers.reduce((sum: number, vote: Vote) => sum + vote.score, 0),
            voters: voteUsers,
            children,
          },
        };
      } else {
        return {
          success: false,
          message: "Post Not Found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Internal Server Error!",
        error,
      };
    }
  }),

  // Create a new post
  create: publicProcedure.input(PostSchema).mutation(async ({ ctx, input }): Promise<APIResponse> => {
    try {
      await ctx.db.post.create({
        data: {
          title: input.title,
          description: input.content.slice(0, 72),
          content: input.content,
          userId: input.userId,
          userName: input.userName,
          userAvatar: input.userAvatar,
          votes: 0,
        },
      });

      return {
        success: true,
        message: "Successfully Posted!",
      };
    } catch (error) {
      return {
        success: false,
        message: "Internal Server Error!",
        error,
      };
    }
  }),

  // Vote to the post
  vote: publicProcedure.input(VoteSchema).mutation(async ({ ctx, input }): Promise<APIResponse> => {
    const { postId, postType, userId, score } = input;

    try {
      const vote: Vote | null = await ctx.db.vote.findUnique({ where: { voteId: { postId, postType } } });

      if (vote) {
        await ctx.db.vote.update({ where: { id: vote.id }, data: { score: score === vote.score ? 0 : score } });
      } else {
        await ctx.db.vote.create({ data: { postId, postType, userId, score: score ?? 0 } });
      }

      return {
        success: true,
        message: "Successfully voted!",
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: "Internal Server Error!",
        error,
      };
    }
  }),
});
