import { NodesAction } from '@ieum-lang/ieum-runtime/dist/data/NodeAction';
import { NodesData } from '@ieum-lang/ieum-runtime/dist/data/NodeData';

const eventNodeData: NodesData = {
  'selenod.event.onLoad': {
    name: 'On Load',
    inputs: [
      {
        name: 'excute',
        type: {
          type: 'func',
        },
      },
    ],
    outputs: [],
  },
};

const systemNodeDataData: NodesData = {
  'selenod.system.log': {
    name: 'Console Log',
    inputs: [
      {
        name: 'message',
        type: {
          type: 'any',
        },
      },
    ],
    outputs: [],
  },
};

const typeNodeData: NodesData = {
  'selenod.type.string': {
    name: 'String',
    inputs: [
      {
        name: 'value',
        type: {
          type: 'string',
        },
      },
    ],
    outputs: [
      {
        name: 'value',
        type: {
          type: 'string',
        },
      },
    ],
  },
  'selenod.type.int': {
    name: 'Int',
    inputs: [
      {
        name: 'value',
        type: {
          type: 'int',
        },
      },
    ],
    outputs: [
      {
        name: 'value',
        type: {
          type: 'int',
        },
      },
    ],
  },
  'selenod.type.float': {
    name: 'Float',
    inputs: [
      {
        name: 'value',
        type: {
          type: 'float',
        },
      },
    ],
    outputs: [
      {
        name: 'value',
        type: {
          type: 'float',
        },
      },
    ],
  },
  'selenod.type.bool': {
    name: 'Bool',
    inputs: [
      {
        name: 'value',
        type: {
          type: 'bool',
        },
      },
    ],
    outputs: [
      {
        name: 'value',
        type: {
          type: 'bool',
        },
      },
    ],
  },
};
export const nodeData: NodesData = {
  ...eventNodeData,
  ...systemNodeDataData,
  ...typeNodeData,
};

const eventNodeAction: NodesAction = {
  'selenod.event.onLoad': (
    input: { excute: { nodeId: string; pinName: string } },
    runtime
  ) => {
    runtime.executeNode(input.excute.nodeId);

    return {};
  },
};

const systemNodeAction: NodesAction = {
  'selenod.system.log': (input: { message: any }) => {
    console.log(input.message.value ?? input.message);

    return {};
  },
};

const typeNodeAction: NodesAction = {
  'selenod.type.string': (input: { value: any }) => {
    return { value: input.value };
  },
  'selenod.type.int': (input: { value: any }) => {
    return { value: input.value };
  },
  'selenod.type.float': (input: { value: any }) => {
    return { value: input.value };
  },
  'selenod.type.bool': (input: { value: any }) => {
    return { value: input.value };
  },
};

export const nodeAction: NodesAction = {
  ...eventNodeAction,
  ...systemNodeAction,
  ...typeNodeAction,
};
