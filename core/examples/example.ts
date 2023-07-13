import {
  Action,
  ChatMessage,
  CortexManager,
  CortexStep,
  ProcessConfig,
  QueuingStrategy,
} from "../src/index";
import { AbortSignal } from "abort-controller";

const SamanthaReplies = async (
  signal: AbortSignal,
  newMemory: ChatMessage,
  lastStep: CortexStep
) => {
  let step = lastStep;
  step = step.withMemory([newMemory]);
  const shouts = await step.next(Action.EXTERNAL_DIALOG, {
    action: "shouts in all caps",
  });
  if (signal.aborted) {
    return step;
  } else {
    console.log("Samantha says: ", shouts.value);
    return shouts;
  }
};
const simpleQueuingStrategy: QueuingStrategy = (currentJob, queue, newJob) => {
  currentJob?.abortController?.abort();
  return [newJob];
};
const samanthaRepliesConfig: ProcessConfig = {
  name: "SamanthaReplies",
  process: SamanthaReplies,
};

const initialMemories = [
  {
    role: "system",
    content: "<Context>You are modeling the mind of Samantha</Context>",
  },
] as ChatMessage[];
let firstStep = new CortexStep("Samantha");
firstStep = firstStep.withMemory(initialMemories);
const cortex = new CortexManager(firstStep, {
  queuingStrategy: simpleQueuingStrategy,
});
cortex.registerProcess(samanthaRepliesConfig);

// run
cortex.queueProcess("SamanthaReplies", {
  role: "user",
  content: "Hello, Samantha!",
} as ChatMessage);

cortex.queueProcess("SamanthaReplies", {
  role: "user",
  content: "F U!",
} as ChatMessage);
