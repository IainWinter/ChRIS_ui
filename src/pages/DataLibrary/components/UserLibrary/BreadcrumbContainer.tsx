import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  Split,
  SplitItem,
  Button,
} from '@patternfly/react-core'
import { FaFolder, FaFolderOpen, FaUser } from 'react-icons/fa'
import { FcServices } from 'react-icons/fc'
import { useContext } from 'react'
import { LibraryContext } from './context'

export interface Breadcrumb {
  initialPath: string
  isHome: boolean
  handleFolderClick: (path: string, breadcrumb?: any) => void
  handleRootPath: () => void
  files: any[]
  folderDetails: {
    currentFolder: string
    totalCount: number
  }
  browserType: string
  togglePreview: () => void
  previewAll: boolean
}

const BreadcrumbContainer = ({
  handleFolderClick,
  path,
}: {
  handleFolderClick: (path: string) => void
  path: string
}) => {
  const initialPathSplit = path.split('/')
  return (
    <Breadcrumb style={{ margin: '0 0 1em 0' }}>
      {initialPathSplit.map((path: string, index) => {
        return (
          <BreadcrumbItem
            to="#"
            style={{
              fontSize: '1.1em',
            }}
            onClick={() => {
              const newPath = initialPathSplit.slice(0, index + 1).join('/')
              handleFolderClick(newPath)
            }}
            key={path}
          >
            {path}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

/*

const BreadcrumbContainer = ({
  initialPath,
  isHome,
  handleFolderClick,
  handleRootPath,
  files,
  folderDetails,
  browserType,
  togglePreview,
  previewAll,
}: Breadcrumb) => {
  const initialPathSplit = initialPath ? initialPath.split('/') : []
  return (
    <>
      <Button
        style={{
          margin: '0 0 1em 0',
        }}
        onClick={() => {
          handleRootPath()
        }}
      >
        Home Icon
      </Button>
      {!isHome && (
        <Breadcrumb style={{ margin: '0 0 1em 0' }}>
          {initialPathSplit.map((path: string, index) => {
            let icon
            const style = { width: '2em', height: '0.85em' }
            if (
              (browserType === 'feed' || browserType === 'uploads') &&
              index === 0
            ) {
              icon = <FaUser style={style} />
            } else if (index === 0 && browserType === 'services') {
              icon = <FcServices style={style} />
            } else if (
              index === initialPathSplit.length - 1 &&
              initialPathSplit.length > 1
            ) {
              icon = <FaFolderOpen style={style} />
            } else {
              icon = <FaFolder style={style} />
            }

            return (
              <BreadcrumbItem
                style={{
                  fontSize: '1.1em',
                }}
                to={index !== 0 || browserType !== 'uploads' ? '#' : undefined}
                onClick={() => {
                  if (index === 0 && browserType === 'uploads') {
                    return
                  }

                  if (
                    (index === 0 && browserType === 'feed') ||
                    (index === 0 && browserType === 'services')
                  ) {
                    handleFolderClick(`${path}`, initialPath)
                  } else {
                    const newPath = initialPath.split(`/${path}`)
                    handleFolderClick(`${newPath[0]}/${path}`, initialPath)
                  }
                }}
                key={path}
              >
                {icon}
                {path}
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>
      )}

      {files && files.length > 0 && (
        <Split
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <SplitItem>
            <h3>
              <FaFolderOpen style={{ width: '2em', height: '0.85em' }} />
              {folderDetails.currentFolder}
            </h3>
            <h4 style={{ marginLeft: '0.5em', marginBottom: '1em' }}>
              {folderDetails.totalCount} items
            </h4>
          </SplitItem>
          <SplitItem>
            <Button
              onClick={() => {
                togglePreview()
              }}
            >
              {previewAll ? 'Hide All Previews' : 'Preview All'}
            </Button>
          </SplitItem>
        </Split>
      )}
    </>
  )
}

*/

export default BreadcrumbContainer
