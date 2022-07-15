const hash = (stringval:string):Number => {
        return stringval ? ((stringvar:string) => { 
        let hashCode = 0;
        for(let i = 0; i < stringval.length; i++) {
            hashCode = ((hashCode<<5)-hashCode)+stringval.charCodeAt(i)
            hashCode = hashCode & hashCode;
        }
        return hashCode })(stringval) : 0;
};

export default hash;