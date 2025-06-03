"use client";

import { useState, useEffect, useTransition } from "react";
import { chartData, infos } from "@/app/api/mocks/home.mock";
import InfoSquare from "@/app/components/InfoSquare";
import PieChart from "@/app/components/PieChart";
import {
  IAdminArticlesInformations,
  IHealthCheck,
} from "@/interfaces/http/admin.interface";
import Spinner from "@/app/components/Spinner";
import ResultModalComponent from "@/app/components/ResultModal";
import {
  getAdminInformations,
  getAllArticle,
  getHealthCheck,
} from "@/actions/admin.actions";
import ArticleCardComponent from "@/app/components/ArticleCard";
import { IArticle } from "@/interfaces/http/articles.interface";
import { Card, CardContent } from "@/components/ui/card";

export default function ManagerPage() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [articleInformations, setArticleInformations] =
    useState<IAdminArticlesInformations>({} as IAdminArticlesInformations);
  const [health, setHealth] = useState<IHealthCheck>({} as IHealthCheck);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      try {
        const [result, healthCheck, articlesResult] = await Promise.all([
          getAdminInformations(),
          getHealthCheck(),
          getAllArticle(),
        ]);

        setArticleInformations(result);
        setHealth(healthCheck);
        setArticles(articlesResult);
      } catch {
        setError("Erro ao carregar informações do painel.");
        setShowModal(true);
      }
    });
  }, []);

  return (
    <>
      {isPending && <Spinner />}
      <section className="flex flex-col gap-10">
        {isPending || !health.status ? (
          <span className="flex bg-white rounded-[10] gap-4 justify-center self-center items-center w-4/12 h-10 shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)] filter blur-sm transition-all">
            <span className="flex gap-1">
              <p>API Status: </p>
              <span className="font-bold">teste</span>
            </span>
            <span
              style={{
                backgroundColor: "#f91e1e",
              }}
              className="w-[30px] h-[30px] rounded-full"
            />
          </span>
        ) : (
          <span className="flex bg-white rounded-[10] gap-4 justify-center self-center items-center w-4/12 h-10 shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)]">
            <span className="flex gap-1">
              <p>API Status: </p>
              <span className="font-bold">{health.status?.toUpperCase()}</span>
            </span>
            <span
              style={{
                backgroundColor:
                  health?.status === "ok" ? "#33e346" : "#f91e1e",
              }}
              className="w-[30px] h-[30px] rounded-full"
            />
          </span>
        )}
        {isPending ||
        !articleInformations ||
        !articleInformations.getArticlesAndTagsInformations ? (
          <div className="w-full flex justify-center items-center gap-10 filter blur-sm transition-all">
            {infos.map((info, idx) => (
              <InfoSquare key={idx} title={info.title} content={info.content} />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center gap-10">
            {articleInformations.getArticlesAndTagsInformations.map(
              (info, idx) => (
                <InfoSquare
                  key={idx}
                  title={info.title}
                  content={info.count.toString()}
                />
              )
            )}
          </div>
        )}
        <div className="flex items-center justify-center rounded-[10] py-10 bg-white shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)]">
          <div className="flex flex-col justify-center items-center">
            <p className="text-2xl font-bold">Articles Category Count</p>
            <span
              className={`flex justify-center ${
                isPending && "items-center"
              } h-80 w-80 ${
                articleInformations.articlesCategoriesCount && "relative"
              }`}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <>
                  {articleInformations.articlesCategoriesCount && (
                    <span className="flex justify-center items-center w-[60%] h-[16%] bg-white z-1 rounded-[10] absolute top-[42%]">
                      No items to be displayed
                    </span>
                  )}
                  {!articleInformations.articlesCategoriesCount ? (
                    <PieChart
                      title="Articles"
                      nameKey="name"
                      dataKey="count"
                      data={articleInformations.articlesCategoriesCount}
                      totalCount={articleInformations.count}
                      isBlurred={false}
                    />
                  ) : (
                    <PieChart
                      title="Articles"
                      nameKey="browser"
                      dataKey="visitors"
                      data={chartData}
                      totalCount={0}
                      isBlurred={true}
                    />
                  )}
                </>
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-5 ">
          <h1 className="text-3xl font-bold mb-6">Availables Articles</h1>
          {isPending || !articles ? (
            <span>
              <Card className="filter blur-sm transition-all">
                <CardContent>No cards to be shown</CardContent>
              </Card>
            </span>
          ) : (
            <span>
              {!articles.length && (
                <Card>
                  <CardContent>No cards to be shown</CardContent>
                </Card>
              )}

              {articles.map((article) => (
                <ArticleCardComponent key={article._id} article={article} />
              ))}
            </span>
          )}
        </div>
      </section>

      <ResultModalComponent
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isSuccess={false}
        message={error || ""}
      />
    </>
  );
}
