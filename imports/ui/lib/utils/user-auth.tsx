import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useMemo,
  useReducer
} from 'react'
import {Meteor} from 'meteor/meteor'
import {useTracker} from 'meteor/react-meteor-data'
import {ZodError} from 'zod'

type User = Pick<Meteor.User, 'emails' | 'username' | '_id'>

// https://docs.meteor.com/api/accounts.html#Meteor-loginWithPassword
type LoginSelector = { username: string } | { email: string } | { id: string } | string

type AuthState = {
  userLoggingIn: boolean
  userLoggingOut: boolean
  user?: User
  error?: Meteor.Error | ValidationError
}

type AuthAction =
  | { type: "loggingInUser" }
  | { type: "loggedInUser", user: User }
  | { type: "loggingOutUser" }
  | { type: "loggedOutUser" }
  | { type: "error", error: Meteor.Error | ValidationError }

const init = (initialState?: Partial<AuthState>): AuthState => (Object.assign({
  user: undefined,
  userLoggingIn: false,
  userLoggingOut: false,
}, initialState));

const reducer = (prevState: AuthState, action: AuthAction): AuthState => {
  const nextState = (() => {
    switch (action.type) {
      case "loggingInUser":
        return { ...prevState, userLoggingIn: true, error: undefined };
      case "loggedInUser":
        return { ...prevState, user: action.user, userLoggingIn: false, error: undefined };
      case "loggingOutUser":
        return { ...prevState, userLoggingOut: true, error: undefined };
      case "loggedOutUser":
        return { ...prevState, userLoggingOut: false, user: undefined };
      case "error":
        return { ...prevState, error: action.error, userLoggingIn: false, userLoggingOut: false };
      default:
        return prevState;
    }
  })()
  // console.log("prevState", prevState);
  // console.log("action", action);
  // console.log("nextState", nextState);
  return nextState;
}

const useAuthAPI = (state: AuthState, dispatch: Dispatch<AuthAction>) => {
  const authHelpers = useMemo(() => ({
    ...state,
    loginWithPassword: (user: LoginSelector, password: string) => {
      dispatch({ type: "loggingInUser" });
      return new Promise<void>((resolve, reject) =>
        Meteor.loginWithPassword(user, password, async (error) => {
          if (error) {
            dispatch({ type: "error", error: error as Meteor.Error });
            reject(error);
          } else {
            // Not dispatching success here because it's handled by the useTracker hook
            resolve();
          }
        }));
    },
    logout: () => {
      dispatch({ type: "loggingOutUser" });
      return new Promise<void>((resolve, reject) =>
        Meteor.logout((error) => {
          if (error) {
            dispatch({ type: "loggedOutUser" });
            reject(error);
          } else {
            // Not dispatching success here because it's handled by the useTracker hook
            resolve();
          }
        }));
    }
  }), [ state, dispatch ]);

  useTracker(() => {
    if(!Meteor.userId()) {
      dispatch({ type: "loggedOutUser" });
    }
  }, []);

  useTracker(() => {
    if (Meteor.loggingOut() && !state.userLoggingOut) {
      dispatch({ type: "loggingOutUser" });
    } else if (Meteor.loggingIn() && !state.userLoggingIn) {
      console.log("dispatching loggingInUser");
      dispatch({ type: "loggingInUser" });
    }
  }, [ state.userLoggingIn, state.userLoggingOut ]);

  useTracker(() => {
    if(Meteor.user() && !state.user) {
      console.log("dispatching loggedInUser");
      dispatch({ type: "loggedInUser", user: Meteor.user()! });
    }
  }, [ state.user ]);

  return authHelpers;
}

type AuthAPI = ReturnType<typeof useAuthAPI>

const AuthContext = createContext<AuthAPI | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

type AuthProviderProps = PropsWithChildren<{
  initialState?: Partial<AuthState>
}>
export const AuthProvider = ({ children, initialState }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, init(initialState));
  const api = useAuthAPI(state, dispatch);
  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

type OrderFormConsumerProps = {
  children: (api: AuthAPI) => React.ReactNode
}
export const AuthConsumer = ({ children }: OrderFormConsumerProps) => {
  const context = useAuth();
  return <>{children(context)}</>;
}

export class ValidationError extends Meteor.Error {
  static code = 'validation-error';
  static message = 'Validation failed';

  constructor(error: ZodError, message = ValidationError.message) {
    // @ts-ignore because Meteor's Error constructor can take an array / object as the third argument
    super(ValidationError.code, message, error);
  }
}
