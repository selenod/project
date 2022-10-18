import { NodesAction } from '@ieum-lang/ieum-runtime/dist/data/NodeAction';
import { NodesData } from '@ieum-lang/ieum-runtime/dist/data/NodeData';
import IEUM_listNode from '@ieum-lang/ieum/dist/data/defaultNodes/listNodes';
import IEUM_dictNode from '@ieum-lang/ieum/dist/data/defaultNodes/dictNodes';
import IEUM_mathNode from '@ieum-lang/ieum/dist/data/defaultNodes/mathNodes';
import IEUM_listAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/dictNodesAction';
import IEUM_dictAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/listNodesAction';
import IEUM_mathAction from '@ieum-lang/ieum-runtime/dist/data/defaultNodesAction/mathNodesAction';

let variables: Array<{
  name: string;
  value: any;
}> = [];

// NodeData Field
const eventNodeData: NodesData = {
  'selenod.event.onLoad': {
    name: 'On Load',
    inputs: [
      {
        name: 'execute',
        type: {
          type: 'func',
        },
      },
    ],
    outputs: [],
  },
  'selenod.event.onClick': {
    name: 'On Click',
    inputs: [
      {
        name: 'target',
        type: {
          type: 'enum',
        },
      },
      {
        name: 'execute',
        type: {
          type: 'func',
        },
      },
    ],
    outputs: [],
  },
};

const stringNodeData: NodesData = {
  'selenod.string.constructor': {
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
        name: 'return',
        type: {
          type: 'string',
        },
      },
    ],
  },
  'selenod.string.concatenate': {
    name: 'Concatenate',
    inputs: [
      {
        name: 'value1',
        type: {
          type: 'string',
        },
      },
      {
        name: 'value2',
        type: {
          type: 'string',
        },
      },
    ],
    outputs: [
      {
        name: 'return',
        type: {
          type: 'string',
        },
      },
    ],
  },
};

const intNodeData: NodesData = {
  'selenod.int.constructor': {
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
        name: 'return',
        type: {
          type: 'int',
        },
      },
    ],
  },
  'selenod.int.intToFloat': {
    name: 'Int to Float',
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
        name: 'return',
        type: {
          type: 'float',
        },
      },
    ],
  },
};

const floatNodeData: NodesData = {
  'selenod.float.constructor': {
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
        name: 'return',
        type: {
          type: 'float',
        },
      },
    ],
  },
  'selenod.float.floatToInt': {
    name: 'Float to Int',
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
        name: 'return',
        type: {
          type: 'int',
        },
      },
    ],
  },
};

const boolNodeData: NodesData = {
  'selenod.bool.constructor': {
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
        name: 'return',
        type: {
          type: 'bool',
        },
      },
    ],
  },
};

const variableNodeData: NodesData = {
  'selenod.variable.setVariable': {
    name: 'Set Variable',
    inputs: [
      {
        name: 'name',
        type: {
          type: 'string',
        },
      },
      {
        name: 'value',
        type: {
          type: 'any',
        },
      },
    ],
    outputs: [],
  },
  'selenod.variable.getVariable': {
    name: 'Get Variable',
    inputs: [
      {
        name: 'name',
        type: {
          type: 'string',
        },
      },
    ],
    outputs: [
      {
        name: 'return',
        type: {
          type: 'any',
        },
      },
    ],
  },
};

