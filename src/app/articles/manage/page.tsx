import * as React from "react";
import { infos } from "@/app/api/mocks/home.mock";
import InfoSquare from "@/app/components/InfoSquare";
import PieChart from "@/app/components/PieChart";

export default function ManagerPage() {
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chart-1)" },
    { browser: "safari", visitors: 200, fill: "var(--color-chart-2)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-chart-3)" },
    { browser: "edge", visitors: 173, fill: "var(--color-chart-4)" },
    { browser: "other", visitors: 190, fill: "var(--color-chart-5)" },
  ];
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-col gap-10 ">
      <div className="w-full flex justify-center items-center gap-10">
        {infos.map((info, idx) => (
          <InfoSquare key={idx} title={info.title} content={info.content} />
        ))}
      </div>
      <div className="flex items-center justify-center rounded-[10] py-10 bg-white shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)]">
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl font-bold">Grafico 1</p>
          <span className="flex justify-center h-80 w-80">
            <PieChart data={chartData} totalCount={totalVisitors} />
          </span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl font-bold">Grafico 2</p>
          <span className="flex justify-center h-80 w-80">
            <PieChart data={chartData} totalCount={totalVisitors} />
          </span>
        </div>
      </div>
    </section>
  );
}
