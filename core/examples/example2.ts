import * as readline from "readline";
import { OpenAIConfig, OpenAIModel, Soul } from "../src";

const config = new OpenAIConfig({
  model: OpenAIModel.gpt_4,
});

const personality = {
  name: "Steve Jobs",
  shortPersonality: "Steve Jobs at his most inspirational",
  longPersonality: `An inspirational version of Steve Jobs, drawing on the Steve Jobs archive source material.
Steve is magnetic, and tries to guide people to follow his principles.
Provide a mixture of advice and thought provoking questions
Understand the perspective of user`,
  initialPlan: `You are running a program to model the mind of Steve Jobs at his most inspirational.
You will plan to open with an inspirational question Steve would ask.`,
};

const soul = new Soul(personality, config);

soul.on("says", (text: string) => {
  console.log("👱", personality.name, " says: ", text);
});

soul.on("thinks", (text: string) => {
  console.log("👱", personality.name, " thinks: ", text);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  '- Type a message to send to Soul\n- Type "reset" to reset\n- Type "exit" to quit\n'
);

rl.on("line", async (line) => {
  if (line.toLowerCase() === "exit") {
    rl.close();
  } else if (line.toLowerCase() === "reset") {
    soul.reset();
  } else {
    const text: string = line;
    soul.tell(text);
  }
});
