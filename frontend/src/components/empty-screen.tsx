import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";

const exampleMessages = [
  {
    heading: "どんな情報アクセスできますか?",
    message: "どんな情報アクセスできますか?",
  },
  {
    heading: "各自動車メーカーの販売台数（千台）を棒グラフで表示してください。",
    message: "各自動車メーカーの販売台数（千台）を棒グラフで表示してください。",
  },
  {
    heading: "エンジンサイズと馬力の関係を散布図で分析してください。",
    message: "エンジンサイズと馬力の関係を散布図で分析してください。",
  },
  {
    heading: "テーブルで最初の５つのデータポイントを表示してください。",
    message: "テーブルで最初の５つのデータポイントを表示してください。",
  },
];

export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <h1 className="mb-2 text-lg font-semibold">
          AI SDK 3.0 Generative UIとVector DB デモ!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          AI SDK 3.0 Generative UIとPG
          VectorとOPENAIに用意たAIチャットアプリのデモ
        </p>

        <p className="leading-normal text-muted-foreground">使ってみよう！:</p>
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
