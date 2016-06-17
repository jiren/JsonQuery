
/**
 * Conditional operators to check condition
 * 
 * @param {object} rv - Record value
 * @param {object} cv - Condition value
*/
export const Operators = {
  /* Equal */
  eq(rv, cv){ return rv == cv},

  /* Not Equal */
  ne(rv, cv){ return rv != cv},

  /* Less than */
  lt(rv, cv){ return rv < cv},

  /* Less than equal */
  lte(rv, cv){ return rv <= cv},

  /* Greather than */
  gt(rv, cv){ return rv > cv},

  /* Greather than equal */
  gte(rv, cv){ return rv >= cv},

  /* Array include */
  in(rv, cv){ return cv.indexOf(rv) > -1},

  /* Array not in  */
  ni(rv, cv){ return cv.indexOf(rv) == -1},

  /** 
   * Regular Expression 
   * @param {object} rv - Record value
   * @param {RegExp} cv - Condition value
   */
  li(rv, cv) { return cv.test(rv); },

  /**
   * Range between.
   * @param {object} rv - Record value
   * @param {Array}  range - Condition value
   */
  bt(rv, range){ return (rv >= range[0] && rv <= range[1])} 
}
