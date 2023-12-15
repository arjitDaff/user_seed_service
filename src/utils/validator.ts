const tv4 = require('tv4');
import { INVALID_JSON_ERROR, NON_EMPTY_OR_BLANK_ERROR , POSITIVE_NUMBER_ERROR} from '../constants/errorResponse';


const tv4Formats = {
  // string with something to read. i.e not empy or blank
  nonEmptyOrBlank: (data: string) => {
    return data.length > 0 && !/^\s+$/.test(data) ?
      null :
      NON_EMPTY_OR_BLANK_ERROR;
  },

  jsonObject: (data: string) => {
    try {
      JSON.parse(data);
      return true;
    } catch (e) {
      return INVALID_JSON_ERROR;
    }
  },
  
  positiveNumeric: function(data:number) {
    return data >= 0 ? null : POSITIVE_NUMBER_ERROR;
  },
}

tv4.addFormat(tv4Formats);
/**
 * Validate data against schema.
 * Throws API error if data is invalid.
 *
 * @param {*} data data to validate.
 * @param {object} schema tv4 schema object.
 */
export function validate(data:Record<string, any>, schema:Record<string, any>) {
  // validate
  const result = tv4.validateResult(data, schema, false, true);

  // proceed if valid
  if (result.valid) {
    return;
  }
  let message;
  if (result.error.dataPath) {
    message = `${result.error.message} at ${result.error.dataPath}`;
  } else {
    message = result.error.message;
  }

  // send validation error with message
  throw message;
};
