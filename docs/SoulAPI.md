# socialagi

The `socialagi` library provides a robust, event-driven architecture for creating applications with a focus on conversational AI and decision-making models calLed 'AI Souls'.

## Installation

```shell
npm install socialagi
```

## API Reference

### Classes

#### Soul

The `Soul` class represents an entity's knowledge and behavior. It is a central component that holds internal information, is attached with mental models, learns directives, and has a capability to recall its state.

```typescript
const soul = new Soul();
```

##### Soul.internalize(key: string, value: any): Soul

Stores internal information of the `Soul` instance. This information can include any data relevant to the soul, such as its name, personality, or other traits. Returns the `Soul` instance for method chaining.

```typescript
soul.internalize('NAME', 'Samantha');
```

##### Soul.adopt(model: MentalModel): Soul

Attaches a `MentalModel` to the `Soul` instance. A `MentalModel` in `socialagi` is a reactive knowledge structure that an AI entity, or "soul", uses to interpret and interact with its environment. It learns and adapts over time, updating its state based on new data and events, thereby shaping the Soul's behavior and decision-making process. Returns the `Soul` instance for method chaining.

```typescript
soul.adopt(conversationModel);
```

##### Soul.learn(directive: Directive): Soul

Teaches a `Directive` to the `Soul` instance. A `Directive` represents an action that the soul can take. This could include anything from sending a reply in a conversation to making a decision based on its models. Returns the `Soul` instance for method chaining.

```typescript
soul.learn(replyDirective);
```

##### Soul.recall(predicate: Function): Promise<any>

Retrieves information from the `Soul` instance's memory based on a predicate function. Returns a Promise that resolves with the retrieved information.

```typescript
const soulName = await soul.recall((mentalState: MentalState) => mentalState.NAME);
```

### Factories

#### createMentalModel

The `createMentalModel` function is used to create `MentalModel` instances. 

```typescript
const model = createMentalModel(name: string, config: ModelConfig);
```

Where `ModelConfig` is an object with the following interface:

```typescript
interface ModelConfig {
  shouldUpdate: (oldState: any, newState: any) => boolean;
  update: (modelState: any, change: any, instruction: string) => void;
}
```

`shouldUpdate` is a function that takes the current and new states and returns a boolean indicating whether the mental model should be updated.

`update` is a function that performs the update on the model state given the change and instruction.

```typescript
const conversationModel = createMentalModel(
  'CONVERSATION',
  {
    shouldUpdate: (oldState, newState) => oldState.LATEST_MESSAGE !== newState.LATEST_MESSAGE,
    update: (modelState, change, instruction) => ApplyUpdate(modelState, change, instruction)
  }
);
```

#### createDirective

The `createDirective` function is used to create `Directive` instances.

```typescript
const directive = createDirective(name: string, config: DirectiveConfig);
```

Where `DirectiveConfig` is an object with the following interface:

```typescript
interface DirectiveConfig {
  execute: (execute: ExecuteFunction, recall: RecallFunction, data: any, emit: EmitFunction) => Promise<void>;
}

type RecallFunction = (recallFunc: (mentalState: any) => any) => any;
```

`execute` is an async function that implements the directive's behavior.

```typescript
const replyDirective = createDirective('REPLY', {
  execute: async (execute, recall, data, emit) => {
    // ...
  }
});
```

### execute

The `execute` function instructs a `Soul` instance to execute a specific `Directive`. This function returns an `EventEmitter` which emits various events throughout the execution of the directive. The 'end' event signifies the end of the directive's execution.

#### Syntax

```typescript
function execute(directiveName: string, data?: any): EventEmitter;
```

#### Parameters

- **soul**: A `Soul` instance that the directive will be issued to.
- **directiveName**: A string representing the name of the directive to be executed.
- **data**: Optional data that the directive will use during its execution.

#### Return Value

An instance of Node.js `EventEmitter`.

#### Events

The returned `EventEmitter` can emit the following events:

- **progress**: Emits progress updates throughout the execution of the directive.
- **error**: Emits if there's an error during the execution of the directive.
- **end**: Emits when the execution of the directive has finished.

#### Example

```typescript
const events = soul.execute('REPLY', {user: 'kevin', content: 'hi'});

events.on('progress', (progressData) => {
  console.log('Progress:', progressData);
});

events.on('end', (result) => {
  console.log('Result:', result);
});
```





## Core concepts

