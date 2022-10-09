import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { landingURL } from './config/config';
import api from './config/api';

export default function App() {
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
    type: ElementType;
    // Posiiton
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
  const [currentWindow, setCurrentWindow] = useState<number>();

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
      .catch(() => {
        window.location.replace(landingURL);
      });
  }, [pageID, projectID]);

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
        ?.elementData.map((element: any) => {
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
                  }}
                  type="text"
                  placeholder={element.text}
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
                  }}
                  placeholder={element.text}
                />
              );
            default:
              return undefined;
          }
        })}
    </div>
  );
}
