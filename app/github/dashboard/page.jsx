"use client";

import ChartIssueAndPR from "@/components/shadcn/ChartIssueAndPR";
import React from "react";

const GithubDashboard = () => {
  return (
    <div className="flex min-h-svh flex-col items-center  gap-6 bg-muted p-6 md:p-10">
      <h1 className=" mt-4 text-4xl font-bold mb-10">PR and Issue Dashboard</h1>
      <ChartIssueAndPR GITHUB_REPO={"keploy/keploy"}/>
      <ChartIssueAndPR GITHUB_REPO={"keploy/samples-go"}/>
      <ChartIssueAndPR GITHUB_REPO={"keploy/blog-website"}/>
    </div>
  );
};

export default GithubDashboard;
