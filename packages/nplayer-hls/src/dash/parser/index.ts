export class MPDParser {
  static parse(text: string) {
    if (!text) return;

    const parser = new DOMParser();
    let xml: Document | undefined;
    try {
      xml = parser.parseFromString(text, 'text/xml');
    } catch (exception) {
      // ignore
    }
    if (!xml) return;

    const root = xml.documentElement;
    if (root.tagName !== 'MPD') return;
    if (root.getElementsByTagName('parsererror').length > 0) return;

    return root;
  }
}
