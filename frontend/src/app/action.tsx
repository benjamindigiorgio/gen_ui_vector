import "server-only";

import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  render,
} from "ai/rsc";
import {
  PGVectorStore,
  PGVectorStoreArgs,
} from "@langchain/community/vectorstores/pgvector";

import { formatDocumentsAsString } from "langchain/util/document";
import { BotMessage } from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";

import { BarChart, LineChart } from "@/components/streamables";
import { barSchema } from "@/components/streamables/zod/bar-chart";
import { lineSchema } from "@/components/streamables/zod/line-chart";

const embeddings = new OpenAIEmbeddings();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const formatMessage = (message: {
  role: "function" | "user" | "assistant" | "system";
  content: string;
  id?: string | undefined;
  name?: string | undefined;
}) => {
  return `${message.role}: ${message.content}`;
};

const config: PGVectorStoreArgs & { queryName: string } = {
  postgresConnectionOptions: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  },
  tableName: "documents",
  queryName: "match_documents",
};

const generatePrompt = (
  context: string,
  chat_history: string
) => `You are a data analyst at a major company. You are to help this company answer any questions about their data, complete analysis and provide input on the cleanliness of the data, etc.
If the question is in another language, reply in that language. 

Messages inside [] means that it's a UI element or a user event. For example:
- "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.

Answer the question based only on the following context and the current conversation, prioritize the question over the current conversation history.:
context: ${context}
current conversation: ${chat_history}

Only show a graph when asked for, you should generally opt to now show a graph unless it is asked for in the current question. If you are showing a graph you should match the language to that of the question.
When showing a graph you should perform any necessary calculations and ensure that there is data being passed to the data parameter it mustn't just be a name being passed to it, it also needs some data associated with it.
If you want to show a bar chart, call \`show_bar_chart\` make sure that you pass data to this and in the data there is a name parameter and a data parameter which has a value, this is an example of the format [{name: 'Amphibians', 'Number of threatened species': 2488,}], categories should be an array of the name of the parameter you are passing into data other than name i.e: ['Number of threatened species'].
If you want to show a line chart, call \`show_line_chart\` make sure that you pass data to this and in the data there is a date parameter which should also be the index.
`;

async function submitUserMessage(userInput: string) {
  "use server";
  const aiState = getMutableAIState<typeof AI>();

  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);

  const formattedPreviousMessages = aiState.get().map(formatMessage);
  const chat_history = formattedPreviousMessages.join("\n");

  const store = await PGVectorStore.initialize(embeddings, config);

  const retriever = store.asRetriever();

  const context = formatDocumentsAsString(await retriever.invoke(userInput));

  const prompt = generatePrompt(context, chat_history);

  const reply = createStreamableUI(
    <BotMessage className="items-center">
      <Spinner />
    </BotMessage>
  );

  const ui = render({
    model: "gpt-4-turbo-preview",
    provider: openai,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      { role: "user", content: userInput },
    ],
    text: ({ content, done }) => {
      reply.update(<BotMessage>{content}</BotMessage>);
      if (done) {
        reply.done();
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return <p>{content}</p>;
    },
    tools: {
      show_bar_chart: {
        description: "Show a bar chart",
        parameters: barSchema,
        render: async function* ({ title, categories, data, index }) {
          yield <Spinner />;
          console.log(
            "BAR",
            "data:",
            data,
            "index:",
            index,
            "categories:",
            categories,
            "title:",
            title
          );

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_flight_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify({ title, categories, data, index }),
            },
          ]);

          return (
            <BarChart
              title={title}
              categories={categories}
              data={data}
              index={index}
            />
          );
        },
      },
      show_line_chart: {
        description: "Show a line chart",
        parameters: lineSchema,
        render: async function* ({ title, categories, data, index }) {
          yield <Spinner />;
          console.log(
            "LINE",
            "data:",
            data,
            "index:",
            index,
            "categories:",
            categories,
            "title:",
            title
          );

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_flight_info",
              content: JSON.stringify({ title, categories, data, index }),
            },
          ]);

          return (
            <LineChart
              title={title}
              categories={categories}
              data={data}
              index={index}
            />
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
