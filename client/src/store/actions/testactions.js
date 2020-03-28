import { UPDATE_DRAWING_STATE_SUCCESS } from "../types"

export const updateDrawing = (drawingState) =>{
    return (dispatch)=>{
        dispatch({
            type: UPDATE_DRAWING_STATE_SUCCESS,
            drawing:{
                ...drawingState
            }
        })
    }
}