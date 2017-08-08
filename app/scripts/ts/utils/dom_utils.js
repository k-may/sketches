define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by kev on 15-10-05.
     */
    var DOMUtils = (function () {
        function DOMUtils() {
        }
        DOMUtils.CreateDiv = function (className) {
            var cont = document.createElement("div");
            cont.setAttribute("class", className);
            return cont;
        };
        DOMUtils.RetreiveNode = function (className) {
            var nodeList = document.getElementsByClassName(className);
            if (nodeList.length) {
                return nodeList[0];
            }
            return null;
        };
        DOMUtils.CloneNode = function (id) {
            var el = document.getElementById(id);
            el = el.cloneNode(true);
            el.setAttribute("id", "");
            el.setAttribute("class", id);
            return el;
        };
        DOMUtils.html_entity_decode = function (message) {
            return message.replace(/[<>'"]/g, function (m) {
                return '&' + {
                    '\'': 'apos',
                    '"': 'quot',
                    '&': 'amp',
                    '<': 'lt',
                    '>': 'gt',
                }[m] + ';';
            });
        };
        return DOMUtils;
    }());
    exports.DOMUtils = DOMUtils;
});
//# sourceMappingURL=dom_utils.js.map