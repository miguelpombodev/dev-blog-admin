"use client";

import { useState, useEffect, useTransition } from "react";
import { infos } from "@/app/api/mocks/home.mock";
import InfoSquare from "@/app/components/InfoSquare";
import PieChart from "@/app/components/PieChart";
import { getAdminInformations, getHealthCheck } from "@/actions/admin.actions";
import {
  IAdminArticlesInformations,
  IHealthCheck,
} from "@/interfaces/http/admin.interface";
import Modal from "@/app/components/Modal";
import Spinner from "@/app/components/Spinner";

export default function ManagerPage() {
  const [articleInformations, setArticleInformations] =
    useState<IAdminArticlesInformations>({} as IAdminArticlesInformations);
  const [health, setHealth] = useState<IHealthCheck>({} as IHealthCheck);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await getAdminInformations();
        const healthCheck = await getHealthCheck();
        setArticleInformations(result);
        setHealth(healthCheck);
      } catch {
        setError("Erro ao carregar informações do painel.");
        setShowModal(true);
      }
    });
  }, []);

  return (
    <>
      <section className="flex flex-col gap-10">
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {!isPending && health.status && (
              <span className="flex bg-white rounded-[10] gap-4 justify-center self-center items-center w-4/12 h-10 shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)]">
                <span className="flex gap-1">
                  <p>API Status: </p>
                  <span className="font-bold">
                    {health.status.toUpperCase()}
                  </span>
                </span>
                <span
                  style={{
                    backgroundColor:
                      health.status === "ok" ? "#33e346" : "#f91e1e",
                  }}
                  className="w-[30px] h-[30px] rounded-full"
                />
              </span>
            )}
            <div className="w-full flex justify-center items-center gap-10">
              {infos.map((info, idx) => (
                <InfoSquare
                  key={idx}
                  title={info.title}
                  content={info.content}
                />
              ))}
            </div>

            <div className="flex items-center justify-center rounded-[10] py-10 bg-white shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)]">
              <div className="flex flex-col justify-center items-center">
                <p className="text-2xl font-bold">Grafico 1</p>
                <span className="flex justify-center h-80 w-80">
                  <PieChart
                    title="Articles"
                    nameKey="name"
                    dataKey="count"
                    data={articleInformations.articlesCategoriesCount}
                    totalCount={articleInformations.count}
                  />
                </span>
              </div>
            </div>
          </>
        )}
      </section>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isSuccess={false}
        message={error || ""}
      />
    </>
  );
}
