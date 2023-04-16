import loopReduxTypes from './loopRedux.types';

export const goNextRedux = loopStep => async dispatch => {
  console.log('start goNextRedux');
  // update loopRedux Step
  dispatch({
    type: loopReduxTypes.SET_LOOP_STEP,
    payload: loopStep + 1,
  });
  // update default wordsBag step in the real DB
  dispatch({
    type: userTypes.UPDATE_STEP_OF_DEFAULT_WORDS_BAG,
  });
};
