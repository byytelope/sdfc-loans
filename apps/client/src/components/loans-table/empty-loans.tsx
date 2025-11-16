import { BanknoteXIcon } from "lucide-react";

import { CreateLoanDialog } from "@/components/create-loan-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const EmptyLoans = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BanknoteXIcon />
        </EmptyMedia>
        <EmptyTitle>No Loans Found</EmptyTitle>
        <EmptyDescription>
          {"You have no loans that are active."}
        </EmptyDescription>
      </EmptyHeader>
      {isAdmin && (
        <EmptyContent>
          <CreateLoanDialog />
        </EmptyContent>
      )}
    </Empty>
  );
};