const debugNodeData: NodesData = {
  'selenod.debug.print': {
    name: 'Print',
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
  'selenod.debug.alert': {
    name: 'Alert',
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

const statementNodeData: NodesData = {
  'selenod.statement.branch': {
    name: 'Branch',
    inputs: [
      {
        name: 'condition',
        type: {
          type: 'bool',
        },
      },
      {
        name: 'true',
        type: {
          type: 'nullable',
          metadata: {
            T: {
              type: 'func',
            },
          },
        },
      },
      {
        name: 'false',
        type: {
          type: 'nullable',
          metadata: {
            T: {
              type: 'func',
            },
          },
        },
      },
    ],
    outputs: [],
  },
  'selenod.statement.if': {
    name: 'If',
    inputs: [
      {
        name: 'condition',
        type: {
          type: 'bool',
        },
      },
      {
        name: 'true',
        type: {
          type: 'any',
        },
      },
      {
        name: 'false',
        type: {
          type: 'any',
        },
      },
    ],
    outputs: [
      {
        name: 'return',
        type: {
          type: 'any',
        },
      },
    ],
  },
  'selenod.statement.while': {
    name: 'While',
    inputs: [
      {
        name: 'condition',
        type: {
          type: 'func',
          metadata: {
            inputs: [],
            outputs: [{ name: 'return', type: { type: 'bool' } }],
          },
        },
      },
      {
        name: 'execute',
        type: {
          type: 'func',
        },
      },
    ],
    outputs: [],
  },
  'selenod.statement.repeat': {
    name: 'Repeat',
    inputs: [
      {
        name: 'count',
        type: {
          type: 'int',
        },
      },
      {
        name: 'execute',
        type: {
          type: 'func',
        },
      },
    ],
    outputs: [],
  },
  'selenod.statement.sleep': {
    name: 'Sleep',
    inputs: [
      {
        name: 'delay',
        type: {
          type: 'float',
        },
      },
      {
        name: 'execute',
        type: {
          type: 'func',
        },
      },
    ],
    outputs: [],
  },
};

// NodeAction Field
const eventNodeAction: NodesAction = {
  'selenod.event.onLoad': (
    input: { execute: { nodeId: string; pinName: string } },
    runtime
  ) => {
    runtime.executeNode(input.execute.nodeId);

    return {};
  },
  // TODO
  'selenod.event.onClick': (
    input: {
      target: any;
      execute: { nodeId: string; pinName: string };
    },
    runtime
  ) => {
    if (input.target.value ?? input.target === 'No Element') {
      return {};
    }

    runtime.executeNode(input.execute.nodeId);

    return {};
  },
};

const typeNodeAction: NodesAction = {
  'selenod.string.constructor': (input: { value: any }) => {
    return { return: input.value.value ?? input.value };
  },
  'selenod.int.constructor': (input: { value: any }) => {
    return { return: input.value.value ?? input.value };
  },
  'selenod.float.constructor': (input: { value: any }) => {
    return { return: input.value.value ?? input.value };
  },
  'selenod.bool.constructor': (input: { value: any }) => {
    return { return: input.value.value ?? input.value };
  },
  'selenod.string.concatenate': (input: {
    value1: { value: any };
    value2: { value: any };
  }) => {
    return {
      return:
        (input.value1.value ?? input.value1) +
        (input.value2.value ?? input.value2),
    };
  },
  'selenod.int.intToFloat': (input: { value: any }) => {
    return { return: input.value.value ?? input.value };
  },
  'selenod.float.floatToInt': (input: { value: any }) => {
    return { return: Math.floor(input.value.value ?? input.value) };
  },
};

const statementNodeAction: NodesAction = {
  'selenod.statement.branch': (
    input: {
      condition: { value: boolean };
      true: { nodeId: string; pinName: string };
      false: { nodeId: string; pinName: string };
    },
    runtime
  ) => {
    runtime.executeNode(
      input.condition.value ? input.true.nodeId : input.false.nodeId
    );

    return {};
  },
  'selenod.statement.if': (input: {
    condition: { value?: boolean };
    true: { value?: any };
    false: { value?: any };
  }) => {
    return {
      return:
        input.condition.value ?? input.condition
          ? input.true.value ?? input.true
          : input.false.value ?? input.false,
    };
  },
  'selenod.statement.while': async (
    input: {
      condition: { nodeId: string; pinName: string };
      execute: { nodeId: string; pinName: string };
    },
    runtime
  ) => {
    while (true) {
      const condition = runtime.executeNode(input.condition.nodeId);

      if (condition.return.value) {
        await runtime.executeNode(input.execute.nodeId);
      } else {
        break;
      }
    }

    return {};
  },
  'selenod.statement.repeat': async (
    input: {
      count: { value?: number };
      execute: { nodeId: string; pinName: string };
    },
    runtime
  ) => {
    for (let i = 0; i < (input.count.value ?? input.count); i++) {
      await runtime.executeNode(input.execute.nodeId);
    }

    return {};
  },
  'selenod.statement.sleep': async (
    input: {
      delay: any;
      execute: { nodeId: string; pinName: string };
    },
    runtime
  ) => {
    const timeoutPromise = () =>
      new Promise((resolve) =>
        setTimeout(resolve, (input.delay.value ?? input.delay) * 1000)
      );

    await timeoutPromise();
    runtime.executeNode(input.execute.nodeId);

    return {};
  },
};

const variableNodeAction: NodesAction = {
  'selenod.variable.setVariable': (input: { name: any; value: any }) => {
    if (
      variables.find(
        (variable) => variable.name === input.name.value ?? input.name
      ) === undefined
    ) {
      variables.push({
        name: input.name.value ?? input.name,
        value: input.value.value ?? input.value,
      });
    } else {
      variables[
        variables.findIndex(
          (variable) => variable.name === input.name.value ?? input.name
        )
      ] = input.value.value ?? input.value;
    }

    return {};
  },
  'selenod.variable.getVariable': (input: { name?: any }) => {
    return {
      return: variables.find(
        (variable) => variable.name === input.name.value ?? input.name
      )?.value,
    };
  },
};

const debugNodeAction: NodesAction = {
  'selenod.debug.print': (input: { message: any }) => {
    console.log(input.message.value ?? input.message);

    return {};
  },
  'selenod.debug.alert': (input: { message: any }) => {
    alert(input.message.value ?? input.message);

    return {};
  },
};

// Export Field
export const nodeData: NodesData = {
  ...eventNodeData,
  ...stringNodeData,
  ...intNodeData,
  ...floatNodeData,
  ...boolNodeData,
  ...IEUM_listNode,
  ...IEUM_dictNode,
  ...statementNodeData,
  ...variableNodeData,
  ...debugNodeData,
  ...IEUM_mathNode,
};

export const nodeAction: NodesAction = {
  ...eventNodeAction,
  ...typeNodeAction,
  ...IEUM_listAction,
  ...IEUM_dictAction,
  ...statementNodeAction,
  ...variableNodeAction,
  ...debugNodeAction,
  ...IEUM_mathAction,
};
