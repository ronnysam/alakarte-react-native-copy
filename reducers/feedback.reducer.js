import {feedbackConstants} from '../constants';

const initialState = {
  isSendingFeedback: false,
  feedbackSend: false,
};

export function feedback(state = initialState, action) {
  switch (action.type) {
    case feedbackConstants.SEND_FEEDBACK:
      return {
        ...state,
        isSendingFeedback: true,
        feedbackSend: false,
      };
    case feedbackConstants.SEND_FEEDBACK_ON_SUCCESS:
      return {
        ...state,
        isSendingFeedback: false,
        feedbackSend: true,
      };
    case feedbackConstants.SEND_FEEDBACK_ON_FAILURE:
      return {
        ...state,
        isSendingFeedback: false,
        feedbackSend: false,
      };

    default:
      return state;
  }
}
