import {feedbackConstants} from '../constants';
import {feedbackService} from '../services';

export const feedbackActions = {
  sendFeedback,
};

function sendFeedback(requestObject) {
  return dispatch => {
    dispatch(request());
    feedbackService.sendFeedback(requestObject).then(
      () => {},
      er => {
        if (er.status === 201) {
          dispatch(success());
        }
        dispatch(failure(er));
      },
    );
  };

  function request() {
    return {type: feedbackConstants.SEND_FEEDBACK};
  }
  function success() {
    return {
      type: feedbackConstants.SEND_FEEDBACK_ON_SUCCESS,
    };
  }
  function failure(error) {
    return {
      type: feedbackConstants.SEND_FEEDBACK_ON_FAILURE,
      error,
    };
  }
}
