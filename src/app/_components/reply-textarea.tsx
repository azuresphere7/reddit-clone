"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import Loader from "@/app/_components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type AutosizeTextAreaRef, AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { api } from "@/trpc/react";
import type { RootState } from "@/redux";
import { getUserState } from "@/redux/userSlice";
import type { APIResponse } from "@/utils/interface";

const ReplyTextarea = ({
  postId,
  parentId,
  toggleOpen,
}: {
  postId: number;
  parentId?: number;
  toggleOpen?: () => void;
}) => {
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const textAreaRef = React.useRef<AutosizeTextAreaRef>(null);

  const user = useSelector((store: RootState) => getUserState(store));
  const router = useRouter();

  // tRPC mutation for adding a new comment to the post
  const mutation = api.comment.create.useMutation({
    onSuccess: (response: APIResponse) => {
      setContent("");
      setIsLoading(false);
      if (toggleOpen) toggleOpen();
      if (textAreaRef.current) textAreaRef.current.textArea.style.height = "55px"; // set textarea height to origin

      toast(response.message);
      router.refresh(); // Refresh server-side components
    },
    onError: (error) => {
      setIsLoading(false);
      toast(error.message);
      console.log(error);
    },
  });

  const postComment = () => {
    if (content) {
      setIsLoading(true);

      mutation.mutate({
        content,
        postId,
        parentId: parentId && parentId,
        userName: user.name,
        userAvatar: user.imageUrl,
      });
    } else {
      // toast an alert when input is empty
      toast("Please fill out the comment.");
    }
  };

  return (
    <div className="my-4 flex w-full rounded-xl border border-[#E5E7EB] p-4 shadow-md shadow-gray-100">
      <div className="mr-4 flex items-start justify-start">
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.imageUrl} alt="avatar" />
          <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-grow flex-col">
        <AutosizeTextarea
          placeholder="Comment your thoughts"
          className="resize-none rounded-none border-0 border-b border-gray-300 p-0 text-sm focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={content}
          onChange={({ target: { value } }) => setContent(value)}
          disabled={isLoading}
        />

        <div className="flex w-full justify-end">
          <Button className="mt-3 h-10 w-24 rounded-lg text-sm text-white" disabled={isLoading} onClick={postComment}>
            {isLoading ? <Loader /> : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReplyTextarea;
