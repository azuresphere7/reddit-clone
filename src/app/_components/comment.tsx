"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

import ReplyTextarea from "@/app/_components/reply-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpvoteIcon from "@/components/icons/UpvoteIcon";
import DownvoteIcon from "@/components/icons/DownvoteIcon";
import ReplyIcon from "@/components/icons/CommentIcon";

import { api } from "@/trpc/react";
import { checkVoteStatus, formatDate } from "@/lib/utils";
import { POST_TYPE, ROUTES, VOTE_TYPE } from "@/utils/enums";
import type { APIResponse, Comment } from "@/utils/interface";
import type { RootState } from "@/redux";
import { getUserState } from "@/redux/userSlice";
import { toast } from "sonner";

const CommentPost = ({ data }: { data: Comment }) => {
  const { id, content, userName, userAvatar, votes, voters, postId, children, createdAt } = data;

  const router = useRouter();
  const user = useSelector((store: RootState) => getUserState(store));

  // tRPC mutation for handling comment upvote and downvote
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

  const [isReplyOpen, SetIsReplyOpen] = React.useState(false);
  const [isVotting, setIsVotting] = React.useState(false);

  const upvotePost = () => {
    setIsVotting(true);

    mutation.mutate({
      postId: id ?? 0,
      postType: POST_TYPE.COMMENT,
      userId: user.id,
      score: 1,
    });
  };

  const downvotePost = () => {
    setIsVotting(true);

    mutation.mutate({
      postId: id ?? 0,
      postType: POST_TYPE.COMMENT,
      userId: user.id,
      score: -1,
    });
  };

  // Toggle reply textarea visibility
  const toggleReplyOpen = () => SetIsReplyOpen(!isReplyOpen);

  return (
    <div className="my-6 w-full">
      <div className="flex w-full">
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

          <p className="my-3 text-sm">{content}</p>
        </div>
      </div>

      <div className="flex items-center px-2">
        <button
          className={`${isVotting ? "cursor-wait" : checkVoteStatus(voters, user) === VOTE_TYPE.UPVOTE ? "[&_path]:stroke-primary" : "[&_path]:hover:stroke-primary"}`}
          disabled={isVotting}
          onClick={upvotePost}
        >
          <UpvoteIcon color="black" />
        </button>

        <p className="mx-3">{votes}</p>

        <button
          className={`${isVotting ? "cursor-wait" : checkVoteStatus(voters, user) === VOTE_TYPE.DOWNVOTE ? "[&_path]:stroke-primary" : "[&_path]:hover:stroke-primary"}`}
          disabled={isVotting}
          onClick={downvotePost}
        >
          <DownvoteIcon color="black" />
        </button>

        <button
          onClick={() => (user ? toggleReplyOpen() : router.push(ROUTES.SIGN_IN))}
          className={`ml-6 flex items-center hover:text-primary [&_path]:hover:stroke-primary ${isReplyOpen && "text-primary [&_path]:stroke-primary"}`}
        >
          <ReplyIcon color="black" />
          <p className="ml-2">Reply</p>
        </button>
      </div>

      {isReplyOpen && <ReplyTextarea postId={postId} parentId={id} toggleOpen={toggleReplyOpen} />}

      {children &&
        children.length > 0 &&
        children.map((comment: Comment) => (
          <div key={comment.id} className="pl-12">
            <CommentPost data={comment} />
          </div>
        ))}
    </div>
  );
};

export default CommentPost;
