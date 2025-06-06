import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EthernetPortIcon } from "lucide-react";

interface EthernetData {
  link_status: string;
  link_speed: string;
  auto_negotiation: string;
}

const formatSpeed = (speed: string): string => {
  if (speed === "Unknown!") return "-";

  // Extract the numeric value using regex
  const match = speed.match(/(\d+)/);
  if (!match) return speed;

  const numericSpeed = parseInt(match[1], 10);

  // Convert to Gb/s if speed is 1000Mb/s or higher
  if (numericSpeed >= 1000) {
    const gbSpeed = numericSpeed / 1000;
    return `${gbSpeed}${speed.includes("Gb") ? "Gb/s" : "Gb/s"}`;
  }

  return `${numericSpeed}${speed.includes("Mb") ? "Mb/s" : "Mb/s"}`;
};

const EthernetCard = () => {
  const [ethernetData, setEthernetData] = useState<EthernetData>({
    link_status: "Loading...",
    link_speed: "Loading...",
    auto_negotiation: "Loading...",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEthernetInfo = async () => {
      try {
        const response = await fetch(
          "/cgi-bin/quecmanager/home/fetch_hw_details.sh?type=eth",
          {
            method: "GET",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: EthernetData = await response.json();
        setEthernetData(data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch Ethernet information");
        setIsLoading(false);
      }
    };

    fetchEthernetInfo();
  }, []);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ethernet Information</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ethernet Information</CardTitle>
        <CardDescription>
          Shows the status of the Ethernet connection and its speed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-3 grid-cols-1 grid-flow-row gap-4 place-items-center">
          <div className="flex justify-center items-center rounded-full bg-gray-100 dark:bg-gray-800 w-36 h-36  lg:p-6 p-4">
            {ethernetData.link_status === "yes" ? (
              <EthernetPortIcon className="size-full text-emerald-500 animate-pulse" />
            ) : (
              <EthernetPortIcon className="size-full text-red-500 animate-pulse" />
            )}
          </div>

          <div className="flex flex-row items-start justify-between gap-x-2 w-full lg:col-span-2 col-span-1 lg:px-4 px-1">
            <div className="grid gap-1">
              <span className="text-sm text-muted-foreground">Link Status</span>
              <span className="text-base font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : ethernetData.link_status === "yes" ? (
                  "Active"
                ) : (
                  "Inactive"
                )}
              </span>
            </div>

            <div className="grid gap-1">
              <span className="text-sm text-muted-foreground">Link Speed</span>
              <span className="text-base font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  formatSpeed(ethernetData.link_speed)
                )}
              </span>
            </div>

            <div className="grid gap-1">
              <span className="text-sm text-muted-foreground">
                Auto-negotiation
              </span>
              <span className="text-base font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : ethernetData.auto_negotiation === "on" ? (
                  "Active"
                ) : (
                  "Inactive"
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EthernetCard;
