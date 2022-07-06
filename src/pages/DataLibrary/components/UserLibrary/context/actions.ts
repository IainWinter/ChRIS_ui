import { FileSelect, Types } from './index'

export const setCurrentPath = (path: string, type: string) => {
  return {
    type: Types.SET_CURRENT_PATH,
    payload: {
      path,
      type,
    },
  }
}

export const setCurrentPathSearch = (paths: string[], type: string) => {
  return {
    type: Types.SET_CURRENT_PATH_SEARCH,
    payload: {
      paths,
      type,
    },
  }
}

export const setHomePath = (path: string, type: string) => {
  return {
    type: Types.SET_HOME_PATH,
    payload: {
      path,
      type,
    },
  }
}

export const clearFolderState = (path: string, type: string) => {
  return {
    type: Types.CLEAR_FOLDER_STATE,
    payload: {
      path,
      type,
    },
  }
}

export const clearFilesState = (path: string, type: string) => {
  return {
    type: Types.CLEAR_FILES_STATE,
    payload: {
      path,
      type,
    },
  }
}

export const setLoading = (loading: boolean) => {
  return {
    type: Types.SET_LOADING,
    payload: {
      loading,
    },
  }
}

export const setFolders = (folders: any[], path: string) => {
  return {
    type: Types.SET_FOLDERS,
    payload: {
      folders,
      path,
    },
  }
}

export const setPaginatedFolders = (folders: any[], path: string) => {
  return {
    type: Types.SET_PAGINATED_FOLDERS,
    payload: {
      folders,
      path,
    },
  }
}

export const setFiles = (files: any[], path: string) => {
  return {
    type: Types.SET_FILES,
    payload: {
      files,
      path,
    },
  }
}

export const setPagination = (
  path: string,
  pagination: {
    hasNext: boolean
    limit: number
    offset: number
    totalCount: number
  },
) => {
  return {
    type: Types.SET_PAGINATION,
    payload: {
      path,
      hasNext: pagination.hasNext,
      limit: pagination.limit,
      offset: pagination.offset,
      totalCount: pagination.totalCount,
    },
  }
}

export const clearSelectFolder = (file: FileSelect) => {
  return {
    type: Types.CLEAR_SELECTED_FOLDER,
    payload: {
      selectFolder: file,
    },
  }
}

export const setSelectFolder = (payload: FileSelect) => {
  return {
    type: Types.SET_SELECTED_FOLDER,
    payload: {
      selectFolder: payload,
    },
  }
}
