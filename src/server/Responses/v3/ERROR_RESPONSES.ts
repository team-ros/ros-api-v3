const RESPONSES = {
    USER_NOT_AUTHENTICATED: {
        message: "unauthorized request",
        code: 1
    },
    TOKEN_MALFORMED: {
        message: "malformed access token",
        code: 2
    },
    TOKEN_NOT_VALID: {
        message: "access token not valid",
        code: 3
    },
    PARENT_DOES_NOT_EXIST: {
        message: "parent object does not exist",
        code: 4
    },
    OBJECT_ALREADY_EXISTS: {
        message: "an object with the same name already exists in this directory",
        code: 5
    },
    OBJECT_DOES_NOT_EXIST: {
        message: "the requested object does not exist",
        code: 6
    },
    OBJECT_NAME_NOT_FETCHABLE: {
        message: "could not get name of object",
        code: 7
    },
    OBJECT_TYPE_NOT_ENUMERABLE: {
        message: "could not enumerate object type",
        code: 8
    },
    OBJECT_NOT_MOVABLE: {
        message: "could not move object",
        code: 9
    },
    OBJECT_NOT_REMOVABLE_S3: {
        message: "could not remove object from s3",
        code: 10
    },
    OBJECT_NOT_REMOVABLE_DB: {
        message: "could not remove object from s3",
        code: 11
    },
    SEARCH_ERROR: {
        message: "could not search",
        code: 12
    },
    DATABASE_ERROR: {
        message: "database error",
        code: 13
    },
    DIR_CREATED_NOT_INDEXED: {
        message: "directory created successfully but could not be indexed",
        code: 14
    },
    DIR_INDEXED_SUCCESSFULLY: {
        message: "directory created and indexed successfully",
        code: 15
    },
    DIR_DATA_NOT_FETCHABLE: {
        message: "could not fetch directory data from database",
        code: 16
    },
    FILE_URL_NOT_FETCHABLE: {
        message: "could not fetch file url",
        code: 17
    },
    INTERNAL_SERVER_ERROR: {
        message: "internal server error",
        code: 18
    },
    NO_FILE_UPLOADED: {
        message: "no file uploaded",
        code: 19
    },
    FILE_UPLOADED_SUCCESSFULLY_INDEX_ERROR: {
        message: "file uploaded successfully but could not be indexed",
        code: 20
    },
    FILE_UPLOADED_SUCCESSFULLY: {
        message: "file uploaded and indexed successfully",
        code: 21
    },
    UPLOAD_ERROR: {
        message: "could not upload file",
        code: 22
    },
    OBJECT_CHILDREN_CANNOT_BE_LOADED: {
        message: "the children of a directory could not be loaded",
        code: 23
    },
    COPY_ERROR: {
        message: "an error occured while copying this could be due to multiple CRUD operations simultaniously",
        code: 24
    },
    DELETE_ERROR: {
        message: "error while deleting object",
        code: 25
    }
}

interface IOptions {
    status?: boolean,
    code?: number
}

export const RESPONSE = (name: keyof typeof RESPONSES, options?: IOptions) => {
    return  {
        status: options?.status || false,
        ...RESPONSES[name]
    }
}