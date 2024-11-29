function getImgUrl (name) {
    return new URL(`../assets/images/${name}`, import.meta.url)
}

export {getImgUrl}