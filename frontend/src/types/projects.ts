export type Project  = {
    name: string;
    users: string[];
    _id: string;
    _v?: string | number;
}

export type User  = {
    email: string;
    _v: string | number;
    _id: string;
}


export type ProjectDetails = {
    name: string;
    users: {_id: string, email: string}[];
    _v?: string | number;
    _id: string;
}