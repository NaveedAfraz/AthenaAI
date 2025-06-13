import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useCallback, useMemo, useRef, useEffect } from "react";

// Cache for stable query keys
const queryKeys = {
  chatList: (userId) => ["chatlist", userId],
  messages: (chatId) => ["getMessages", chatId],
};

// Memoize the API base URL to prevent recreating the string
const getApiUrl = () =>
  `${import.meta.env.VITE_API_URL || "http://localhost:3006"}`;

export function useChatList() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoize query options to prevent unnecessary re-renders
  const queryOptions = useMemo(
    () => ({
      queryKey: queryKeys.chatList(userId),
      queryFn: async () => {
        if (!userId) return [];

        try {
          const { data } = await axios.get(
            `${getApiUrl()}/api/get-chatList/${userId}`,
            {
              withCredentials: true,
              // Add request cancellation
              signal: new AbortController().signal,
            }
          );
          return Array.isArray(data?.data) ? data.data : [];
        } catch (error) {
          if (axios.isCancel(error)) {
            return [];
          }
          console.error("Error fetching chat list:", error);
          throw error;
        }
      },
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: "always", // Changed to 'always' to ensure fresh data on mount
      refetchOnReconnect: "always",
      retry: 1, // Reduced retry count
      retryDelay: 1000,
    }),
    [userId]
  );

  // Fetch chat list with optimized settings
  const {
    data: chatList = [],
    isLoading,
    isError,
    refetch: refetchChatList,
  } = useQuery({
    ...queryOptions,
    // Add a custom refetch function that respects the mounted state
    refetch: async () => {
      if (!isMountedRef.current) return { data: [] };
      return queryOptions.queryFn();
    },
  });

  // Create new chat mutation with optimized settings
  const { mutate: createChat, isPending: isCreating } = useMutation({
    mutationFn: useCallback(async () => {
      if (!userId) throw new Error("User ID is required");

      const { data } = await axios.post(
        `${getApiUrl()}/api/add-chat`,
        { userId },
        {
          withCredentials: true,
          signal: new AbortController().signal,
        }
      );
      return data;
    }, [userId]),

    onMutate: async () => {
      if (!isMountedRef.current) return { previousChats: [] };

      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: queryKeys.chatList(userId) });

      // Snapshot the previous value
      const previousChats =
        queryClient.getQueryData(queryKeys.chatList(userId)) || [];

      // Optimistically update the cache
      const tempId = `temp-${Date.now()}`;
      const newChat = {
        ConversationsID: tempId,
        Title: "New Chat",
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      queryClient.setQueryData(queryKeys.chatList(userId), (old = []) => [
        newChat,
        ...old,
      ]);

      return { previousChats, tempId };
    },

    onSuccess: useCallback(
      (data, _, context) => {
        if (!isMountedRef.current) return;

        // Update the temporary chat with the real data
        if (context?.tempId) {
          queryClient.setQueryData(queryKeys.chatList(userId), (old = []) =>
            old.map((chat) =>
              chat.ConversationsID === context.tempId
                ? { ...data, isOptimistic: false }
                : chat
            )
          );
        }

        // Invalidate the chat list query to ensure we have the latest data
        queryClient.invalidateQueries({
          queryKey: queryKeys.chatList(userId),
          refetchType: "active", // Only refetch if the data is being observed
        });

        return data.conversationId;
      },
      [queryClient, userId]
    ),

    onError: useCallback(
      (error, _, context) => {
        if (!isMountedRef.current) return;

        console.error("Error creating chat:", error);

        // Rollback on error
        if (context?.previousChats) {
          queryClient.setQueryData(
            queryKeys.chatList(userId),
            context.previousChats
          );
        }

        throw error;
      },
      [queryClient, userId]
    ),

    // Always invalidate queries after error or success
    onSettled: useCallback(() => {
      if (!isMountedRef.current) return;

      queryClient.invalidateQueries({
        queryKey: queryKeys.chatList(userId),
        refetchType: "active",
      });
    }, [queryClient, userId]),

    // Optimize performance
    retry: 1,
    retryDelay: 1000,
  });

  // Return stable references
  return useMemo(
    () => ({
      chatList: Array.isArray(chatList) ? chatList : [],
      isLoading,
      isError,
      refetch: refetchChatList,
      createChat,
      isCreating,
    }),
    [chatList, isLoading, isError, refetchChatList, createChat, isCreating]
  );
}
