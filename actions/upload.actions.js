import { orderActions } from '.';
import {uploadConstants} from '../constants';
import {uploadService} from '../services';

export const uploadActions = {
  uploadFile,
};

function uploadFile(requestObject,  orderDetails) {
  return dispatch => {
    dispatch(request());
    uploadService.uploadFile(requestObject).then(
      () => {},
      er => {
        if(er.status === 201) {
          dispatch(success());
         console.log(JSON.stringify(orderDetails))
          dispatch(orderActions.updateOrder({
            ...orderDetails,
            payment_image: er.response.download_url
          }))
        }
        dispatch(failure(er));
      },
    );
  };

  function request() {
    return {type: uploadConstants.UPLOAD_IMAGE};
  }
  function success() {
    return {
      type: uploadConstants.UPLOAD_IMAGE_ON_SUCCESS,
    };
  }
  function failure(error) {
    return {
      type: uploadConstants.UPLOAD_IMAGE_ON_FAILURE,
      error,
    };
  }
}
