/**
 * Created by kevin.mayo on 8/14/2017.
 */
define(['ts/utils/canvas_utils',
    'ts/utils/color_utils',
    'ts/utils/geom_utils',
    'ts/utils/anim_utils',
  'ts/utils/load_utils'],

  function (CanvasUtils,
            ColorUtils,
            GeomUtils,
            AnimUtils,
  LoadUtils) {


      return {
        CanvasUtils : CanvasUtils.CanvasUtils,
        ColorUtils : ColorUtils.Color,
        GeomUtils : GeomUtils.GeomUtils,
        AnimUtils : AnimUtils.AnimUtils,
        LoadUtils : LoadUtils.LoadUtils
      };
  });
