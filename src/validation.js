export const isEmpty = (str) => {
    if (str) {
        return false
    }
    return true
}

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
export const isEmailValid = (value) => {
    return EMAIL_REGEXP.test(value);
}