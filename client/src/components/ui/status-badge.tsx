import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType = 'in-stock' | 'low-stock' | 'out-of-stock' | 'pending' | 'shipped' | 'delivered' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      case 'pending':
        return 'Pending';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <span className={cn(
      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
      getVariant(),
      className
    )}>
      {getLabel()}
    </span>
  );
}
