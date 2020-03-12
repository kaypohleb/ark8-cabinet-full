export const USER_STATE_CHANGED = 'USER_STATE_CHANGED';

// define our action function
export function userStateChanged(user) {
  return {
    type: USER_STATE_CHANGED, // required
    user: user ? user.toJSON() : null, // the response from Firebase: if a user exists, pass the serialized data down, else send a null value.
  };
}

export const ID_TOKEN_CHANGED = 'ID_TOKEN_CHANGED';

export function idTokenChanged(idtoken) {
    return {
      type: ID_TOKEN_CHANGED, // required
      idtoken: idtoken ? idtoken : '', // the response from Firebase: if a user exists, pass the serialized data down, else send a null value.
    };
  }