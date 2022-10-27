import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { appURL, landingURL } from './config/config';
import api from './config/api';
import Runtime from '@ieum-lang/ieum-runtime';
import DefaultTypes from '@ieum-lang/ieum/dist/data/type/DefaultTypes';
import { nodeData } from './data/data';
import { NodesAction } from '@ieum-lang/ieum-runtime/dist/data/NodeAction';
import IEUM_listAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/dictNodesAction';
import IEUM_dictAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/listNodesAction';
import IEUM_stateAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/statementNodesAction';
import IEUM_mathAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/mathNodesAction';
import IEUM_logicAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/logicNodesAction';
import IEUM_varAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/variableNodesAction';

enum Part {
  HORIZONTAL = 'Horizontal',
  VERTICAL = 'Vertical',
}

enum ElementType {
  TEXT = 'text',
  LINE = 'line',
  IMAGE = 'image',
  VIDEO = 'video',
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
  SLINPUT = 'sl-input',
  MLINPUT = 'ml-input',
}

enum AssetType {
  FILE = 'file',
  FOLDER = 'folder',
}

interface Window {
  width: number;
  height: number;
  themeColor: string;
  route: string;
}

interface Element {
  name: string;
  id: number;
  isShown: boolean;
  type: ElementType;
  // Position
  x: string;
  y: string;
  xAlign: number;
  yAlign: number;
  rotation: string;
  index: number;
  // Size
  width?: string;
  height?: string;
  // Text
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  borderColor?: string;
  part?: Part;
  src?: number;
  canControl?: boolean;
  isChecked?: boolean;
}

interface Asset {
  name: string;
  id: number;
  type: AssetType;
  contents?: string;
  extension?: string;
  isOpened?: boolean;
}

class DataClass {
  static list: {
    [id: number]: string;
  } = {};
  static setTextValue(targetId: number, value: string) {
    this.list = {
      ...this.list,
      [targetId]: value,
    };
  }
}

