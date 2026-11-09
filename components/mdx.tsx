import { CodeBlock } from "@/components/CodeBlock";
import { Quiz } from "@/components/Quiz";
import { Operator } from "@/components/DepthProvider";
import {
  AgentTask,
  Callout,
  Evidence,
  Reveal,
  Section,
  Term,
} from "@/components/lesson-sections";

export const mdxComponents = {
  pre: CodeBlock,
  Section,
  Term,
  Reveal,
  Evidence,
  AgentTask,
  Callout,
  Quiz,
  Operator,
};
