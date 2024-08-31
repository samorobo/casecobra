"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { ChangeOrderStatus } from "./actions";
import { Check, ChevronsUpDown } from "lucide-react";

// Map for converting OrderStatus enum to readable labels
const LABEL_MAP: Record<OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
};

interface StatusDropdownProps {
  id: string;
  orderStatus: OrderStatus;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ id, orderStatus }) => {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["change-order-status"],
    mutationFn: (newStatus: { id: string; newStatus: OrderStatus }) => ChangeOrderStatus(newStatus),
    onSuccess: () => router.refresh(), // Refresh the page on success
  });

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (orderStatus !== newStatus) {
      mutate({ id, newStatus });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-52 flex justify-between items-center">
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.values(OrderStatus).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
              { "bg-zinc-100": orderStatus === status }
            )}
            onClick={() => handleStatusChange(status)}
          >
            <Check
              className={cn("mr-2 h-4 w-4 text-primary", {
                "opacity-100": orderStatus === status,
                "opacity-0": orderStatus !== status,
              })}
            />
            {LABEL_MAP[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;