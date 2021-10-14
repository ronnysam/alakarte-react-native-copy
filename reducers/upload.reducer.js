import {uploadConstants} from '../constants';

const initialState = {
  isUploading: false,
  isUploaded: false,
};

export function upload(state = initialState, action) {
  switch (action.type) {
    case uploadConstants.UPLOAD_IMAGE:
      return {
        ...state,
        isUploading: true,
        isUploaded: false,
      };
    case uploadConstants.UPLOAD_IMAGE_ON_SUCCESS:
      return {
        ...state,
        isUploading: false,
        isUploaded: true,
      };
    case uploadConstants.UPLOAD_IMAGE_ON_FAILURE:
      return {
        ...state,
        isUploading: false,
        isUploaded: false,
      };

    default:
      return state;
  }
}
