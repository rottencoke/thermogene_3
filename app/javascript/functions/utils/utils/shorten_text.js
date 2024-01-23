export function shorten_text(text, len) {
    // 文字数が${len}文字を超える場合は、最初の${len}文字に"..."を追加する
    if (text.length > len) {
        return text.substring(0, len) + "...";
    }
    // 文字数が${len}文字以下の場合は、そのままの文字列を返す
    return text;
}