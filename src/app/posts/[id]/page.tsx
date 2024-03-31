import Link from "next/link";
import React from "react";
import { currentUser } from "@clerk/nextjs";

import PostContent from "@/app/_components/post-content";
import ReplyTextarea from "@/app/_components/reply-textarea";
import CommentPost from "@/app/_components/comment";
import { Separator } from "@/components/ui/separator";
import BackIcon from "@/components/icons/BackIcon";
import { api } from "@/trpc/server";
import type { PostContentPageProps, Comment, Post } from "@/utils/interface";

// Server side component
export default async function PostContentPage(props: PostContentPageProps) {
  const { id } = props.params; // Get post id from the route url
  const user = await currentUser();
  const post: Post = (await api.post.getById.query({ id: Number(id) })).result; // Fetch post data by Id

  return (
    <div className="flex w-full flex-col items-end px-4 md:w-[600px] md:px-0">
      <div className="w-full px-2 py-6">
        <Link href={"/"} className="flex cursor-pointer items-center hover:text-primary [&_path]:hover:stroke-primary">
          <BackIcon color="black" />
          <p className="ml-4">Back to posts</p>
        </Link>
      </div>

      {post && <PostContent data={post} />}
      {user && <ReplyTextarea postId={Number(id)} />}

      <h1 className="mb-4 mt-8 w-full px-2">All comments</h1>
      <Separator className="h-[1px] w-full bg-gray-200" />

      <div className="w-full pb-16">
        {post?.children && post.children.length > 0 ? (
          post.children.map((comment: Comment) => <CommentPost key={comment.id} data={comment} />)
        ) : (
          <p className="w-full p-2 text-gray-400">No comments for this post</p>
        )}
      </div>
    </div>
  );
}
