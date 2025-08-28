


export async function cssStringToStyleSheet(cssString: string) {
    const sheet = new CSSStyleSheet();
    await sheet.replace(cssString);
    return sheet;
}