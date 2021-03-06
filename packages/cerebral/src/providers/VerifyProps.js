import {throwError} from '../utils'

function VerifyPropsProvider (context, functionDetails) {
  try {
    JSON.stringify(context.props)
  } catch (e) {
    throwError(`The function ${functionDetails.name} in signal ${context.execution.name} is not given a valid payload`)
  }

  return context
}

export default VerifyPropsProvider
