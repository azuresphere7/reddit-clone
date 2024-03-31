"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpvoteIcon from "@/components/icons/UpvoteIcon";
import DownvoteIcon from "@/components/icons/DownvoteIcon";
import { api } from "@/trpc/react";
import { getUserState } from "@/redux/userSlice";
import { checkVoteStatus as checkVoteStatus, formatDate } from "@/lib/utils";
import type { RootState } from "@/redux";
import type { APIResponse, Post } from "@/utils/interface";
import { POST_TYPE, VOTE_TYPE } from "@/utils/enums";

const PostContent = ({ data }: { data: Post }) => {
  const { id, title, content, votes, voters, userName, userAvatar, createdAt } = data;

  // tRPC mutation for handling post upvote and downvote
  const mutation = api.post.vote.useMutation({
    onSuccess: (response: APIResponse) => {
      setIsVotting(false);
      toast(response.message);

      router.refresh(); // Refresh server-side components
    },
    onError: (error) => {
      toast(error.message);
      console.log(error);
    },
  });

  const router = useRouter();
  const user = useSelector((store: RootState) => getUserState(store));
  const [isVotting, setIsVotting] = React.useState(false);

  const upvotePost = () => {
    setIsVotting(true);

    mutation.mutate({
      postId: id ?? 0,
      postType: POST_TYPE.POST,
      userId: user.id,
      score: 1,
    });
  };

  const downvotePost = () => {
    setIsVotting(true);

    mutation.mutate({
      postId: id ?? 0,
      postType: POST_TYPE.POST,
      userId: user.id,
      score: -1,
    });
  };

  return (
    <div className="w-full px-4 md:w-[600px] md:px-0">
      <div className="my-2 flex w-full">
        <div className="mx-2 flex h-24 flex-col items-center justify-between">
          <button
            className={`${isVotting ? "cursor-wait" : checkVoteStatus(voters, user) === VOTE_TYPE.UPVOTE ? "[&_path]:stroke-primary" : "[&_path]:hover:stroke-primary"}`}
            disabled={isVotting}
            onClick={upvotePost}
          >
            <UpvoteIcon color="black" />
          </button>

          <p>{votes}</p>

          <button
            className={`${isVotting ? "cursor-wait" : checkVoteStatus(voters, user) === VOTE_TYPE.DOWNVOTE ? "[&_path]:stroke-primary" : "[&_path]:hover:stroke-primary"}`}
            disabled={isVotting}
            onClick={downvotePost}
          >
            <DownvoteIcon color="black" />
          </button>
        </div>

        <div className="ml-2 flex w-full flex-col">
          <div className="flex items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage src={userAvatar} alt="avatar" />
              <AvatarFallback>{userName.slice(0, 1)}</AvatarFallback>
            </Avatar>

            <p className="ml-2 text-sm text-gray-700">
              Posted by {userName} {formatDate(createdAt)}
            </p>
          </div>

          <h1 className="py-2">{title}</h1>

          <p className="whitespace-pre-line text-sm text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
