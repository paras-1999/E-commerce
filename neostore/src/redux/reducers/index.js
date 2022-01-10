import cartReducer from "./cartReducer";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
    cartReducer
    //add other reducers
});
export default rootReducer