Sure, I'd be happy to help. The `socialagi` library, based on your description, appears to revolve around a few core concepts:

1. **Soul**: This is the central class in `socialagi` and acts as a representation of an AI entity's knowledge and behavior. The `Soul` holds internal information, attaches with mental models, learns directives, and recalls its state.

2. **MentalModel**: This is a reactive knowledge structure that a `Soul` uses to interpret and interact with its environment. A `MentalModel` learns and adapts over time, updating its state based on new data and events, thus helping shape the Soul's behavior and decision-making process.

3. **Directive**: A directive represents an action that a `Soul` can take. It could include anything from responding to a conversation to making decisions based on its models. The `Soul` can learn a `Directive` and then execute it later.

4. **Recall**: This function is used by the `Soul` to retrieve information from its memory based on a predicate function. It can be used to make decisions or shape the course of a conversation.

5. **Factories**: Factories in `socialagi` help in creating instances of `MentalModel` and `Directive`. The `createMentalModel` and `createDirective` functions are used for this purpose, respectively.

6. **Execute**: This function instructs a `Soul` to execute a specific `Directive`. It returns an `EventEmitter` which emits events throughout the directive's execution. This allows tracking of the directive's progress and handling of errors and successful completion.

These concepts help encapsulate various aspects of conversational AI, such as memory, learning, decision-making, and behavior execution in a well-structured way. They provide the basic building blocks to create complex AI entities with diverse personalities and behaviors.







## Mental Models


Mental models in the context of `socialagi` provide a method for AI entities, or "souls", to reactively adapt their behavior based on learned patterns of thought. These learned patterns can be seen as implicit representations of thought processes.

Consider a mental model as a cognitive structure that provides a framework for how the AI understands, interprets, and interacts with its environment. In `socialagi`, this cognitive structure is represented through reactive update functions that alter the state of the model.

When you define a `MentalModel` using the `createMentalModel` function, you provide two functions: `shouldUpdate` and `update`.

- `shouldUpdate(oldState, newState)`: This function is called whenever the state of the AI or its environment changes. It compares the current state and the new state, and returns a boolean indicating whether the mental model needs to update. This is where the AI evaluates whether a new input or event is significant enough to warrant an update to its mental model. This mirrors how humans might decide whether new information changes their perspective or understanding of a situation.

- `update(modelState, change, instruction)`: If `shouldUpdate` returns `true`, this function is called to perform the update. It modifies the model's state based on the change and instruction, implementing the "learning" process for the AI. This can represent how a human's perspective or behavior might change based on new experiences or information.

Through this reactive model of updating and learning, `socialagi` can replicate complex patterns of thought. For example, if an AI soul has a mental model for understanding emotions in text, it might update that model when it encounters new patterns of words and phrases associated with certain emotions. Over time, the AI soul would refine its understanding and become better at recognizing and reacting to emotions in text, replicating the learning process that humans undergo.




Certainly, let's upgrade the `socialagi` library documentation to a more comprehensive, world-class standard. Here is a sample structure:

---

# `socialagi` Library Documentation

## Overview

The `socialagi` library is for building applications focused on conversational AI and decision-making models, also referred to as 'AI Souls'. Through its robust, event-driven architecture, developers can create AI entities that are capable of learning, adapting, making decisions, and interacting with their environment in sophisticated ways.

## Getting Started

### Installation

To install `socialagi`, run the following command in your Node.js environment:

```shell
npm install socialagi
```

## Core Concepts

### Soul

At the heart of the `socialagi` library is the `Soul` class. This represents an AI entity's knowledge and behavior. A `Soul` object:

- Holds internal information such as its name, personality, or other traits.
- Utilizes `MentalModel` objects to learn about and interact with its environment.
- Learns and executes `Directives` to take actions and make decisions.
- Can recall its state and retrieve information from its memory.

