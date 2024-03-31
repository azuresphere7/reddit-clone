"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import UpvoteIcon from "@/components/icons/UpvoteIcon";
import DownvoteIcon from "@/components/icons/DownvoteIcon";
import { checkVoteStatus, formatDate } from "@/lib/utils";
import type { RootState } from "@/redux";
import { getUserState } from "@/redux/userSlice";
import { api } from "@/trpc/react";
import { POST_TYPE, VOTE_TYPE } from "@/utils/enums";
import type { APIResponse, Post } from "@/utils/interface";

const PostList = ({ data }: { data: Post }) => {
  const { id, title, description, userName, userAvatar, votes, voters, createdAt } = data;
  const user = useSelector((store: RootState) => getUserState(store));
  const router = useRouter();

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

  const [isVotting, setIsVotting] = React.useState(false);

  const upvotePost = () => {
    setIsVotting(true);

    mutation.mutate({
      postId: id ?? 0,
      postType: POST_TYPE.POST,
      userId: user?.id ?? "",
      score: 1,
    });
  };

  const downvotePost = () => {
    setIsVotting(true);

    mutation.mutate({
      postId: id ?? 0,
      postType: POST_TYPE.POST,
      userId: user?.id ?? "",
      score: -1,
    });
  };

  return (
    <div className="w-full px-4 md:w-[600px] md:px-0">
      <div className="my-10 flex w-full">
        <div className="mx-2 flex h-20 flex-col items-center justify-between">
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

        <div className="ml-2 flex w-full cursor-pointer flex-col ">
          <div className="flex items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage src={userAvatar} alt="avatar" />
              <AvatarFallback>{userName.slice(0, 1)}</AvatarFallback>
            </Avatar>

            <p className="ml-2 text-sm text-gray-700">
              Posted by {userName} {formatDate(createdAt)}
            </p>
          </div>

          <Link href={`/posts/${id}`} className="py-2 hover:text-primary">
            {title}
          </Link>

          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <Separator />
    </div>
  );
};

export default PostList;
