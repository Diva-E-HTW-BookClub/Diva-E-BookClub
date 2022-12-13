const defaultState = {
    user: {}
}

export default function reducer(
    state = defaultState, 
    { type, payload }: {type: string, payload:any}): any {
    //work with state
    switch(type) {
        case 'SET_USER_STATE':
            return {
                ...state,
                user: {
                    user: payload,
                }
            }
    }
    return state
}