export default function App() {
  const { projectID, pageID } = useParams();

  const [data, setData] = useState<{
    name: string;
    windowList: Array<{
      _id: string;
      name: string;
      id: number;
      windowData: Window;
      scriptData: any;
      elementData: Array<Element>;
    }>;
    assetList: Array<{
      id: number;
    }>;
    assetData: Array<Asset>;
    assetLength: number;
    route: string;
  }>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let subData: {
    name: string;
    windowList: Array<{
      _id: string;
      name: string;
      id: number;
      windowData: Window;
      scriptData: any;
      elementData: Array<Element>;
    }>;
    assetList: Array<{
      id: number;
    }>;
    assetData: Array<Asset>;
    assetLength: number;
    route: string;
  };
  const [currentWindow, setCurrentWindow] = useState<number>();
  const [runtime, setRuntime] = useState<Runtime>();
  const [runtimeProgress, setRuntimeProgress] = useState<number>(0);

  // NodeAction Field
  const [eventNodeAction, setEvent] = useState<NodesAction>();
  const [utilitiesNodeAction, setUtilities] = useState<NodesAction>();
  const [debugNodeAction, setDebug] = useState<NodesAction>();
  const [elementNodeAction, setElement] = useState<NodesAction>();
  const [assetNodeAction, setAsset] = useState<NodesAction>();
  const [fetchNodeAction, setFetch] = useState<NodesAction>();
  const [textVars, setTextVars] = useState<{
    [id: number]: string;
  }>();

  const modifyData = (data: {
    name: string;
    windowList: Array<{
      _id: string;
      name: string;
      id: number;
      windowData: Window;
      scriptData: any;
      elementData: Array<Element>;
    }>;
    assetList: Array<{
      id: number;
    }>;
    assetData: Array<Asset>;
    assetLength: number;
    route: string;
  }) => {
    subData = data;
    setData(data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (projectID === undefined) {
      window.location.replace(landingURL);
      return;
    }

    api
      .get(`/project/${projectID}`)
      .then((res) => {
        document.title = res.data.project.name;

        setCurrentWindow(
          res.data.project.windowList.find(
            (window: any) =>
              window._id ===
              (pageID ??
                res.data.project.windowList.find(
                  (window: any) => window.id === 0
                )._id)
          ).id
        );

        setData(res.data.project);
      })
      .catch((_) => {
        window.location.replace(landingURL);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageID, projectID]);

  useEffect(() => {
    if (currentWindow !== null && data && runtimeProgress === 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      subData = data;

      setEvent({
        'selenod.event.onLoad': (input: { execute: string }, runtime) => {
          if (input.execute === undefined) {
            return {};
          }

          runtime.executeNode(input.execute);

          return {};
        },
        'selenod.event.onClick': (
          input: {
            element: any;
            execute: string;
          },
          runtime
        ) => {
          if (input.execute === undefined) {
            return {};
          }

          runtime.executeNode(input.execute);

          return {};
        },
        'selenod.event.onChange': (
          input: {
            element: any;
            execute: string;
          },
          runtime
        ) => {
          if (input.execute === undefined) {
            return {};
          }

          runtime.executeNode(input.execute);

          return {};
        },
      });
      setUtilities({
        'selenod.utilities.sleep': (
          input: {
            delay: any;
            execute: string;
          },
          runtime
        ) => {
          setTimeout(() => {
            runtime.executeNode(input.execute);
          }, (input.delay.value ?? input.delay) * 1000);

          return {};
        },
        'selenod.utilities.redirectUrl': (input: {
          URL: string;
          'new Tab': boolean;
        }) => {
          window.open(input.URL, input['new Tab'] ? '_blank' : '_self');

          return {};
        },
        'selenod.utilities.redirectPage': (input: {
          name: string;
          'new Tab': boolean;
        }) => {
          window.open(
            appURL +
              subData.route +
              '/' +
              subData.windowList.find(
                (window: any) => window.name === input.name
              )!._id!,
            input['new Tab'] ? '_blank' : '_self'
          );

          return {};
        },
      });
      setDebug({
        'selenod.debug.print': (input: { message: any; param: any }) => {
          console.log(input.message);

          return {};
        },
        'selenod.debug.alert': (input: { message: any }) => {
          alert(input.message.value ?? input.message);

          return {};
        },
        'selenod.debug.try': (
          input: { execute: string; catch: string },
          runtime
        ) => {
          try {
            runtime?.executeNode(input.execute);
          } catch (e: any) {
            runtime?.executeNode(input.catch);
          }

          return {};
        },
      });
      setElement({
        'selenod.element.getByName': (input: { name: any }) => {
          return {
            name: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)?.name,
            id: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)?.id,
            x: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)?.x,
            y: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)?.y,
            'x Align': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.xAlign,
            'y Align': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.yAlign,
            'is Shown': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.isShown,
            rotation: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.rotation,
            index: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.index,
            width: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.width,
            height: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.height,
            text: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)?.text,
            'text Value':
              DataClass.list[
                subData?.windowList
                  .find((window: any) => window.id === currentWindow)!
                  .elementData.find((element) => element.name === input.name)!
                  .id
              ],
            'font Size': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.fontSize,
            'font Weight': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.fontWeight,
            color: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.color,
            'background Color': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.backgroundColor,
            'border Radius': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.borderRadius,
            'border Color': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.borderColor,
            'is Checked': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)
              ?.isChecked,
            'asset Id': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.name === input.name)?.src,
          };
        },
        'selenod.element.getById': (input: { id: any }) => {
          return {
            name: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.name,
            id: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.id,
            x: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.x,
            y: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.y,
            'x Align': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.xAlign,
            'y Align': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.yAlign,
            'is Shown': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.isShown,
            rotation: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.rotation,
            index: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.index,
            width: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.width,
            height: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.height,
            text: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.text,
            'text Value':
              DataClass.list[
                subData?.windowList
                  .find((window: any) => window.id === currentWindow)!
                  .elementData.find((element) => element.id === input.id)!.id
              ],
            'font Size': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.fontSize,
            'font Weight': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)
              ?.fontWeight,
            color: subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.color,
            'background Color': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)
              ?.backgroundColor,
            'border Radius': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)
              ?.borderRadius,
            'border Color': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)
              ?.borderColor,
            'is Checked': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)
              ?.isChecked,
            'asset Id': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.find((element) => element.id === input.id)?.src,
          };
        },
        'selenod.element.getList': () => {
          return {
            'name List': subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData.map((element) => element.name),
          };
        },
        'selenod.element.create': (input: {
          name: string;
          type: any;
          'is Shown': any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList.find(
                    (window: any) => window.id === currentWindow
                  )!.elementData,
                  {
                    id:
                      subData?.windowList.find(
                        (window: any) => window.id === currentWindow
                      )!.elementData.length === 0
                        ? 0
                        : subData?.windowList.find(
                            (window: any) => window.id === currentWindow
                          )!.elementData[
                            subData?.windowList.find(
                              (window: any) => window.id === currentWindow
                            )!.elementData.length - 1
                          ].id + 1,
                    name: input.name,
                    type:
                      input.type === 'Text'
                        ? ElementType.TEXT
                        : input.type === 'Line'
                        ? ElementType.LINE
                        : input.type === 'Image'
                        ? ElementType.IMAGE
                        : input.type === 'Button'
                        ? ElementType.BUTTON
                        : input.type === 'Checkbox'
                        ? ElementType.CHECKBOX
                        : input.type === 'Single-Line Input'
                        ? ElementType.SLINPUT
                        : ElementType.MLINPUT,
                    isShown: input['is Shown'],
                    x: '0',
                    y: '0',
                    xAlign: 0,
                    yAlign: 0,
                    rotation: '0',
                    index: 0,
                  },
                ],
              },
            ],
          });

          return {
            id:
              subData?.windowList.find(
                (window: any) => window.id === currentWindow
              )!.elementData.length === 0
                ? 0
                : subData?.windowList.find(
                    (window: any) => window.id === currentWindow
                  )!.elementData[
                    subData?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )!.elementData.length - 1
                  ].id,
          };
        },
        'selenod.element.deleteByName': (input: { name: string }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) => element.name !== input.name
                    ),
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.deleteById': (input: { id: number }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter((element) => element.id !== input.id),
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.rename': (input: { element: any; name: any }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      name: input.name,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setPos': (input: { element: any; x: any; y: any }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      x: input.x.value ?? input.x,
                      y: input.y.value ?? input.y,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setAlign': (input: {
          element: any;
          'x Align': any;
          'y Align': any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      xAlign: input['x Align'].value ?? input['x Align'],
                      yAlign: input['y Align'].value ?? input['y Align'],
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setRotation': (input: {
          element: any;
          rotation: any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      rotation: input.rotation.value ?? input.rotation,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setIndex': (input: { element: any; order: any }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      index: input.order.value ?? input.order,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setShow': (input: {
          element: any;
          'is Shown': any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      isShown: input['is Shown'],
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setSize': (input: {
          element: any;
          width: any;
          height: any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      width: input.width.value ?? input.width,
                      height: input.height.value ?? input.height,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setText': (input: { element: any; text: any }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      text: input.text.value ?? input.text,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setTextValue': (
          input: {
            element: any;
            text: any;
          },
          runtime
        ) => {
          DataClass.setTextValue(
            subData?.windowList
              .find((window: any) => window.id === currentWindow)!
              .elementData!.find((element) => element.name === input.element)
              ?.id!,
            input.text
          );
          setTextVars(DataClass.list);

          const scriptData = subData?.windowList.find(
            (window: any) => window.id === currentWindow
          )?.scriptData.data;

          Object.keys(scriptData).forEach((key) => {
            if (
              scriptData[key].nodeId === 'selenod.event.onChange' &&
              scriptData[key].inputConnections.filter(
                (connection: any) =>
                  connection.name === 'element' &&
                  connection.value === input.element
              ).length > 0
            ) {
              runtime?.executeNode(key);
            }
          });

          return {};
        },
        'selenod.element.setFontSize': (input: { element: any; size: any }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      fontSize: input.size.value ?? input.size,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setFontWeight': (input: {
          element: any;
          weight: any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      fontWeight: input.weight.value ?? input.weight,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setColor': (input: { element: any; color: any }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      color: input.color.value ?? input.color,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setBackgroundColor': (input: {
          element: any;
          color: any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      backgroundColor: input.color.value ?? input.color,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setBorderRadius': (input: {
          element: any;
          radius: any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      borderRadius: input.radius.value ?? input.radius,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setBorderColor': (input: {
          element: any;
          color: any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      borderColor: input.color.value ?? input.color,
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setChecked': (input: {
          element: any;
          'is Checked': any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      isChecked:
                        input['is Checked'].value ?? input['is Checked'],
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
        'selenod.element.setAsset': (input: {
          element: any;
          'asset Id': any;
        }) => {
          modifyData({
            ...subData,
            windowList: [
              ...subData.windowList.filter(
                (window: any) => window.id !== currentWindow
              ),
              {
                ...subData?.windowList.find(
                  (window: any) => window.id === currentWindow
                )!,
                elementData: [
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)!
                    .elementData.filter(
                      (element) =>
                        element.name !== (input.element.value ?? input.element)
                    ),
                  ...subData?.windowList
                    .find((window: any) => window.id === currentWindow)
                    ?.elementData!.filter(
                      (element) =>
                        element.name === (input.element.value ?? input.element)
                    )
                    ?.map((data) => ({
                      ...data,
                      src: input['asset Id'],
                    }))!,
                ],
              },
            ],
          });

          return {};
        },
      });
      setAsset({
        'selenod.asset.getByName': (input: { name: string }) => {
          const asset = data?.assetData.find(
            (asset) => asset.name + asset.extension === input.name
          );

          return {
            name:
              asset !== undefined &&
              asset.name !== undefined &&
              asset.extension !== undefined
                ? asset.name + asset.extension
                : undefined,
            id: asset?.id,
            contents: asset?.contents,
          };
        },
        'selenod.asset.getById': (input: { id: number }) => {
          const asset = data?.assetData.find((asset) => asset.id === input.id);

          return {
            name:
              asset !== undefined &&
              asset.name !== undefined &&
              asset.extension !== undefined
                ? asset.name + asset.extension
                : undefined,
            id: asset?.id,
            contents: asset?.contents,
          };
        },
      });
      setFetch({
        'selenod.fetch.get': (
          input: {
            url: string;
            headers: object;
            then: string;
            catch: string;
          },
          runtime
        ) => {
          let res: object;

          fetch(input.url, {
            headers: {
              ...input.headers,
            },
          })
            .then((response) => {
              res = response;

              return response.json();
            })
            .then((data) => {
              runtime.executeFunc(input.then, {
                response: res,
                data,
              });
            })
            .catch((error) => {
              runtime.executeFunc(input.catch, {
                response: res,
                error,
              });
            });

          return {};
        },
        'selenod.fetch.post': (
          input: {
            url: string;
            headers: object;
            body: object;
            then: string;
            catch: string;
          },
          runtime
        ) => {
          let res: object;

          fetch(input.url, {
            method: 'POST',
            headers: {
              ...input.headers,
            },
            body: JSON.stringify(input.body),
          })
            .then((response) => {
              res = response;

              return response.json();
            })
            .then(() => {
              runtime.executeFunc(input.then, {
                response: res,
              });
            })
            .catch((error) => {
              runtime.executeFunc(input.catch, {
                response: res,
                error,
              });
            });

          return {};
        },
      });

      setRuntimeProgress(1);
    } else if (runtimeProgress === 1) {
      setRuntime(
        new Runtime(
          [
            ...DefaultTypes,
            {
              name: 'elementType',
              elements: [
                'Text',
                'Line',
                'Image',
                'Button',
                'Checkbox',
                'Single-Line Input',
                'Multiple-Line Input',
              ],
              initialValue: 'Text',
              color: '#b86cff',
            },
          ],
          nodeData,
          {
            ...eventNodeAction,
            ...IEUM_listAction,
            ...IEUM_dictAction,
            ...utilitiesNodeAction,
            ...fetchNodeAction,
            ...IEUM_stateAction,
            ...elementNodeAction,
            ...assetNodeAction,
            ...debugNodeAction,
            ...IEUM_mathAction,
            ...IEUM_logicAction,
            ...IEUM_varAction,
          },
          data?.windowList.find(
            (window: any) => window.id === currentWindow
          )?.scriptData.data,
          data?.windowList.find(
            (window: any) => window.id === currentWindow
          )?.scriptData.variable
        )
      );

      setRuntimeProgress(2);
    } else if (runtimeProgress === 2) {
      runtime?.callEvent('selenod.event.onLoad', {});
      setRuntimeProgress(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWindow, runtimeProgress, utilitiesNodeAction, runtime]);

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: data?.windowList.find(
          (window: any) => window.id === currentWindow
        )?.windowData.themeColor,
        overflow: 'auto',
      }}
    >
      {data?.windowList
        .find((window: any) => window.id === currentWindow)
        ?.elementData.filter((element) => element.isShown)
        .map((element: any) => {
          switch (element.type) {
            case 'text':
              return (
                <pre
                  key={element.id}
                  style={{
                    position: 'absolute',
                    top: `calc(${
                      !isNaN(element.y as any) ? `${element.y}px` : element.y
                    })`,
                    left: `calc(${
                      !isNaN(element.x as any) ? `${element.x}px` : element.x
                    })`,
                    fontSize: element.fontSize,
                    fontWeight: element.fontWeight,
                    color: element.color,
                    margin: 0,
                    backgroundColor: element.backgroundColor,
                    transform: `translate(-${element.xAlign}%, -${
                      element.yAlign
                    }%) rotate(calc(${
                      !isNaN(element.rotation as any)
                        ? `${element.rotation}deg`
                        : element.rotation
                    }))`,
                    zIndex: element.index,
                  }}
                  onClick={() => {
                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onClick' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                >
                  {element.text}
                </pre>
              );
            case 'line':
              return (
                <div
                  key={element.id}
                  style={{
                    position: 'absolute',
                    top: `calc(${
                      !isNaN(element.y as any) ? `${element.y}px` : element.y
                    })`,
                    left: `calc(${
                      !isNaN(element.x as any) ? `${element.x}px` : element.x
                    })`,
                    width: `calc(${
                      !isNaN(element.width as any)
                        ? `${element.width}px`
                        : element.width
                    })`,
                    height: `calc(${
                      !isNaN(element.height as any)
                        ? `${element.height}px`
                        : element.height
                    })`,
                    borderRadius: '1rem',
                    backgroundColor: element.backgroundColor,
                    transform: `translate(-${element.xAlign}%, -${
                      element.yAlign
                    }%) rotate(calc(${
                      !isNaN(element.rotation as any)
                        ? `${element.rotation}deg`
                        : element.rotation
                    }))`,
                    zIndex: element.index,
                  }}
                  onClick={() => {
                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onClick' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                />
              );
            case 'image':
              return (
                <img
                  key={element.id}
                  src={
                    data.assetData.find(
                      (asset: any) => asset.id === element.src
                    )?.contents
                  }
                  alt=""
                  style={{
                    position: 'absolute',
                    top: `calc(${
                      !isNaN(element.y as any) ? `${element.y}px` : element.y
                    })`,
                    left: `calc(${
                      !isNaN(element.x as any) ? `${element.x}px` : element.x
                    })`,
                    width: `calc(${
                      !isNaN(element.width as any)
                        ? `${element.width}px`
                        : element.width
                    })`,
                    height: `calc(${
                      !isNaN(element.height as any)
                        ? `${element.height}px`
                        : element.height
                    })`,
                    transform: `translate(-${element.xAlign}%, -${
                      element.yAlign
                    }%) rotate(calc(${
                      !isNaN(element.rotation as any)
                        ? `${element.rotation}deg`
                        : element.rotation
                    }))`,
                    borderRadius: `calc(${
                      !isNaN(element.borderRadius as any)
                        ? `${element.borderRadius}px`
                        : element.borderRadius
                    })`,
                    zIndex: element.index,
                  }}
                  onClick={() => {
                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onClick' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                />
              );
            case 'video':
              return (
                <video
                  key={element.id}
                  poster={
                    data.assetData.find(
                      (asset: any) => asset.id === element.src
                    )?.contents
                  }
                  style={{
                    position: 'absolute',
                    top: `calc(${
                      !isNaN(element.y as any) ? `${element.y}px` : element.y
                    })`,
                    left: `calc(${
                      !isNaN(element.x as any) ? `${element.x}px` : element.x
                    })`,
                    width: `calc(${
                      !isNaN(element.width as any)
                        ? `${element.width}px`
                        : element.width
                    })`,
                    height: `calc(${
                      !isNaN(element.height as any)
                        ? `${element.height}px`
                        : element.height
                    })`,
                    transform: `translate(-${element.xAlign}%, -${
                      element.yAlign
                    }%) rotate(calc(${
                      !isNaN(element.rotation as any)
                        ? `${element.rotation}deg`
                        : element.rotation
                    }))`,
                    borderRadius: `calc(${
                      !isNaN(element.borderRadius as any)
                        ? `${element.borderRadius}px`
                        : element.borderRadius
                    })`,
                    zIndex: element.index,
                  }}
                  onClick={() => {
                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onClick' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                >
                  <source
                    src={
                      data.assetData.find(
                        (asset: any) => asset.id === element.src
                      )?.contents
                    }
                  />
                </video>
              );
            case 'button':
              return (
                <div
                  key={element.id}
                  className="button"
                  style={{
                    position: 'absolute',
                    top: `calc(${
                      !isNaN(element.y as any) ? `${element.y}px` : element.y
                    })`,
                    left: `calc(${
                      !isNaN(element.x as any) ? `${element.x}px` : element.x
                    })`,
                    width: `calc(${
                      !isNaN(element.width as any)
                        ? `${element.width}px`
                        : element.width
                    })`,
                    height: `calc(${
                      !isNaN(element.height as any)
                        ? `${element.height}px`
                        : element.height
                    })`,
                    transform: `translate(-${element.xAlign}%, -${
                      element.yAlign
                    }%) rotate(calc(${
                      !isNaN(element.rotation as any)
                        ? `${element.rotation}deg`
                        : element.rotation
                    }))`,
                    borderRadius: `calc(${
                      !isNaN(element.borderRadius as any)
                        ? `${element.borderRadius}px`
                        : element.borderRadius
                    })`,
                    backgroundColor: element.backgroundColor,
                    transition: 'ease-out background-color 100ms',
                    paddingLeft: 15,
                    paddingRight: 15,
                    minWidth: 70,
                    border: 0,
                    outline: 0,
                    color: element.color,
                    fontSize: element.fontSize,
                    fontWeight: element.fontWeight,
                    zIndex: element.index,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onClick' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                >
                  <p
                    style={{
                      position: 'relative',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      margin: 0,
                    }}
                  >
                    {element.text}
                  </p>
                </div>
              );
            case 'checkbox':
              return (
                <div
                  key={element.id}
                  style={{
                    position: 'absolute',
                    top: `calc(${
                      !isNaN(element.y as any) ? `${element.y}px` : element.y
                    })`,
                    left: `calc(${
                      !isNaN(element.x as any) ? `${element.x}px` : element.x
                    })`,
                    width: `calc(${
                      !isNaN(element.width as any)
                        ? `${element.width}px`
                        : element.width
                    })`,
                    height: `calc(${
                      !isNaN(element.width as any)
                        ? `${element.width}px`
                        : element.width
                    })`,
                    backgroundColor: element.backgroundColor,
                    transform: `translate(-${element.xAlign}%, -${
                      element.yAlign
                    }%) rotate(calc(${
                      !isNaN(element.rotation as any)
                        ? `${element.rotation}deg`
                        : element.rotation
                    }))`,
                    zIndex: element.index,
                    borderRadius: `calc(${
                      !isNaN(element.borderRadius as any)
                        ? `${element.borderRadius}px`
                        : element.borderRadius
                    })`,
                    boxSizing: 'border-box',
                    border: element.isChecked
                      ? undefined
                      : `1.5px solid ${element.borderColor}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    modifyData({
                      ...data,
                      windowList: [
                        ...data.windowList.filter(
                          (window: any) => window.id !== currentWindow
                        ),
                        {
                          ...data?.windowList.find(
                            (window: any) => window.id === currentWindow
                          )!,
                          elementData: [
                            ...data?.windowList
                              .find(
                                (window: any) => window.id === currentWindow
                              )!
                              .elementData.filter((el) => element.id !== el.id),
                            ...data.windowList
                              .find(
                                (window: any) => window.id === currentWindow
                              )!
                              .elementData!.filter(
                                (el) => element.id === el.id
                              )!
                              .map((el) => ({
                                ...el,
                                isChecked: !element.isChecked,
                              })),
                          ],
                        },
                      ],
                    });

                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onClick' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                >
                  {element.isChecked ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: element.color,
                        borderRadius: `calc(${
                          !isNaN(element.borderRadius as any)
                            ? `${element.borderRadius}px`
                            : element.borderRadius
                        })`,
                        cursor: 'pointer',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="#fff"
                        style={{
                          position: 'relative',
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : null}
                </div>
              );
            case 'sl-input':
              return (
                <input
                  key={element.id}
                  style={{
                    position: 'absolute',
                    top: `calc(${
                      !isNaN(element.y as any) ? `${element.y}px` : element.y
                    })`,
                    left: `calc(${
                      !isNaN(element.x as any) ? `${element.x}px` : element.x
                    })`,
                    width: `calc(${
                      !isNaN(element.width as any)
                        ? `${element.width}px`
                        : element.width
                    })`,
                    height: `calc(${
                      !isNaN(element.height as any)
                        ? `${element.height}px`
                        : element.height
                    })`,
                    transform: `translate(-${element.xAlign}%, -${
                      element.yAlign
                    }%) rotate(calc(${
                      !isNaN(element.rotation as any)
                        ? `${element.rotation}deg`
                        : element.rotation
                    }))`,
                    zIndex: element.index,
                    borderRadius: `calc(${
                      !isNaN(element.borderRadius as any)
                        ? `${element.borderRadius}px`
                        : element.borderRadius
                    })`,
                    boxSizing: 'border-box',
                    border: `1.5px solid ${element.borderColor}`,
                    fontSize: element.fontSize,
                    fontWeight: element.fontWeight,
                    color: element.color,
                    padding: '0 0.7rem',
                  }}
                  type="text"
                  placeholder={element.text}
                  value={
                    textVars !== undefined && textVars[element.id] !== undefined
                      ? textVars[element.id]
                      : ''
                  }
                  onChange={(e) => {
                    DataClass.setTextValue(element.id, e.target.value);
                    setTextVars(DataClass.list);

                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onChange' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                  onClick={() => {
                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onClick' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                />
              );
            case 'ml-input':
              return (
                <textarea
                  key={element.id}
                  style={{
                    position: 'absolute',
                    top: `calc(${
                      !isNaN(element.y as any) ? `${element.y}px` : element.y
                    })`,
                    left: `calc(${
                      !isNaN(element.x as any) ? `${element.x}px` : element.x
                    })`,
                    width: `calc(${
                      !isNaN(element.width as any)
                        ? `${element.width}px`
                        : element.width
                    })`,
                    height: `calc(${
                      !isNaN(element.height as any)
                        ? `${element.height}px`
                        : element.height
                    })`,
                    transform: `translate(-${element.xAlign}%, -${
                      element.yAlign
                    }%) rotate(calc(${
                      !isNaN(element.rotation as any)
                        ? `${element.rotation}deg`
                        : element.rotation
                    }))`,
                    zIndex: element.index,
                    borderRadius: `calc(${
                      !isNaN(element.borderRadius as any)
                        ? `${element.borderRadius}px`
                        : element.borderRadius
                    })`,
                    boxSizing: 'border-box',
                    border: `1.5px solid ${element.borderColor}`,
                    fontSize: element.fontSize,
                    fontWeight: element.fontWeight,
                    color: element.color,
                    resize: 'none',
                    padding: '0 0.7rem',
                  }}
                  placeholder={element.text}
                  value={
                    textVars !== undefined && textVars[element.id] !== undefined
                      ? textVars[element.id]
                      : ''
                  }
                  onChange={(e) => {
                    DataClass.setTextValue(element.id, e.target.value);
                    setTextVars(DataClass.list);

                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onChange' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                  onClick={() => {
                    const scriptData = data?.windowList.find(
                      (window: any) => window.id === currentWindow
                    )?.scriptData.data;

                    Object.keys(scriptData).forEach((key) => {
                      if (
                        scriptData[key].nodeId === 'selenod.event.onClick' &&
                        scriptData[key].inputConnections.filter(
                          (connection: any) =>
                            connection.name === 'element' &&
                            connection.value === element.name
                        ).length > 0
                      ) {
                        runtime?.executeNode(key);
                      }
                    });
                  }}
                />
              );
            default:
              return undefined;
          }
        })}
    </div>
  );
}
