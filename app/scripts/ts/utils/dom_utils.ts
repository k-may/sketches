/**
 * Created by kev on 15-10-05.
 */
export class DOMUtils {

  static CreateDiv(className: string): HTMLElement {
    var cont: HTMLElement = document.createElement("div");
    cont.setAttribute("class", className);
    return cont;
  }

  static RetreiveNode(className: string): HTMLElement {
    var nodeList: NodeList = document.getElementsByClassName(className);
    if (nodeList.length) {
      return <HTMLElement>nodeList[0];
    }
    return null;
  }

  static CloneNode(id: string): HTMLElement {
    var el = document.getElementById(id);
    el = <HTMLElement>el.cloneNode(true);
    el.setAttribute("id", "");
    el.setAttribute("class", id);
    return el;
  }

  static html_entity_decode(message): string {
    return message.replace(/[<>'"]/g, function (m) {
      return '&' + {
          '\'': 'apos',
          '"': 'quot',
          '&': 'amp',
          '<': 'lt',
          '>': 'gt',
        }[m] + ';';
    });
  }
}