For detailed usage, refer to the [Soul API](#soul-api).

### MentalModel

A `MentalModel` is a reactive knowledge structure that a `Soul` uses to interpret and interact with its environment. It learns and adapts over time, updating its state based on new data and events, influencing the `Soul's` behavior and decision-making process.

Refer to the [Mental Model API](#mental-model-api) for detailed usage.

### Directive

A `Directive` represents an action or a set of actions that a `Soul` can execute. This could include replying in a conversation, or making complex decisions based on its internal state and `MentalModels`.

Detailed usage can be found in the [Directive API](#directive-api).

## API Reference

### <a name="soul-api"></a>Soul API

// Detailed Soul API documentation here.

### <a name="mental-model-api"></a>Mental Model API

// Detailed Mental Model API documentation here.

### <a name="directive-api"></a>Directive API

// Detailed Directive API documentation here.

### <a name="issue-directive-api"></a>Issue Directive API

// Detailed issueDirective API documentation here.

## Examples

In this section, we would present a variety of practical examples to help developers understand how to apply `socialagi` in their applications.

---

The documentation would then continue with detailed descriptions of each class and function, complete with examples, expected parameters, return values, and error handling considerations. Remember, top-tier documentation should always consider the needs of the developer, providing comprehensive and easy-to-understand explanations, examples, and detailed API information.






# How to Use the socialagi Library

This page walks you through the process of creating a Soul and interacting with it. We'll cover everything from installation to creating mental models and directives.

## Installation

Before using the `socialagi` library, you must install it:

```shell
npm install socialagi
```

## Creating a Soul

To create a `Soul` instance:

```typescript
import { Soul } from 'socialagi';

const soul = new Soul();
```

Now, you can start to interact with your Soul.

## Internalizing Information

To store information within the `Soul`:

```typescript
soul.internalize('NAME', 'Samantha');
```

The `internalize` function stores key-value pairs within the Soul's memory.

## Creating a Mental Model

To create a `MentalModel`, use the `createMentalModel` function:

```typescript
import { createMentalModel } from 'socialagi';

const conversationModel = createMentalModel(
  'CONVERSATION',
  {
    shouldUpdate: (oldState, newState) => oldState.LATEST_MESSAGE !== newState.LATEST_MESSAGE,
    update: (modelState, change, instruction) => ApplyUpdate(modelState, change, instruction)
  }
);
```

Once the model is created, you can attach it to the `Soul`:

```typescript
soul.adopt(conversationModel);
```

## Creating a Directive

To create a `Directive`, use the `createDirective` function:

```typescript
import { createDirective } from 'socialagi';

const replyDirective = createDirective('REPLY', {
  execute: async (soulRecall, data, emit) => {
    // implementation of directive...
  }
});
```

Teach the `Directive` to the `Soul`:

```typescript
soul.learn(replyDirective);
```

# Understanding the Life Cycle of a Soul

A `Soul` in `socialagi` follows a distinct lifecycle:

1. **Initialization**: When a `Soul` is created, it's a blank slate. It doesn't have any mental models or directives yet. It's simply an entity capable of learning and adapting.

2. **Learning Phase**: During the learning phase, the `Soul` is taught different mental models and directives. This is where it gains the ability to interact with its environment.

3. **Interaction Phase**: During this phase, the `Soul` begins to interact with the world. It takes in data, updates its mental models, and issues directives.

4. **Adaptation Phase**: Over time, as the `Soul` encounters new situations and data, it adapts. Its mental models update, and it may learn new directives. It becomes more capable of handling complex situations and tasks.

5. **Termination**: When the `Soul` is no longer needed, it can be terminated. This ends its lifecycle.

Understanding this lifecycle can help you better



That's correct, with meta-learning, the strategy should determine not only the `shouldUpdate` and `update` methods, but also the name of the mental model being created. This strategy might use specific conditions to decide the name and other parameters of the mental model. Let's redefine the `LearningStrategy` interface and update our `metaLearn` usage example:

```typescript
// Redefining the Strategy Interface for creating Mental Models
interface LearningStrategy {
  getModelName: (soulState: any) => string;
  shouldUpdate: (oldState: any, newState: any) => boolean;
  update: (modelState: any, change: any, instruction: string) => void;
}

// Example usage

const strategy: LearningStrategy = {
  getModelName: (soulState) => soulState.LATEST_EMOTION,
  shouldUpdate: (oldState, newState) => oldState.LATEST_MESSAGE !== newState.LATEST_MESSAGE,
  update: (modelState, change, instruction) => ApplyUpdate(modelState, change, instruction)
};

soul.metaLearn(
  (soulState) => soulState.LATEST_MESSAGE.includes('emotion:'),
  strategy
);
```

In this updated version, the `LearningStrategy` interface now includes a `getModelName` function that determines the name of the mental model based on the current state of the soul. In the usage example, the `getModelName` function returns the latest detected emotion as the name for the new mental model. Thus, whenever a new emotion is detected in a message, a new mental model for that emotion is created and learned by the soul. This makes the learning process much more dynamic and context-sensitive.