import React, { useCallback, useContext, useEffect } from "react";
import {
  Button,
  DataList,
  DataListItem,
  DataListCell,
  DataListItemRow,
  DataListItemCells,
  DataListToggle,
  Pagination,
  DataListAction,
  DataListContent,
  WizardContext,
  TextInput,
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from "@patternfly/react-core";
import {
  Tree,
  ConfigurationPage,
  UploadJson,
  GeneralCompute,
} from "../Pipelines/";
import {
  fetchComputeInfo,
  fetchPipelines,
  generatePipelineWithName,
} from "../../../api/common";
import { PipelinesProps } from "./types/pipeline";
import { SpinContainer } from "../../common/loading/LoadingContent";
import ReactJson from "react-json-view";
import { Pipeline } from "@fnndsc/chrisapi";
export enum PIPELINEQueryTypes {
  NAME,
  ID,
  OWNER_USERNAME,
  CATEGORY,
  DESCRIPTION,
  AUTHORS
}
const Pipelines = ({
  justDisplay,
  state,
  handleDispatchPipelines,
  handleSetPipelineResources,
  handleUploadDispatch,
  handleSetCurrentNode,
  handleCleanResources,
  handlePipelineSecondaryResource,
  handleSetPipelineEnvironments,
  handleSetCurrentNodeTitle,
  handleSetGeneralCompute,
  handleSetCurrentComputeEnv,
  handleFormParameters,
}: PipelinesProps) => {
  const { pipelineData, selectedPipeline, pipelines } = state;
  const [fetchState, setFetchState] = React.useState({
    loading: false,
    error: {},
  });
  const { onNext, onBack } = useContext(WizardContext);

  const [pageState, setPageState] = React.useState({
    page: 1,
    perPage: 10,
    search: "",
    itemCount: 0,
  });

  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>();
  const { page, perPage, search } = pageState;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [dropdownValue, setDropdownValue] = React.useState<PIPELINEQueryTypes>(PIPELINEQueryTypes.NAME)


  const handleDispatchWrap = React.useCallback(
    (registeredPipelines: any) => {
      handleDispatchPipelines(registeredPipelines);
    },
    [handleDispatchPipelines]
  );
  const handlePipelineSearch = (search: string) => {
    setPageState({
      ...pageState,
      search
    })
  }

  React.useEffect(() => {
    setFetchState((fetchState) => {
      return {
        ...fetchState,
        loading: true,
      };
    });
     const searchTypeFN = () =>{
       switch(dropdownValue){
        case PIPELINEQueryTypes.NAME:
          return "name"
        break;
        case  PIPELINEQueryTypes.ID:
          return "id"
        break;
        case PIPELINEQueryTypes.DESCRIPTION:
          return "description"
        break;
        case PIPELINEQueryTypes.AUTHORS:
          return "authors"
        break;
        case PIPELINEQueryTypes.OWNER_USERNAME:
          return "owner_username"
        break;
        case PIPELINEQueryTypes.CATEGORY:
          return "category"
          break;
       }
    }
    const searchType = searchTypeFN()
    fetchPipelines(perPage, page, search, searchType).then((result: any) => {
      const { registeredPipelines, registeredPipelinesList, errorPayload } =
        result;

      if (errorPayload) {
        setFetchState((fetchState) => {
          return {
            ...fetchState,
            error: errorPayload,
          };
        });
      }
      if (registeredPipelines) {
        handleDispatchWrap(registeredPipelines);
        setPageState((pageState) => {
          return {
            ...pageState,
            itemCount: registeredPipelinesList.totalCount,
          };
        });

        setFetchState((fetchState) => {
          return {
            ...fetchState,
            loading: false,
          };
        });
      }
    });
  }, [perPage, page, dropdownValue, search, handleDispatchWrap]);

  const handleNodeClick = async (nodeName: number, pipelineId: number) => {
    handleSetCurrentNode(pipelineId, nodeName);
  };

  const onSetPage = (_event: any, page: number) => {
    setPageState({
      ...pageState,
      page,
    });
  };
  const onPerPageSelect = (_event: any, perPage: number) => {
    setPageState({
      ...pageState,
      perPage,
    });
  };

  const handleOnButtonClick = useCallback(
    async (pipeline: Pipeline) => {
      if (!(selectedPipeline === pipeline.data.id)) {
        handlePipelineSecondaryResource(pipeline);
        if (!pipelineData[pipeline.data.id]) {
          const { resources } = await generatePipelineWithName(
            pipeline.data.name
          );
          handleSetPipelineResources({
            ...resources,
            pipelineId: pipeline.data.id,
          });
          const { pluginPipings } = resources;

          for (let i = 0; i < pluginPipings.length; i++) {
            const piping = pluginPipings[i];
            const computeEnvData = await fetchComputeInfo(
              piping.data.plugin_id,
              piping.data.id
            );

            if (computeEnvData) {
              handleSetPipelineEnvironments(pipeline.data.id, computeEnvData);
            }
          }
        }
      } else {
        handleCleanResources();
      }
    },
    [
      handleCleanResources,
      handlePipelineSecondaryResource,
      handleSetPipelineEnvironments,
      handleSetPipelineResources,
      pipelineData,
      selectedPipeline,
    ]
  );

  const handleOnExpand = useCallback(
    async (pipeline: Pipeline) => {
      if (!(selectedPipeline === pipeline.data.id)) {
        handlePipelineSecondaryResource(pipeline);
      } else {
        handleCleanResources();
      }
      if (
        !(expanded && expanded[pipeline.data.id]) ||
        !state.pipelineData[pipeline.data.id]
      ) {
        const { resources } = await generatePipelineWithName(
          pipeline.data.name
        );

        handleSetPipelineResources({
          ...resources,
          pipelineId: pipeline.data.id,
        });

        setExpanded({
          ...expanded,
          [pipeline.data.id]: true,
        });
      } else {
        setExpanded({
          ...expanded,
          [pipeline.data.id]: false,
        });
      }
    },
    [
      expanded,
      handleCleanResources,
      handlePipelineSecondaryResource,
      handleSetPipelineResources,
      selectedPipeline,
      state.pipelineData,
    ]
  );

  const handleKeyDown = useCallback(
    (e: any, pipeline: Pipeline) => {
      if (e.code == "Enter" && e.target.closest("DIV.pf-c-data-list__toggle")) {
        e.preventDefaut();
        handleOnExpand(pipeline);
      }
    },
    [handleOnExpand]
  );

  const handleBrowserKeyDown = useCallback(
    (e: any) => {
      if (e.code == "ArrowLeft") {
        onBack();
      } else if (e.code == "ArrowRight") {
        onNext();
      }
    },
    [onBack, onNext]
  );


  useEffect(() => {
    window.addEventListener("keydown", handleBrowserKeyDown);
    return () => {
      window.removeEventListener("keydown", handleBrowserKeyDown);
    };
  }, [handleBrowserKeyDown]);

  const __queryType = (type: PIPELINEQueryTypes) => {
    switch (type) {
      case PIPELINEQueryTypes.NAME:
        return "Pipeline Name";
        break;
      case PIPELINEQueryTypes.ID:
        return "Pipeline Id";
        break;
      case PIPELINEQueryTypes.OWNER_USERNAME:
        return "Owner Username";
        break;
      case PIPELINEQueryTypes.CATEGORY:
        return "Pipeline Category"
        break;
      case PIPELINEQueryTypes.DESCRIPTION:
        return "Pipeline Description"
        break;
      case PIPELINEQueryTypes.AUTHORS:
        return "Pipeline Authors"
        break;
    }
  };

  const onToggle = (isDropdownOpen: boolean) => {
    setIsDropdownOpen(isDropdownOpen);
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-basic');
    element?.focus();
  };

  const onSelect = () => {
    setIsDropdownOpen(false);
    onFocus();
  };

  const updateDropdownValue =(type:PIPELINEQueryTypes)=>{
   setDropdownValue(type)
   handlePipelineSearch("")
  }

  const dropdownItems = [
    <DropdownItem key="name" component="button" onClick={() => updateDropdownValue(PIPELINEQueryTypes.NAME)}>
      {__queryType(PIPELINEQueryTypes.NAME)}
    </DropdownItem>,
    <DropdownItem key="category" component="button" onClick={() => updateDropdownValue(PIPELINEQueryTypes.CATEGORY)}>
      {__queryType(PIPELINEQueryTypes.CATEGORY)}
    </DropdownItem>,
    <DropdownItem key="description" component="button" onClick={() => updateDropdownValue(PIPELINEQueryTypes.DESCRIPTION)} >
      {__queryType(PIPELINEQueryTypes.DESCRIPTION)}
    </DropdownItem>,
    <DropdownItem key="authors" component="button" onClick={() => updateDropdownValue(PIPELINEQueryTypes.AUTHORS)} >
      {__queryType(PIPELINEQueryTypes.AUTHORS)}
    </DropdownItem>,
    <DropdownItem key="id" component="button" onClick={() => updateDropdownValue(PIPELINEQueryTypes.ID)} >
      {__queryType(PIPELINEQueryTypes.ID)}
    </DropdownItem>,
    <DropdownItem key="owner_username" component="button" onClick={() => updateDropdownValue(PIPELINEQueryTypes.OWNER_USERNAME)} >
      {__queryType(PIPELINEQueryTypes.OWNER_USERNAME)}
    </DropdownItem>
  ];

  

  return (
    <>
      <UploadJson handleDispatch={handleUploadDispatch} />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.8rem 0rem" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Dropdown
            onSelect={onSelect}
            toggle={
              <DropdownToggle id="toggle-basic" onToggle={onToggle}>
                <div style={{ textAlign: "left", padding: "0 0.5em" }}>
                  <div style={{ fontSize: "smaller", color: "gray" }}>
                    Search By
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {__queryType(dropdownValue)}
                  </div>
                </div>
              </DropdownToggle>
            }
            isOpen={isDropdownOpen}
            dropdownItems={dropdownItems}
          />
          <TextInput
            value={pageState.search}
            type="text"
            style={{height:"100%"}}
            placeholder={__queryType(dropdownValue)}
            iconVariant="search"
            aria-label="search"
            onChange={(value: string) => {
              handlePipelineSearch && handlePipelineSearch(value);
            }}
          />
        </div>
        <Pagination
          itemCount={pageState.itemCount}
          perPage={pageState.perPage}
          page={pageState.page}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
        />
      </div>


      <DataList
        style={{ backgroundColor: "inherit" }}
        aria-label="pipeline list"
      >
        {Object.keys(fetchState.error).length > 0 && (
          <ReactJson src={fetchState.error} />
        )}

        {fetchState.loading ? (
          <SpinContainer title="Fetching Pipelines" />
        ) : (
          pipelines.length > 0 &&
          pipelines.map((pipeline: any) => {
            return (
              <DataListItem
                isExpanded={
                  expanded && expanded[pipeline.data.id] ? true : false
                }
                key={pipeline.data.id}
              >
                <DataListItemRow>
                  <DataListToggle
                    id={pipeline.data.id}
                    aria-controls="expand"
                    onKeyDown={(e) => handleKeyDown(e, pipeline)}
                    onClick={() => handleOnExpand(pipeline)}
                  />
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key={pipeline.data.name}>
                        <div
                          className="plugin-table-row"
                          key={pipeline.data.name}
                        >
                          <span className="plugin-table-row__plugin-name">
                            {pipeline.data.name}
                          </span>
                          <span
                            className="plugin-table-row__plugin-description"
                            id={`${pipeline.data.description}`}
                          >
                            <em>{pipeline.data.description}</em>
                          </span>
                        </div>
                      </DataListCell>,
                    ]}
                  />
                  <DataListAction
                    aria-labelledby="select a pipeline"
                    id={pipeline.data.id}
                    aria-label="actions"
                    className="pipelines"
                  >
                    {!justDisplay && (
                      <Button
                        variant="primary"
                        key="select-action"
                        onClick={() => handleOnButtonClick(pipeline)}
                      >
                        {selectedPipeline === pipeline.data.id
                          ? "Deselect"
                          : "Select"}
                      </Button>
                    )}

                    <Button
                      key="delete-action"
                      onClick={async () => {
                        const filteredPipelines = pipelines.filter(
                          (currentPipeline: any) => {
                            return currentPipeline.data.id !== pipeline.data.id;
                          }
                        );
                        handleDispatchPipelines(filteredPipelines);
                        await pipeline.delete();
                      }}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </DataListAction>
                </DataListItemRow>
                <DataListContent
                  id={pipeline.data.id}
                  aria-label="PrimaryContent"
                  isHidden={!(expanded && expanded[pipeline.data.id])}
                >
                  {(expanded && expanded[pipeline.data.id]) ||
                    state.pipelineData[pipeline.data.id] ? (
                    <>
                      <div style={{ display: "flex", background: "black" }}>
                        <Tree
                          state={state.pipelineData[pipeline.data.id]}
                          currentPipelineId={pipeline.data.id}
                          handleNodeClick={handleNodeClick}
                          handleSetCurrentNode={handleSetCurrentNode}
                          handleSetPipelineEnvironments={
                            handleSetPipelineEnvironments
                          }
                          handleSetCurrentNodeTitle={handleSetCurrentNodeTitle}
                        />
                        <GeneralCompute
                          handleSetGeneralCompute={handleSetGeneralCompute}
                          currentPipelineId={pipeline.data.id}
                        />
                      </div>

                      <ConfigurationPage
                        justDisplay={justDisplay}
                        pipelines={pipelines}
                        pipeline={pipeline}
                        currentPipelineId={pipeline.data.id}
                        state={state.pipelineData[pipeline.data.id]}
                        handleSetCurrentNodeTitle={handleSetCurrentNodeTitle}
                        handleDispatchPipelines={handleDispatchPipelines}
                        handleSetCurrentComputeEnv={handleSetCurrentComputeEnv}
                        handleFormParameters={handleFormParameters}
                      />
                    </>
                  ) : (
                    <SpinContainer title="Fetching Pipeline Resources" />
                  )}
                </DataListContent>
              </DataListItem>
            );
          })
        )}
      </DataList>
    </>
  );
};

export default Pipelines;
