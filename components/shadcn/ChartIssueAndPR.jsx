import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent } from "@/components/shadcn/ui/card";
import { Skeleton } from "@/components/shadcn/ui/skeleton";

// const GITHUB_REPO = "keploy/keploy";
// const GITHUB_REPO = "facebook/react";

export default function ChartIssueAndPR({ GITHUB_REPO }) {
  // export default function GitHubCharts() {
  const [issuesData, setIssuesData] = useState(null);
  const [prData, setPrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const issuesRes = await fetch(
          `http://localhost:8080/api/github/${GITHUB_REPO}/issues`
          // `https://api.github.com/repos/${GITHUB_REPO}/issues?per_page=100`
        );
        const issues = await issuesRes.json();

        const prsRes = await fetch(
          `http://localhost:8080/api/github/${GITHUB_REPO}/pull-requests`
          // `https://api.github.com/repos/${GITHUB_REPO}/pulls?per_page=100`
        );
        const prs = await prsRes.json();

        const groupByDate = (data, key) => {
          return data.reduce((acc, item) => {
            const date = item[key].split("T")[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});
        };

        const formatChartData = (groupedData) =>
          Object.keys(groupedData).map((date) => ({
            date,
            count: groupedData[date],
          }));

        setIssuesData(formatChartData(groupByDate(issues, "created_at")));
        setPrData(formatChartData(groupByDate(prs, "created_at")));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2">Issues Over Time</h2>
          {loading ? (
            <Skeleton className="h-40" />
          ) : (
            <LineChart width={400} height={250} data={issuesData}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2">Pull Requests Over Time</h2>
          {loading ? (
            <Skeleton className="h-40" />
          ) : (
            <BarChart width={400} height={250} data={prData}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              {/* <Bar dataKey="count" fill="#82ca9d" /> */}
              <Bar dataKey="count" fill="#ff5722" />
            </BarChart>
          )}
        </CardContent>
      </Card>

      <h1 className=" mt-4 text-xl font-bold mb-10 ">
        For
        <a href={`https://github.com/${GITHUB_REPO}`}>
          <span className="text-lime-500 font-medium ml-3">{GITHUB_REPO}</span>
        </a>
      </h1>
    </div>
  );
}
