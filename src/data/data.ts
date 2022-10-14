import { NodesAction } from '@ieum-lang/ieum-runtime/dist/data/NodeAction';
import { NodesData } from '@ieum-lang/ieum-runtime/dist/data/NodeData';

const eventNodeData: NodesData = {
  'selenod.event.onLoad': {
    name: 'On Load',
    inputs: [
      {
        name: 'do',
        type: {
          type: 'func',
        },
      },
    ],
    outputs: [],
  },
};

const consoleNodeData: NodesData = {
  'selenod.console.log': {
    name: 'Console Log',
    inputs: [
      {
        name: 'message',
        type: {
          type: 'any',
        },
        defaultValue: '',
      },
    ],
    outputs: [],
  },
};

export const nodeData: NodesData = {
  ...eventNodeData,
  ...consoleNodeData,
};

const eventNodeAction: NodesAction = {
  'selenod.event.onLoad': (
    input: { do: { nodeId: string; pinName: string } },
    runtime
  ) => {
    runtime.executeNode(input.do.nodeId);

    return {};
  },
};

const consoleNodeAction: NodesAction = {
  'selenod.console.log': (input: { message: any }) => {
    console.log(input.message);

    return {};
  },
};

export const nodeAction: NodesAction = {
  ...eventNodeAction,
  ...consoleNodeAction,
};
