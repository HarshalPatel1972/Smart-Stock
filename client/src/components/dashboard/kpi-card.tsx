import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBackground?: string;
  iconColor?: string;
  valueColor?: string;
  linkText?: string;
  linkHref?: string;
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  iconBackground = "bg-primary-50",
  iconColor = "text-primary-600",
  valueColor = "text-gray-900",
  linkText = "View all",
  linkHref = "#",
}: KpiCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBackground)}>
            <Icon className={cn("text-xl", iconColor)} size={20} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className={cn("text-lg font-semibold", valueColor)}>{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {linkText && linkHref && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link href={linkHref} className="font-medium text-primary-600 hover:text-primary-700">
              {linkText}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
