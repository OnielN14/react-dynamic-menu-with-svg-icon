import React, {
  createContext,
  useReducer,
  PropsWithChildren,
  useMemo,
  useContext,
  useEffect,
} from 'react';

const ACTION_SET_MENU = 'ACTION_SET_MENU';

const setMenuAction = (menu: Menu[]): Action => ({
  type: ACTION_SET_MENU,
  payload: menu,
});

interface Menu {
  name: string;
  iconSrc: string;
}

type Action = { type: typeof ACTION_SET_MENU; payload: Menu[] };

interface State {
  menus: Menu[];
}

const initialState: State = {
  menus: [],
};

type ContextValue = [State, React.Dispatch<Action>];

const menuContext = createContext<ContextValue>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [{ menus: [] }, (_action) => {}],
);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_SET_MENU:
      return {
        ...state,
        menus: [...action.payload],
      };

    default:
      return state;
  }
};

const MenuContextProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: Menu[] }>) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    menus: [...value],
  });

  const contextValue = useMemo(
    () => [state, dispatch],
    [state],
  ) as ContextValue;

  useEffect(() => {
    dispatch(setMenuAction(value));
  }, [value]);

  return (
    <menuContext.Provider value={contextValue}>{children}</menuContext.Provider>
  );
};

const useMenuContext = () => useContext(menuContext);

export type { Action, State, ContextValue, Menu };

export { menuContext, useMenuContext, setMenuAction };

export default MenuContextProvider;
