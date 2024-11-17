import { defineStore } from "pinia";
import type { ExchangeRequest } from "../services/RequestsService";
import services from "../services";

interface RequestsState {
  userRequests: ExchangeRequest[];
  loading: boolean;
  error: string | null;
}

export const useRequestsStore = defineStore("requests", {
  state: (): RequestsState => ({
    userRequests: [],
    loading: false,
    error: null,
  }),

  getters: {
    getUserRequests: (state) => state.userRequests,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    updateRequestsInLocalState(requestId: string, request: any) {
      // Update the request in the local state
      const index = this.userRequests.findIndex((req) => req.id === requestId);
      if (index !== -1) {
        this.userRequests[index] = request;
      }
    },
    async fetchUserRequests(userId: string) {
      if (!services.RequestsService()) {
        throw new Error("RequestsService not initialized");
      }

      this.loading = true;
      this.error = null;

      try {
        const response: any = await services
          .RequestsService()
          ?.getUserRequests(userId);
        this.userRequests = response?.data || [];
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch requests";
        console.error("Error fetching user requests:", error);
      } finally {
        this.loading = false;
      }
    },

    async acceptRequest(requestId: string, userId: string) {
      if (!services.RequestsService()) {
        throw new Error("RequestsService not initialized");
      }

      this.loading = true;
      this.error = null;

      try {
        const response: any = await services
          .RequestsService()
          ?.acceptRequest(requestId, userId);
        this.updateRequestsInLocalState(requestId, response.data);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to accept request";
        console.error("Error accepting request:", error);
      } finally {
        this.loading = false;
      }
    },

    async rejectRequest(requestId: string, userId: string) {
      if (!services.RequestsService()) {
        throw new Error("RequestsService not initialized");
      }

      this.loading = true;
      this.error = null;

      try {
        const response: any = await services
          .RequestsService()
          ?.rejectRequest(requestId, userId);
        this.updateRequestsInLocalState(requestId, response.data);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to reject request";
        console.error("Error rejecting request:", error);
      } finally {
        this.loading = false;
      }
    },

    async cancelRequest(requestId: string, userId: string) {
      if (!services.RequestsService()) {
        throw new Error("RequestsService not initialized");
      }

      this.loading = true;
      this.error = null;

      try {
        const response: any = await services
          .RequestsService()
          ?.cancelRequest(requestId, userId);
        this.updateRequestsInLocalState(requestId, response.data);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to cancel request";
        console.error("Error canceling request:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
