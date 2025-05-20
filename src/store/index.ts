import { create } from "zustand";

type LoginStore = {
  userToken: string;
  add: (token: string) => void;
};

export const useLoginStore = create<LoginStore>()((set) => ({
  userToken: "",
  add: (token: string) =>
    set((state) => ({
      userToken: (state.userToken = token),
    })),
}));
