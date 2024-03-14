"use server";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { db } from "@/lib/utils/drizzle";
import {
  PGVectorStore,
  type PGVectorStoreArgs,
} from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { documents } from "../../schemas/documents";

export const addDocument = async (formData: FormData) => {
  const file = formData.get("file") as File;
  console.log("adding file:", file.name);
  try {
    const fileType = file.type;

    let loader: CSVLoader | PDFLoader | TextLoader | DocxLoader | null = null;

    switch (fileType) {
      case "application/pdf":
        loader = new PDFLoader(file);
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        loader = new DocxLoader(file);
        break;
      case "application/vnd.ms-excel":
      case "text/csv":
        loader = new CSVLoader(file);
        break;
      case "text/plain":
        loader = new TextLoader(file);
        break;
      default:
        loader = null;
    }

    if (!loader) {
      return {
        error: "File type not supported",
      };
    }

    const embeddings = new OpenAIEmbeddings();
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

    const store = await PGVectorStore.initialize(embeddings, config);

    const docs = await loader.load();
    //   for (const doc of docs) {
    //     const { content, text, metadata } = doc;

    //   }
    await store.addDocuments(docs);
    return { status: "success", error: null };
  } catch (e: any) {
    console.error(e);
    return { status: "error", error: e?.message };
  }
};
