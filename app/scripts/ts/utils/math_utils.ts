/**
 * Created by kev on 15-11-30.
 */

export class MathUtils {

  static Map(value, low2, high2): number {
    if (value < low2) {
      return 0
    } else if (value >= low2 && value <= high2) {
      return Math.max(0, Math.min(1, (value - low2) / (high2 - low2)));
    } else {
      return 1;
    }
  }

  static Mod = function (n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
  };
}
