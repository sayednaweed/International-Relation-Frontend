import React, { createContext, useContext, useEffect, useReducer } from "react";
import axiosClient from "../lib/axois-client";
import { Donor, Ngo, User } from "@/database/tables";
import {
  getConfiguration,
  removeToken,
  returnPermissionsMap,
  setToken,
} from "@/lib/utils";
import { StatusEnum } from "@/lib/constants";
// import secureLocalStorage from "react-secure-storage";
interface AuthState {
  authenticated: boolean;
  user: User | Ngo | Donor;
  loading: boolean;
  loginUser: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  loginNgo: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  loginDonor: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logoutUser: () => Promise<void>;
  logoutNgo: () => Promise<void>;
  logoutDonor: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  setNgo: (user: Ngo) => Promise<void>;
  setDonor: (user: Donor) => Promise<void>;
}
type Action =
  | { type: "LOGIN"; payload: User | Ngo | Donor }
  | { type: "EDIT"; payload: User | Ngo | Donor }
  | { type: "LOGOUT" }
  | { type: "STOP_LOADING" };

type Dispatch = React.Dispatch<Action>;
const initUser: User | Ngo | Donor = {
  id: "",
  full_name: "",
  username: "",
  email: "",
  status: {
    id: StatusEnum.blocked,
    name: "",
    created_at: "",
  },
  grant: false,
  profile: "",
  role: { role: 3, name: "user" },
  job: "",
  contact: "",
  destination: "",
  permissions: new Map(),
  created_at: "",
};
const initialState: AuthState = {
  user: initUser,
  authenticated: false,
  loading: true,
  loginUser: () => Promise.resolve(),
  loginNgo: () => Promise.resolve(),
  loginDonor: () => Promise.resolve(),
  logoutUser: () => Promise.resolve(),
  logoutNgo: () => Promise.resolve(),
  logoutDonor: () => Promise.resolve(),
  setUser: () => Promise.resolve(),
  setNgo: () => Promise.resolve(),
  setDonor: () => Promise.resolve(),
};
const StateContext = createContext<AuthState>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

function reducer(state: AuthState, action: Action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      removeToken();
      return {
        ...state,
        authenticated: false,
        user: initUser,
        loading: false,
      };
    case "EDIT":
      return {
        ...state,
        user: action.payload,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error("Unknown action type");
  }
}
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const configuration = getConfiguration();
        if (
          configuration?.token === null ||
          configuration?.token === undefined
        ) {
          dispatch({ type: "STOP_LOADING" });
          return;
        }
        const response = await axiosClient.get(`auth-${configuration?.type}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const user = response.data.user;
          if (user != null) {
            user.permissions = returnPermissionsMap(response.data?.permissions);
          }
          dispatch({ type: "LOGIN", payload: user });
        }
      } catch (err) {
        console.log(err);
        dispatch({ type: "LOGOUT" });
      }
    };
    loadUser();
  }, []);
  const loginUser = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<any> => {
    let response: any = null;
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      response = await axiosClient.post("auth-user", formData);
      if (response.status == 200) {
        if (rememberMe) {
          setToken({
            token: response.data.token,
            type: "user",
          });
        }
        const user = response.data.user as User;
        if (user != null)
          user.permissions = returnPermissionsMap(response.data?.permissions);
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (error: any) {
      response = error;
      console.log(error);
    }
    return response;
  };
  const loginNgo = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<any> => {
    let response: any = null;
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      response = await axiosClient.post("auth-ngo", formData);
      if (response.status == 200) {
        if (rememberMe) {
          setToken(response.data.token);
          setToken({
            token: response.data.token,
            type: "ngo",
          });
        }
        const user = response.data.user as Ngo;
        if (user != null)
          user.permissions = returnPermissionsMap(response.data?.permissions);
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (error: any) {
      response = error;
      console.log(error);
    }
    return response;
  };
  const loginDonor = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<any> => {
    let response: any = null;
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      response = await axiosClient.post("auth-ngo", formData);
      if (response.status == 200) {
        if (rememberMe) {
          setToken({
            token: response.data.token,
            type: "donor",
          });
        }
        const user = response.data.user as User;
        if (user != null)
          user.permissions = returnPermissionsMap(response.data?.permissions);
        dispatch({ type: "LOGIN", payload: user });
      }
    } catch (error: any) {
      response = error;
      console.log(error);
    }
    return response;
  };
  const setUser = async (user: User): Promise<any> => {
    try {
      if (user != null || user != undefined)
        dispatch({ type: "EDIT", payload: user });
    } catch (error: any) {
      console.log(error);
    }
  };
  const setNgo = async (ngo: Ngo): Promise<any> => {
    try {
      if (ngo != null || ngo != undefined)
        dispatch({ type: "EDIT", payload: ngo });
    } catch (error: any) {
      console.log(error);
    }
  };
  const setDonor = async (donor: Donor): Promise<any> => {
    try {
      if (donor != null || donor != undefined)
        dispatch({ type: "EDIT", payload: donor });
    } catch (error: any) {
      console.log(error);
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      await axiosClient.post("auth-logout");
    } catch (error: any) {
      console.log(error);
    }
    dispatch({ type: "LOGOUT" });
  };
  const logoutNgo = async (): Promise<void> => {
    try {
      await axiosClient.post("logout-ngo");
    } catch (error: any) {
      console.log(error);
    }
    dispatch({ type: "LOGOUT" });
  };
  const logoutDonor = async (): Promise<void> => {
    try {
      await axiosClient.post("logout-donor");
    } catch (error: any) {
      console.log(error);
    }
    dispatch({ type: "LOGOUT" });
  };

  return (
    <StateContext.Provider
      value={{
        ...state,
        loginUser,
        loginNgo,
        loginDonor,
        logoutUser,
        logoutNgo,
        logoutDonor,
        setUser,
        setNgo,
        setDonor,
      }}
    >
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
// export const useAuthState = () => useContext(StateContext);
export const useUserAuthState = () => {
  const context = useContext(StateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within a useUserAuthState");

  const { user, setUser, authenticated, loading, loginUser, logoutUser } =
    context;
  if (user.role.name === "donor" || user.role.name === "ngo")
    throw new Error("You are not allowed");
  else {
    const currentUser = user as User;
    return {
      user: currentUser,
      setUser,
      authenticated,
      loading,
      loginUser,
      logoutUser,
    };
  }
};
export const useDonorAuthState = () => {
  const context = useContext(StateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within a useUserAuthState");

  const { user, setDonor, authenticated, loading, loginDonor, logoutDonor } =
    context;
  if (authenticated && user.role.name !== "donor")
    throw new Error("You are not allowed");
  else {
    const currentUser = user as Donor;
    return {
      user: currentUser,
      setDonor,
      authenticated,
      loading,
      loginDonor,
      logoutDonor,
    };
  }
};
export const useNgoAuthState = () => {
  const context = useContext(StateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within a useUserAuthState");

  const { user, setNgo, authenticated, loading, loginNgo, logoutNgo } = context;
  if (authenticated && user.role.name !== "ngo")
    throw new Error("You are not allowed");
  else {
    const currentUser = user as Ngo;
    return {
      user: currentUser,
      setNgo,
      authenticated,
      loading,
      loginNgo,
      logoutNgo,
    };
  }
};
export const useGeneralAuthState = () => {
  const context = useContext(StateContext);

  if (context === undefined)
    throw new Error("useAuthState must be used within a useUserAuthState");
  return context;
};

export const useAuthDispatch: () => Dispatch = () =>
  useContext(DispatchContext);
