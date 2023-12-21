// msを指定してこの関数を呼び出すとmsの分動作が停止する
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}