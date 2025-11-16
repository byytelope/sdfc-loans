import { BanknoteXIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const EmptyPayments = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BanknoteXIcon />
        </EmptyMedia>
        <EmptyTitle>No Payments Found</EmptyTitle>
        <EmptyDescription>{"No payments have been made."}</EmptyDescription>
      </EmptyHeader>
      {isAdmin && <EmptyContent>{/* <CreateLoanDialog /> */}</EmptyContent>}
    </Empty>
  );
};
