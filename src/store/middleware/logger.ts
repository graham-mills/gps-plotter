import { Middleware } from "redux";

import { RootState } from "..";

export const logger: Middleware<{}, RootState> = (storeApi) => (next) => (action) => {
    console.group(action.type);
    console.debug(action.payload);
    next(action);
    console.groupEnd();
};
