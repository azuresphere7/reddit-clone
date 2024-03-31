import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { VOTE_TYPE } from "@/utils/enums";
import type { User, Vote } from "@/utils/interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check the current vote status of the post with the user
export function checkVoteStatus(voters: Vote[] | undefined, user: User): VOTE_TYPE {
  const vote = voters?.find((vote: Vote) => vote.userId === user.id);
  return vote ? vote.score : 0;
}

// Format posted date
export function formatDate(date: Date) {
  const currentDate: Date = new Date();
  const differenceInTime: number = currentDate.getTime() - date.getTime();

  const oneMinute: number = 60 * 1000;
  const oneHour: number = 60 * oneMinute;
  const oneDay: number = 24 * oneHour;

  if (differenceInTime < oneHour) {
    const differenceInMinutes: number = Math.round(differenceInTime / oneMinute);
    return `${differenceInMinutes} mins ago`;
  } else if (differenceInTime < oneDay) {
    const differenceInHours: number = Math.round(differenceInTime / oneHour);
    return `${differenceInHours} hours ago`;
  } else {
    const differenceInDays: number = Math.round(differenceInTime / oneDay);
    if (differenceInDays === 0) {
      return "today";
    } else {
      return `${differenceInDays} days ago`;
    }
  }
}
