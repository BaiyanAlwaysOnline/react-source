function sleep(delay) {
    let begin = Date.now();
    while (Date.now() - begin <= delay){}
}
