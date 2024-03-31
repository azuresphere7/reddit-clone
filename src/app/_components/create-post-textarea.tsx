"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Loader from "@/app/_components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type AutosizeTextAreaRef, AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { RootState } from "@/redux";
import { getUserState } from "@/redux/userSlice";
import type { APIResponse } from "@/utils/interface";

const CreatePostTextArea = () => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const textAreaRef = React.useRef<AutosizeTextAreaRef>(null);

  const router = useRouter();
  const user = useSelector((store: RootState) => getUserState(store));

  // tRPC mutation for creating a new post
  const mutation = api.post.create.useMutation({
    onSuccess: (response: APIResponse) => {
      setTitle("");
      setContent("");
      setIsLoading(false);
      if (textAreaRef.current) textAreaRef.current.textArea.style.height = "55px"; // Set textarea height to origin

      toast(response.message);
      router.refresh(); // Refresh server-side components
    },
    onError: (error) => {
      setIsLoading(false);
      toast(error.message);

      console.log(error);
    },
  });

  const createPost = () => {
    if (title && content) {
      setIsLoading(true);

      mutation.mutate({
        title,
        content,
        userId: user.id,
        userName: user.name,
        userAvatar: user.imageUrl,
      });
    } else {
      toast("Please fill out the title and the content.");
    }
  };

  return (
    <div className="flex w-full rounded-xl border border-gray-200 p-4 shadow-lg shadow-gray-100">
      <div className="mr-4 flex items-start justify-start">
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-grow flex-col">
        <input
          placeholder="Title of your post"
          className="mb-2 outline-none"
          value={title}
          onChange={({ target: { value } }) => setTitle(value)}
          disabled={isLoading}
        />

        <AutosizeTextarea
          ref={textAreaRef}
          placeholder="Share your thoughts with the world!"
          className="resize-none rounded-none border-0 border-b border-gray-300 p-0 text-base tracking-wider focus-visible:border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={content}
          onChange={({ target: { value } }) => setContent(value)}
          disabled={isLoading}
        />

        <div className="flex w-full justify-end">
          <Button className="mt-4 h-10 w-16 rounded-lg text-sm text-white" disabled={isLoading} onClick={createPost}>
            {isLoading ? <Loader /> : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostTextArea;
