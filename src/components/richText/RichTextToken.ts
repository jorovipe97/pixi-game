export enum TOKEN_TYPES {
    WORD = 1,
    IMAGE
}

export class RichTextToken {

    value : string;
    type : TOKEN_TYPES;

    constructor (type : TOKEN_TYPES, value : string) {
        this.type = type;
        this.value = value;
    }

    get isImage () {
        return this.type === TOKEN_TYPES.IMAGE;
    }

    get isWord () {
        return this.type === TOKEN_TYPES.WORD;
    }
}